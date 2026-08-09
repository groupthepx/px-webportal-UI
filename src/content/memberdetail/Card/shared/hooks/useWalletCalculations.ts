/**
 * Custom Hook สำหรับคำนวณยอดเงินใน wallet
 * รวม logic การคำนวณ wallet ทั้งหมดไว้ใน hook เดียว
 * เพิ่ม memoization เพื่อป้องกันการคำนวณซ้ำ
 */

import { useMemo } from 'react';
import { MemberWalletNonOrg } from '@/model/member';

interface WalletItem {
  organization_id: string | number;
  wallet: {
    coin: number;
    balance: number;
  };
}

interface WalletCalculations {
  totalPxCoin: number;
  totalWalletBalance: number;
  getWalletByOrganization: (organizationId: string | number) => WalletItem | undefined;
  getCoinByOrganization: (organizationId: string | number) => number;
  getBalanceByOrganization: (organizationId: string | number) => number;
}

/**
 * Hook สำหรับคำนวณข้อมูล wallet
 * @param walletData - Array ของ wallet items (สำหรับ VJ members)
 * @param walletNonOrgData - Array ของ non-org wallet items (สำหรับ non-VJ members)
 * @returns Object ที่มีข้อมูลและ helper functions
 */
export const useWalletCalculations = (
  walletData?: WalletItem[],
  walletNonOrgData?: MemberWalletNonOrg[]
): WalletCalculations => {
  // คำนวณยอดรวม PX Coin
  const totalPxCoin = useMemo(() => {
    const vjCoins = walletData?.reduce((sum, w) => {
      const coin = w.wallet?.coin ?? 0;
      return sum + coin;
    }, 0) ?? 0;

    const nonVjCoins = walletNonOrgData?.reduce((sum, w) => {
      const coin = w.wallet?.coin ?? 0;
      return sum + coin;
    }, 0) ?? 0;

    return vjCoins + nonVjCoins;
  }, [walletData, walletNonOrgData]);

  // คำนวณยอดรวม Wallet Balance
  const totalWalletBalance = useMemo(() => {
    const vjBalance = walletData?.reduce((sum, w) => {
      const balance = w.wallet?.balance ?? 0;
      return sum + balance;
    }, 0) ?? 0;

    const nonVjBalance = walletNonOrgData?.reduce((sum, w) => {
      const balance = w.wallet?.balance ?? 0;
      return sum + balance;
    }, 0) ?? 0;

    return vjBalance + nonVjBalance;
  }, [walletData, walletNonOrgData]);

  // Function สำหรับดึง wallet ตาม organization ID
  const getWalletByOrganization = useMemo(
    () => (organizationId: string | number) => {
      return walletData?.find(w => w.organization_id == organizationId);
    },
    [walletData]
  );

  // Function สำหรับดึง coin ตาม organization ID
  const getCoinByOrganization = useMemo(
    () => (organizationId: string | number) => {
      const wallet = walletData?.find(w => w.organization_id == organizationId);
      return wallet?.wallet?.coin ?? 0;
    },
    [walletData]
  );

  // Function สำหรับดึง balance ตาม organization ID
  const getBalanceByOrganization = useMemo(
    () => (organizationId: string | number) => {
      const wallet = walletData?.find(w => w.organization_id == organizationId);
      return wallet?.wallet?.balance ?? 0;
    },
    [walletData]
  );

  return {
    totalPxCoin,
    totalWalletBalance,
    getWalletByOrganization,
    getCoinByOrganization,
    getBalanceByOrganization,
  };
};

