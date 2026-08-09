export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'success' | 'pending' | 'rejected' | 'refunded' | 'unknown';
export type TransactionFormat = 'เงิน' | 'Coin PX' | 'คะแนน' | 'ไม่ระบุ';
export type TransactionSource = 'coin' | 'live' | 'admin' | 'level' | 'market';

export interface TransactionRow {
  id: string;
  appId: string;
  appName: string;
  appLogo?: string;
  type: TransactionType;
  format: TransactionFormat;
  item: string;
  status: TransactionStatus;
  amount: number;
  note: string;
  createdAt?: string;
  source: TransactionSource;
}

export interface TransactionFilters {
  appId: string;
  type: 'all' | TransactionType;
  format: 'all' | TransactionFormat;
  status: 'all' | TransactionStatus;
}

export interface TransactionRowOptions {
  source: TransactionSource;
  format?: TransactionFormat;
  type?: TransactionType;
  appId?: string;
  appName?: string;
  appLogo?: string;
}

export interface GeneralMemberTransactionInput {
  coupons?: Array<Record<string, any>>;
  gifts?: Array<Record<string, any>>;
  referrals?: Array<Record<string, any>>;
  rewards?: Array<Record<string, any>>;
  transfers?: Array<Record<string, any>>;
}

const stringValue = (value: unknown) => (value === null || value === undefined ? '' : String(value).trim());

const firstValue = (...values: unknown[]) => values.map(stringValue).find(Boolean) || '';

export const normalizeAppName = (value: unknown) => stringValue(value)
  .toLocaleLowerCase()
  .replace(/\s+/g, '')
  .replace(/[._-]/g, '');

export const normalizeStatus = (value: unknown): TransactionStatus => {
  const status = stringValue(value).toLowerCase();
  if (['refund', 'refunded', 'คืนคะแนน', 'คืนเงิน'].some((word) => status.includes(word))) return 'refunded';
  if (['reject', 'rejected', 'failed', 'cancel', 'cancelled', 'canceled', 'ไม่สำเร็จ', 'ปฏิเสธ'].some((word) => status.includes(word))) return 'rejected';
  if (['success', 'succeed', 'completed', 'complete', 'approved', 'confirmed', 'shipped', 'delivered', 'earned', 'active', 'claimed', 'received', 'อนุมัติ', 'สำเร็จ', 'ได้รับ'].some((word) => status.includes(word))) return 'success';
  if (['pending', 'processing', 'waiting', 'sending', 'รอ', 'กำลังดำเนินการ'].some((word) => status.includes(word))) return 'pending';
  return 'unknown';
};

const isExpense = (item: Record<string, unknown>) => {
  const value = [
    item.type,
    item.transaction_type,
    item.direction,
    item.member_reward_type,
    item.pay_currency,
    item.description,
    item.remark,
    item.detail,
    item.item,
  ].map(stringValue).join(' ').toLowerCase();

  return ['expense', 'out', 'withdraw', 'redeem', 'spend', 'แลก', 'ถอน', 'จ่าย', 'รายจ่าย'].some((word) => value.includes(word));
};

const resolveAmount = (item: Record<string, unknown>) => {
  // add_reward_history stores the actual reward in one or more component
  // fields while `amount` is commonly kept as 0. Prefer the same component
  // total used by the existing member history screen.
  const rewardComponents = [
    item.mission_coin_up,
    item.bonus_mission,
    item.vj_active,
    item.rank_bonus,
    item.coin_up_from_excel,
    item.collect_mission,
    item.coupon_amount,
    item.refer_bonus,
    item.learn_amount,
    item.transfer_coin_balance,
    item.order_amount,
    item.live_bonus,
  ]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .reduce((total, value) => total + value, 0);
  const candidates = [
    rewardComponents,
    item.points,
    item.score,
    item.coin,
    item.value,
    item.points_used,
    item.coin_reward,
    item.order_price,
    item.balance,
    item.amount,
  ];
  const parsedCandidates = candidates
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
  const nonZero = parsedCandidates.find((value) => value !== 0);
  return Math.abs(nonZero ?? parsedCandidates[0] ?? 0);
};

const resolveApp = (item: Record<string, any>, options: TransactionRowOptions) => {
  const organization = item.organization || {};
  return {
    appId: firstValue(item.organization_id, item.organizationId, organization.organization_id, options.appId) || 'unknown-app',
    appName: firstValue(item.company_name, item.organization_name, organization.company_name, options.appName) || 'ไม่ระบุแอป',
    appLogo: firstValue(item.company_logo, organization.company_logo, options.appLogo) || undefined,
  };
};

