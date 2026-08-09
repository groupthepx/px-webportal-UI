'use client';

import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';

export default function useCurrentMemberType(enabled = true) {
  const { data: profileResponse, isLoading: isProfileLoading } = useGetProfileByIdQuery(undefined, { skip: !enabled });
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: isMemberLoading } = useGetMemberByIdQuery(
    { id: memberId },
    { skip: !enabled || memberId === '0' },
  );

  return {
    memberId,
    memberType: memberResponse?.data?.member_type as string | undefined,
    isLoading: enabled && (isProfileLoading || (memberId !== '0' && isMemberLoading)),
  };
}
