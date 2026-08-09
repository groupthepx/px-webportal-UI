import React, { useState, useContext, forwardRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  MenuList,
  alpha,
  IconButton,
  MenuItem,
  ListItemText,
  Popover,
  Typography,
  styled,
  useTheme,
  ListItemIcon,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Fade,
  Backdrop,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {  useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import i18n from '@/i18n/i18n';
import { SidebarContext } from "@/contexts/SidebarContext";
import { useGetProfileByIdQuery } from '@/lib/features/profile';
import { useDispatch } from 'react-redux';
import { resetState } from '@/lib/userActions';
import { apiSlice } from '@/utils/apiSlice';
import { handleForceLogout } from '@/utils/authUtils';

// Styled Components
const UserBoxButton = styled(IconButton)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  padding: 0,

  '&:hover': {
    background: 'none',
  },
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  height: '80%',
  width: '80%',
  borderRadius: theme.general.borderRadiusLg,
}));

const MenuListWrapperPrimary = styled(MenuList)(({ theme }) => ({
  padding: theme.spacing(2),
  '& .MuiMenuItem-root': {
    borderRadius: 50,
    padding: theme.spacing(1, 1, 1, 2.5),
    minWidth: 200,
    marginBottom: theme.spacing(0.25),
    position: 'relative',
    color: theme.colors.alpha.white[50],
    '&.Mui-selected, &:hover, &.MuiButtonBase-root:active': {
      background: theme.colors.primary.lighter,
      color: theme.colors.primary.main,
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
}));

const MenuUserBox = styled(Box)(({ theme }) => ({
  background: alpha(theme.colors.alpha.black[100], 0.08),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const UserBoxText = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  paddingLeft: theme.spacing(1),
  whiteSpace: 'nowrap', // Prevent text from wrapping
  // overflow: 'hidden',    // Hide overflowing text
  textOverflow: 'ellipsis', // Show ellipsis when text is truncated
  // maxWidth: '150px',     // Define a maximum width (adjust as needed)
  // [theme.breakpoints.down('sm')]: {
  //   maxWidth: '100px',   // Adjust maxWidth for smaller screens
  // },
}));

const UserBoxLabel = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.secondary.main,
  display: 'block',
}));

const UserBoxDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.light,
}));

// Enhanced styled components for better UX
const LogoutButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1.5, 2),
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const ConfirmDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: theme.spacing(2),
    minWidth: 320,
  },
}));

const LogoutTransition = forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Type Definitions
// interface HeaderUserboxProps { }

