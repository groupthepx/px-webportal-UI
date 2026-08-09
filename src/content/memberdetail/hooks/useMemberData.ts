/**
 * Custom Hook: useMemberData
 * จัดการการดึงข้อมูล member, overview และ mission
 */

import { useMemo } from 'react';
import { 
  useGetMemberByIdQuery, 
  useGetMemberOverviewDetailByIdQuery
} from '@/lib/features/profile';
import { useGetMissionByOrganizationsByIdQuery } from '@/lib/features/organization';
import { API_CONFIG } from '../constants';

interface UseMemberDataProps {
  memberParamsId: string;
  organizationId: string;
}

/**
 * Hook สำหรับดึงข้อมูล member และข้อมูลที่เกี่ยวข้อง
 */
export const useMemberData = ({ memberParamsId, organizationId }: UseMemberDataProps) => {
  // ดึงข้อมูล member
  const { 
    data: memberById, 
    isLoading: isLoadingMember, 
    refetch: refetchMember 
  } = useGetMemberByIdQuery(
    { id: memberParamsId },
    {
      skip: API_CONFIG.skipWhenZero(memberParamsId),
      refetchOnMountOrArgChange: true,
    }
  );

  // ดึงข้อมูล overview
  const { 
    data: overviewDetailById, 
    isLoading: isLoadingOverview, 
    refetch: refetchOverview 
  } = useGetMemberOverviewDetailByIdQuery(
    { id: memberParamsId, organizationId },
    { skip: API_CONFIG.skipWhenZero(organizationId) || API_CONFIG.skipWhenZero(memberParamsId) }
  );

  // ดึงข้อมูล mission
  const { 
    data: mission, 
    isLoading: isLoadingMission 
  } = useGetMissionByOrganizationsByIdQuery(
    { id: organizationId },
    { skip: API_CONFIG.skipWhenZero(organizationId) }
  );

  // คำนวณข้อมูลที่ได้จาก queries
  const memberDetail = useMemo(() => 
    memberById?.data || null, 
    [memberById]
  );

  const memberDataDetail = useMemo(() => 
    memberDetail?.member_organization?.find(
      (data: any) => `${data.organization_id}` === organizationId
    ) || null,
    [memberDetail, organizationId]
  );

  const closeMonthData = useMemo(() => 
    overviewDetailById?.data?.LastMonth,
    [overviewDetailById]
  );

  const missionItem = useMemo(() => 
    mission?.data,
    [mission]
  );

  const missionItemDetail = useMemo(() => {
    if (!closeMonthData?.current_collect_mission?.mission_id || !missionItem) {
      return null;
    }
    return missionItem.find(
      (data: any) => `${data.mission_id}` === `${closeMonthData.current_collect_mission.mission_id}`
    ) || null;
  }, [closeMonthData, missionItem]);

  // Loading state รวม
  const isLoading = isLoadingMember || isLoadingOverview || isLoadingMission;

  return {
    // ข้อมูล
    memberById,
    memberDetail,
    memberDataDetail,
    overviewDetailById,
    closeMonthData,
    missionItem,
    missionItemDetail,
    
    // Loading states
    isLoading,
    isLoadingMember,
    isLoadingOverview,
    isLoadingMission,
    
    // Refetch functions
    refetchMember,
    refetchOverview,
  };
};
