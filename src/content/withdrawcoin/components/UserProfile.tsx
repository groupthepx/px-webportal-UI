import React, { useMemo } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { UserBoxButton } from '../styles';
import { MemberDetail } from '../types';
import { AVATAR_SIZE } from '../constants';

interface UserProfileProps {
  memberDetail: MemberDetail | null;
}

/**
 * UserProfile Component
 * แสดงข้อมูล profile ของ user
 * ใช้ React.memo เพื่อป้องกัน unnecessary re-renders
 */
const UserProfile: React.FC<UserProfileProps> = React.memo(({ memberDetail }) => {
  // สร้าง avatar URL
  const avatarUrl = useMemo(() => {
    if (!memberDetail?.profile) return '';
    return `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${memberDetail.profile}`;
  }, [memberDetail?.profile]);

  // แสดงชื่อ user
  const displayName = useMemo(() => {
    return memberDetail?.nick_name || 'N/A';
  }, [memberDetail?.nick_name]);

  // แสดง user PX
  const userPx = useMemo(() => {
    return memberDetail?.user_px || 'N/A';
  }, [memberDetail?.user_px]);

  return (
    <UserBoxButton
      sx={{
        cursor: 'default',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar
        variant="rounded"
        alt={memberDetail?.member_id}
        src={avatarUrl}
        sx={{
          width: AVATAR_SIZE.LARGE,
          height: AVATAR_SIZE.LARGE,
          marginRight: 2,
        }}
      />
      <Box>
        <Typography color="primary" variant="h4" component="h4" gutterBottom>
          {displayName}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          User PX: {userPx}
        </Typography>
      </Box>
    </UserBoxButton>
  );
});

UserProfile.displayName = 'UserProfile';

export default UserProfile;

