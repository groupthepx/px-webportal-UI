/**
 * ProfileAvatar Component
 * Component สำหรับแสดงและอัปโหลดรูปโปรไฟล์
 */

import { FC, memo } from 'react';
import { Avatar, Box, Card, FormHelperText, IconButton, styled } from '@mui/material';
import { DriveFolderUploadOutlined } from '@mui/icons-material';
import { AVATAR_CONFIG } from '../../constants';

// Styled Components
const AvatarWrapper = styled(Card)(
  ({ theme }) => `
    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(14)};
      height: ${theme.spacing(14)};
    }
  `
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
  `
);

const Input = styled('input')({
  display: 'none',
});

interface ProfileAvatarProps {
  selectedImage: string | null;
  currentProfile?: string;
  error?: string;
  touched?: boolean;
  onImageUpload: (file: File | null) => void;
}

/**
 * Component สำหรับแสดงและอัปโหลดรูปโปรไฟล์พร้อม crop
 */
const ProfileAvatar: FC<ProfileAvatarProps> = memo(({
  selectedImage,
  currentProfile,
  error,
  touched,
  onImageUpload,
}) => {
  // สร้าง URL สำหรับแสดงรูป
  const avatarSrc = selectedImage || 
    (currentProfile ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${currentProfile}` : '');

  return (
    <>
      {/* Error message */}
      {touched && error && (
        <Box
          pt={{ xs: 3, sm: 4, md: 6 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
        >
          <FormHelperText sx={{ color: 'red' }}>
            {error}
          </FormHelperText>
        </Box>
      )}

      {/* Avatar with upload button */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        pb={{ xs: 2, sm: 3, md: 5 }}
        px={{ xs: 2, sm: 3, md: 5 }}
        sx={{
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <AvatarWrapper
          sx={{
            mt: { xs: 1, sm: 2, md: 3 },
            mb: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Avatar
            sx={{
              mx: 'auto',
              width: {
                xs: AVATAR_CONFIG.size.xs,
                sm: AVATAR_CONFIG.size.sm,
                md: AVATAR_CONFIG.size.md,
              },
              height: {
                xs: AVATAR_CONFIG.size.xs,
                sm: AVATAR_CONFIG.size.sm,
                md: AVATAR_CONFIG.size.md,
              },
            }}
            variant="rounded"
            src={avatarSrc}
          />
          
          <ButtonUploadWrapper>
            <Input
              accept="image/*"
              id="icon-button-file"
              name="icon-button-file"
              type="file"
              onChange={(e) => onImageUpload(e.target.files?.[0] || null)}
            />
            <label htmlFor="icon-button-file">
              <IconButton component="span" color="primary">
                <DriveFolderUploadOutlined />
              </IconButton>
            </label>
          </ButtonUploadWrapper>
        </AvatarWrapper>
      </Box>
    </>
  );
});

ProfileAvatar.displayName = 'ProfileAvatar';

export default ProfileAvatar;

