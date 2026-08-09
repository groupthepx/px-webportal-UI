'use client';

import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import useCurrentMemberType from '@/hooks/useCurrentMemberType';

export default function VJOnlyRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useSession();
  const { memberType, isLoading: isMemberLoading } = useCurrentMemberType(status === 'authenticated');
  const isLoading = status === 'loading' || (status === 'authenticated' && isMemberLoading);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (!isLoading && memberType === 'general_member') {
      router.replace('/home');
    }
  }, [isLoading, memberType, router, status]);

  if (isLoading || memberType === 'general_member') {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 160px)', display: 'grid', placeItems: 'center', backgroundColor: '#f7f8fa' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return children;
}
