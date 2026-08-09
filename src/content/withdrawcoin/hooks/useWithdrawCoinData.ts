import { useMemo } from 'react';
import { 
  useGetMemberByIdQuery, 
  useGetMemberOverviewDetailByIdQuery, 
  useGetProfileByIdQuery 
} from '@/lib/features/profile';
import { useGetOrganizationListAllQuery } from '@/lib/features/organization';
import { useGetTransferCoinBalanceListAllQuery } from '@/lib/features/coinpackage';
import { OrganizationDetailModel } from '@/model/organization';

/**
 * Custom hook สำหรับจัดการข้อมูลการถอน Coin
 * รวม data fetching และ business logic ไว้ในที่เดียว
 */
export const useWithdrawCoinData = (organizationId: string) => {
  // ดึงข้อมูล Profile
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileByIdQuery();

  // คำนวณ member ID จาก profile
  const memberId = useMemo(() => {
    return !isLoadingProfile && profileData?.data?.member_id 
      ? String(profileData.data.member_id) 
      : '0';
  }, [isLoadingProfile, profileData]);

  // ดึงข้อมูล Member details (skip ถ้ายังไม่มี memberId)
  const { data: memberData } = useGetMemberByIdQuery(
    { id: memberId },
    { skip: memberId === '0' }
  );

  // ดึงข้อมูล Organizations ทั้งหมด
  const { data: organizationData } = useGetOrganizationListAllQuery();

  // ดึงข้อมูล Overview details (skip ถ้ายังไม่มี organizationId)
  const { 
    data: overviewData, 
    isLoading: isLoadingOverview 
  } = useGetMemberOverviewDetailByIdQuery(
    { id: memberId, organizationId },
    { skip: organizationId === '0' || memberId === '0' }
  );

  // ดึงข้อมูล Transfer history (skip ถ้ายังไม่มี organizationId)

   const memberType = memberData?.data?.member_type === "general_member" || '';


   
  const { 
    data: transferData, 
    error: transferError 
  } = useGetTransferCoinBalanceListAllQuery(
    { id: memberType ? memberId : organizationId },
    { skip: organizationId === '0' || memberId === '0' }
  );
// memberId

 
  // Filter organizations ที่ active อย่างเดียว และ cache ผลลัพธ์
  const activeOrganizations = useMemo(() => {
    return organizationData?.data?.filter(
      (org: OrganizationDetailModel) => org.is_active === true
    ) || [];
  }, [organizationData]);

  // ดึง coin data จาก member wallet
  const coinData = useMemo(() => {
    return memberData?.data?.member_wallet || [];
  }, [memberData]);

  // Filter organizations ที่มี coin data เท่านั้น
  const availableOrganizations = useMemo(() => {
    const coinOrgIds = coinData.map((c: any) => c.organization_id);
    return activeOrganizations.filter((org: OrganizationDetailModel) =>
      coinOrgIds.includes(org.organization_id)
    );
  }, [activeOrganizations, coinData]);

  // Member detail object
  const memberDetail = useMemo(() => {
    return memberData?.data || null;
  }, [memberData]);

  return {
    // Data
    memberDetail,
    overviewData,
    transferData,
    availableOrganizations,
    activeOrganizations,
    memberId,
    memberData,

    // Loading states
    isLoadingProfile,
    isLoadingOverview,

    // Errors
    transferError,
  };
};