export const toTransactionRows = (
  items: Array<Record<string, any>> = [],
  options: TransactionRowOptions,
): TransactionRow[] => items.map((item, index) => {
  const app = resolveApp(item, options);
  const type = options.type || (isExpense(item) ? 'expense' : 'income');
  const sourceLabel = options.source === 'live' ? 'คะแนนจากการขึ้น Live' : options.source === 'level' ? 'คะแนนจากการสำเร็จ Level' : options.source === 'admin' ? 'คะแนนจาก Admin' : options.source === 'market' ? 'รายการ PX Market' : 'ธุรกรรม Coin PX';

  return {
    id: firstValue(item.id, item.order_id, item.reward_history_id, item.add_reward_history_id, item.transfer_coin_balance_history_id, `${options.source}-${index}`),
    ...app,
    type,
    format: options.format || (item.currency === 'THB' || item.currency === 'เงิน' ? 'เงิน' : 'Coin PX'),
    item: firstValue(
      item.item,
      item.description,
      item.detail,
      item.remark,
      item.mission_coin_up_detail,
      item.bonus_mission_detail,
      item.vj_active_detail,
      item.rank_bonus_detail,
      item.coin_up_from_excel_detail,
      item.learn_detail,
      item.order_detail,
      item.coupon_detail,
      item.refer_bonus_detail,
      item.transfer_coin_balance_detail,
      item.live_bonus_detail,
      sourceLabel,
    ) || sourceLabel,
    status: normalizeStatus(item.status || item.order_status),
    amount: resolveAmount(item),
    note: firstValue(item.note, item.remark, item.reason, item.rejection_reason),
    createdAt: firstValue(item.created_at, item.createdAt, item.date, item.updated_at) || undefined,
    source: options.source,
  };
});

const generalOptions = {
  appId: 'general',
  appName: 'ทั่วไป',
} as const;

const withoutOrganization = (item: Record<string, any>) => ({
  ...item,
  organization_id: undefined,
  organizationId: undefined,
  organization: undefined,
});

const rewardDescription = (item: Record<string, any>) => [item.item, item.detail, item.description, item.remark, item.order_detail]
  .map(stringValue)
  .join(' ')
  .toLowerCase();

export const filterGeneralRewardHistory = (items: Array<Record<string, any>> = []) => items.filter((item) => {
  if (Number(item.transfer_coin_balance ?? 0) > 0) return false;
  if (Number(item.order_amount ?? 0) <= 0) return true;

  // Accepted gifts also use order_amount, but market orders are already
  // supplied by the dedicated order history endpoint.
  return rewardDescription(item).includes('ของขวัญ') || rewardDescription(item).includes('gift');
});

const toGeneralRewardRows = (items: Array<Record<string, any>>, source: TransactionSource = 'admin') => items.flatMap((item, index) => {
  const rewardText = [rewardDescription(item), item.coin_up_from_excel_detail]
    .map(stringValue)
    .join(' ')
    .toLowerCase();
  const hasScore = Number(item.coin_up_from_excel ?? 0) > 0
    || Number(item.points ?? 0) > 0
    || Number(item.score ?? 0) > 0
    || rewardText.includes('คะแนน')
    || rewardText.includes('point')
    || rewardText.includes('score');
  const normalized = withoutOrganization({
    ...item,
    id: item.id || item.add_reward_history_id || `${source}-${index}`,
  });
  return toTransactionRows([normalized], {
    source,
    format: hasScore ? 'คะแนน' : 'Coin PX',
    ...generalOptions,
  });
});

export const toGeneralMemberTransactionRows = ({
  coupons = [],
  gifts = [],
  referrals = [],
  rewards = [],
  transfers = [],
}: GeneralMemberTransactionInput): TransactionRow[] => {
  const couponRows = coupons.flatMap((coupon, index) => toTransactionRows([withoutOrganization({
    ...coupon,
    id: coupon.id || coupon.coupon_id || `coupon-${index}`,
    item: firstValue(coupon.item, coupon.title, coupon.description, 'อังเปา'),
    amount: coupon.amount,
  })], {
    source: 'admin',
    format: 'Coin PX',
    type: 'income',
    ...generalOptions,
  }));
  const giftRows = gifts.flatMap((gift, index) => toTransactionRows([withoutOrganization({
    ...gift,
    id: gift.id || gift.gift_id || `gift-${index}`,
    item: firstValue(gift.item, gift.product?.product_name ? `ของขวัญ ${gift.product.product_name}` : '', 'ของขวัญ'),
    amount: gift.gift_price,
  })], {
    source: 'admin',
    format: 'Coin PX',
    type: 'income',
    ...generalOptions,
  }));
  const referralRows = toGeneralRewardRows(referrals);
  const rewardRows = toGeneralRewardRows(rewards);
  const transferRows = transfers.flatMap((transfer, index) => toTransactionRows([withoutOrganization({
    ...transfer,
    id: transfer.id || transfer.transfer_coin_balance_history_id || `transfer-${index}`,
  })], {
    source: 'coin',
    format: 'Coin PX',
    ...generalOptions,
  }));

  return [...couponRows, ...giftRows, ...referralRows, ...rewardRows, ...transferRows];
};

export const filterTransactions = (rows: TransactionRow[], filters: TransactionFilters) => rows.filter((row) => (
  (filters.appId === 'all' || row.appId === filters.appId)
  && (filters.type === 'all' || row.type === filters.type)
  && (filters.format === 'all' || row.format === filters.format)
  && (filters.status === 'all' || row.status === filters.status)
));
