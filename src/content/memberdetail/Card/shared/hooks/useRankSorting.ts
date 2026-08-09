/**
 * Custom Hook สำหรับจัดเรียง rank data
 * ใช้ useMemo เพื่อป้องกันการ sort ซ้ำๆ
 */

import { useMemo } from 'react';

interface RankMemberAmount {
  amount: number;
}

interface RankItem {
  member_id: string;
  member_amount?: RankMemberAmount[];
  profile?: string;
  nick_name?: string;
  [key: string]: any;
}

/**
 * Hook สำหรับ sort rank data ตามจำนวน amount
 * @param rankData - Array ของ rank items
 * @returns Sorted rank array
 */
export const useRankSorting = (rankData: RankItem[] = []): RankItem[] => {
  return useMemo(() => {
    if (!rankData || rankData.length === 0) return [];

    return [...rankData].sort((a, b) => {
      const amountA = a.member_amount?.[0]?.amount ?? 0;
      const amountB = b.member_amount?.[0]?.amount ?? 0;
      return amountB - amountA;
    });
  }, [rankData]);
};

/**
 * Hook สำหรับ sort และ limit rank data
 * @param rankData - Array ของ rank items
 * @param limit - จำนวนสูงสุดที่ต้องการ
 * @returns Sorted และ limited rank array
 */
export const useTopRankSorting = (
  rankData: RankItem[] = [],
  limit: number = 10
): RankItem[] => {
  return useMemo(() => {
    if (!rankData || rankData.length === 0) return [];

    const sorted = [...rankData].sort((a, b) => {
      const amountA = a.member_amount?.[0]?.amount ?? 0;
      const amountB = b.member_amount?.[0]?.amount ?? 0;
      return amountB - amountA;
    });

    return sorted.slice(0, limit);
  }, [rankData, limit]);
};

