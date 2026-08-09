import { MemberDataDetailModel } from '@/model/member';
import { OrganizationDetailModel } from '@/model/organization';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { TransferCoinBalanceListModel } from '@/model/transfer_coin_balance';

/**
 * Props สำหรับ WithdrawCoinPage component
 */
export interface WithdrawCoinPageProps {
  params: Promise<{ id?: string }> | null;
}

/**
 * Props สำหรับ WalletDetails component
 */
export interface WalletDetailsProps {
  overviewDetailById: OverviewDetailListModel | undefined;
  organizationId: string;
  isLoading?: boolean;
  memberData : MemberDataDetailModel | null ;
}

/**
 * Props สำหรับ WithdrawCoinHistoryTable component
 */
export interface WithdrawCoinHistoryTableProps {
  transferCoinBalance: TransferCoinBalanceListModel | undefined;
  error: any;
  memberId: string;
  isLoading?: boolean;
}

/**
 * Props สำหรับ OrganizationSelector component
 */
export interface OrganizationSelectorProps {
  value: string;
  options: OrganizationDetailModel[];
  onChange: (organizationId: string) => void;
  disabled?: boolean;
}

/**
 * Member detail interface
 */
export interface MemberDetail {
  member_id: string;
  nick_name?: string;
  user_px?: string;
  profile?: string;
  member_wallet?: any[];
}

/**
 * Wallet data interface
 */
export interface WalletData {
  wallet?: {
    coin?: number;
  };
}

/**
 * Transfer status types
 */
export type TransferStatus = 'Success' | 'Reject' | 'Pending';

/**
 * Transfer history item interface
 */
export interface TransferHistoryItem {
  created_at: string;
  coin: number;
  balance: number;
  status: TransferStatus;
  created_by_id: string;
  description?: string;
}

