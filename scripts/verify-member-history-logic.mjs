import test from 'node:test';
import assert from 'node:assert/strict';
import { filterGeneralRewardHistory, filterTransactions, normalizeAppName, normalizeStatus, toGeneralMemberTransactionRows, toTransactionRows } from '../src/content/MemberHistory/transactionHistory.ts';

test('keeps every app separate and never labels an item as all apps', () => {
  const rows = toTransactionRows([
    { id: '1', organization_id: 'pati', organization_name: 'Pati', amount: 100 },
    { id: '2', organization_id: 'tiktok', organization_name: 'TikTok', amount: 200 },
  ], { source: 'coin', format: 'Coin PX' });

  assert.deepEqual(rows.map((row) => row.appName), ['Pati', 'TikTok']);
  assert.equal(rows.some((row) => row.appName === 'รวมทุก App'), false);
});

test('filters by app, type, format, and status together', () => {
  const rows = [
    { id: '1', appId: 'pati', appName: 'Pati', type: 'income', format: 'คะแนน', status: 'success', amount: 100 },
    { id: '2', appId: 'tiktok', appName: 'TikTok', type: 'expense', format: 'Coin PX', status: 'rejected', amount: 50 },
  ];

  assert.equal(filterTransactions(rows, { appId: 'pati', type: 'income', format: 'คะแนน', status: 'success' }).length, 1);
});

test('maps score transactions to the score format and preserves the app', () => {
  const rows = toTransactionRows([
    { id: 'live-1', organization_id: 'pati', company_name: 'Pati', points: 25, detail: 'ขึ้น Live' },
  ], { source: 'live', format: 'คะแนน', type: 'income' });

  assert.equal(rows[0].format, 'คะแนน');
  assert.equal(rows[0].type, 'income');
  assert.equal(rows[0].appName, 'Pati');
});

test('matches app names even when the API uses different spacing or punctuation', () => {
  assert.equal(normalizeAppName('Tik Tok'), normalizeAppName('Tik-Tok'));
});

test('maps backend transaction statuses to visible statuses', () => {
  assert.equal(normalizeStatus('earned'), 'success');
  assert.equal(normalizeStatus('active'), 'success');
  assert.equal(normalizeStatus('claimed'), 'success');
  assert.equal(normalizeStatus('PENDING'), 'pending');
  assert.equal(normalizeStatus('sending'), 'pending');
  assert.equal(normalizeStatus('refunded'), 'refunded');
  assert.equal(normalizeStatus('CANCELLED'), 'rejected');
});

test('maps General User wallet rewards without an app fallback', () => {
  const rows = toGeneralMemberTransactionRows({
    coupons: [{ coupon_id: 'coupon-1', amount: 20, status: 'claimed', title: 'อังเปาจากแอดมิน' }],
    gifts: [{ gift_id: 'gift-1', gift_price: 50, status: 'ACCEPTED', product: { product_name: 'ของขวัญต้อนรับ' } }],
    referrals: [{ add_reward_history_id: 'refer-1', refer_bonus: 30, refer_bonus_detail: 'แนะนำเพื่อน' }],
    rewards: [{ add_reward_history_id: 'score-1', coin_up_from_excel: 10, coin_up_from_excel_detail: 'คะแนนจากแอดมิน' }],
    transfers: [{ transfer_coin_balance_history_id: 'transfer-1', transfer_coin_balance: 100, status: 'success' }],
  });

  assert.deepEqual(rows.map((row) => row.appId), ['general', 'general', 'general', 'general', 'general']);
  assert.equal(rows.some((row) => row.appName === 'ไม่ระบุแอป'), false);
  assert.deepEqual(rows.map((row) => row.format), ['Coin PX', 'Coin PX', 'Coin PX', 'คะแนน', 'Coin PX']);
  assert.deepEqual(rows.map((row) => row.type), ['income', 'income', 'income', 'income', 'income']);
});

test('keeps accepted gift rewards while excluding duplicated transfer and market rewards', () => {
  const rows = filterGeneralRewardHistory([
    { add_reward_history_id: 'gift-1', order_amount: 25, order_detail: 'ได้รับของขวัญ ของขวัญต้อนรับ' },
    { add_reward_history_id: 'market-1', order_amount: 50, order_detail: 'แลกของจากตลาด PX' },
    { add_reward_history_id: 'transfer-1', transfer_coin_balance: 100, transfer_coin_balance_detail: 'โอนเข้ากระเป๋า' },
  ]);

  assert.deepEqual(rows.map((row) => row.add_reward_history_id), ['gift-1']);
});

test('keeps legacy reward and market records instead of dropping zero amount rows', () => {
  const reward = toTransactionRows([
    { add_reward_history_id: 'reward-1', amount: 0, learn_amount: 30, member_reward_type: 'Income', status: 'success' },
  ], { source: 'coin', format: 'Coin PX', appId: 'pati', appName: 'Pati' });
  const market = toTransactionRows([
    { order_id: 'order-1', order_price: 50, order_status: 'CONFIRMED' },
  ], { source: 'market', format: 'Coin PX', type: 'expense', appId: 'px-market', appName: 'ตลาด PX' });

  assert.equal(reward[0].amount, 30);
  assert.equal(reward[0].type, 'income');
  assert.equal(market[0].amount, 50);
  assert.equal(market[0].type, 'expense');
});

test('clear filters returns all transaction rows', () => {
  const rows = [
    { id: '1', appId: 'pati', appName: 'Pati', type: 'income', format: 'คะแนน', status: 'success', amount: 100 },
    { id: '2', appId: 'tiktok', appName: 'TikTok', type: 'expense', format: 'Coin PX', status: 'rejected', amount: 50 },
  ];

  assert.equal(filterTransactions(rows, { appId: 'all', type: 'all', format: 'all', status: 'all' }).length, 2);
});