const HeaderUserbox: React.FC<any> = () => {

  const { data: ProfileById, isLoading: isLoadingProfilegById } = useGetProfileByIdQuery(
  );



  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [logoutSuccess, setLogoutSuccess] = useState<boolean>(false);


  const { toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();

  const getLanguage = i18n.language;
  // Handlers
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      // Clear all Redux state and cached data
      dispatch(resetState());
      dispatch(apiSlice.util.resetApiState());


      handleForceLogout(dispatch, router);
      setLogoutSuccess(true);

      // Show success state briefly before redirect
      setTimeout(() => {
        router.push('/login');
        setIsLoggingOut(false);
        setLogoutSuccess(false);
        setShowLogoutConfirm(false);
      }, 1500);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
      // Could show error dialog here
    }
  };

  const handleLogoutClick = () => {
    handleClose();
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
    setIsLoggingOut(false);
    setLogoutSuccess(false);
  };
  const { data: session, status }: any = useSession();
  // Fetch User Profile
  // const { data: profileData, isLoading: isLoadingProfile } = useGetProfileByIdQuery();

  const profile = ProfileById && ProfileById.data;
  const user = session?.user;

  // console.log("profile", profile)

  return (
    <>
      <UserBoxButton color="primary" onClick={handleOpen}>
        <UserBoxText
          sx={{
            mr: { xs: 1, md: 2 },
            textAlign: { xs: 'center', md: 'right' },
          }}
        >
          {/* {isLoadingProfile ? (
            <>
              <Skeleton variant="text" width="50%" height={24} />
              <Skeleton variant="text" width="30%" height={20} />
            </>
          ) : ( */}
          <>
            <UserBoxLabel
              sx={{
                color: { xs: theme.colors.white.main, md: theme.palette.primary.main },
                fontSize: { xs: '1rem', md: '1rem' },
              }}
              variant="body1"
            >
              {profile?.nick_name}
            </UserBoxLabel>
            <UserBoxDescription
              sx={{
                textAlign: { xs: 'center', md: 'right' },
                fontSize: { xs: '0.75rem', md: '0.875rem' },
              }}
              variant="body2"
            >
              {profile?.user_px}
            </UserBoxDescription>
          </>
          {/* // )} */}
        </UserBoxText>
        <UserAvatar

            src={profile && profile.profile ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + profile.profile : ''}
            // user?.profile
            //   ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${user.profile}`
            //   : undefined
          // }
          alt={user?.user_px || 'User Avatar'}
        />
      </UserBoxButton>

      <Popover
        disableScrollLock
        anchorEl={anchorEl}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuUserBox>
          <Avatar
            variant="rounded"
            src={profile && profile.profile ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + profile.profile : ''}
              // user?.profile
              //   ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${user.profile}`
              //   : undefined
            // }
            alt="Company Avatar"
          />
          <UserBoxText>
            <UserBoxLabel variant="body1">                 {profile?.nick_name} </UserBoxLabel>
            <UserBoxDescription variant="body2">         {profile?.user_px} </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>

        <Divider />

        <MenuListWrapperPrimary disablePadding>
          <MenuItem
            onClick={() => {
              // Navigate to Profile Page
              router.push('/profile');
              closeSidebar();
              handleClose();
            }}
          >
            <ListItemText
              primary={t('ข้อมูลโปรไฟล์')}
              primaryTypographyProps={{
                variant: 'h5',
                color: theme.colors.alpha.black[30],
              }}
            />
            <ListItemIcon>
              <ChevronRightTwoToneIcon
                sx={{
                  ml: 1,
                  color: theme.colors.alpha.black[30],
                  opacity: 0.8,
                }}
              />
            </ListItemIcon>
          </MenuItem>

          <MenuItem
            onClick={() => {

              router.push('/reset_password');
              closeSidebar();
              handleClose();
            }}
          >
            <ListItemText
              primary={t('เปลี่ยนรหัสผ่าน')}
              primaryTypographyProps={{
                variant: 'h5',
                color: theme.colors.alpha.black[30],
              }}
            />
            <ChevronRightTwoToneIcon
              sx={{
                color: theme.colors.alpha.black[30],
                opacity: 0.8,
              }}
            />
          </MenuItem>
        </MenuListWrapperPrimary>

        <Divider />

        <Box m={1}>
          <LogoutButton
            color="error"
            fullWidth
            onClick={handleLogoutClick}
            startIcon={<LogoutIcon sx={{ mr: 1 }} />}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                {t('กำลังออกจากระบบ...')}
              </>
            ) : (
              t('ออกจากระบบ')
            )}
          </LogoutButton>
        </Box>
      </Popover>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutConfirm}
        TransitionComponent={LogoutTransition}
        keepMounted
        onClose={handleCancelLogout}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            sx={{
              backgroundColor: logoutSuccess ? 'success.lighter' : 'warning.lighter',
              color: logoutSuccess ? 'success.main' : 'warning.main',
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
            }}
          >
            {logoutSuccess ? (
              <CheckCircleIcon sx={{ fontSize: 32 }} />
            ) : (
              <WarningIcon sx={{ fontSize: 32 }} />
            )}
          </Avatar>

          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
            {logoutSuccess
              ? t('ออกจากระบบสำเร็จ!')
              : t('ยืนยันการออกจากระบบ')
            }
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            {logoutSuccess
              ? t('ขอบคุณที่ใช้งานระบบ กำลังนำทางไปหน้าเข้าสู่ระบบ...')
              : t('คุณต้องการออกจากระบบหรือไม่? ข้อมูลที่กำลังทำงานอยู่อาจสูญหาย')
            }
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {!logoutSuccess && (
              <Button
                variant="outlined"
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                {t('ยกเลิก')}
              </Button>
            )}

            <Button
              variant="contained"
              onClick={logoutSuccess ? undefined : handleLogout}
              disabled={isLoggingOut || logoutSuccess}
              color={logoutSuccess ? "success" : "error"}
              startIcon={
                isLoggingOut ? (
                  <CircularProgress size={16} color="inherit" />
                ) : logoutSuccess ? (
                  <CheckCircleIcon />
                ) : (
                  <LogoutIcon />
                )
              }
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              {isLoggingOut
                ? t('กำลังออกจากระบบ...')
                : logoutSuccess
                  ? t('เสร็จสิ้น')
                  : t('ยืนยันออกจากระบบ')
              }
            </Button>
          </Box>
        </Box>
      </ConfirmDialog>
    </>
  );
};

export default HeaderUserbox;
