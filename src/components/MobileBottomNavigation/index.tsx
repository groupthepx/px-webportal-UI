'use client';

import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { alpha, BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';

import { SidebarContext } from '@/contexts/SidebarContext';
import useCurrentMemberType from '@/hooks/useCurrentMemberType';

const miniAppRoutes = [
  '/mini-app',
  '/px_market',
  '/voice-room',
  '/home/vj_star_live',
  '/member/angpao',
  '/gift_box',
  '/profile/points_history',
  '/member/training'
];

const notificationRoutes = ['/member/notifications'];

const matchesRoute = (href: string, pathname: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const matchesAnyRoute = (routes: string[], pathname: string) =>
  routes.some((route) => matchesRoute(route, pathname));

const MiniAppIcon = () => (
  <Box
    sx={{
      display: 'grid',
      placeItems: 'center',
      width: 48,
      height: 48,
      mt: -1.5,
      borderRadius: '50%',
      color: '#fff',
      background: (theme) => theme.colors.gradients.primary,
      border: '3px solid #fff',
      boxShadow: (theme) => `0 5px 16px ${alpha(theme.colors.primary.main, 0.35)}`,
      transition: 'transform 160ms ease, box-shadow 160ms ease'
    }}
  >
    <AppsRoundedIcon sx={{ fontSize: 25 }} />
  </Box>
);

const navigationItems = [
  {
    label: 'หน้าหลัก',
    href: '/home',
    icon: <HomeRoundedIcon />
  },
  {
    label: 'สังกัด',
    href: '/member/profile',
    authOnly: true,
    vjOnly: true,
    icon: <BusinessRoundedIcon />
  },
  {
    label: 'มินิแอป',
    href: '/mini-app',
    authOnly: true,
    icon: <MiniAppIcon />
  },
  {
    label: 'กล่องข้อความ',
    href: '/member/notifications',
    authOnly: true,
    icon: <ChatBubbleOutlineRoundedIcon />
  }
];

export default function MobileBottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const { memberType } = useCurrentMemberType(status === 'authenticated');
  const { toggleSidebar, closeSidebar } = useContext(SidebarContext);
  const visibleNavigationItems = navigationItems.filter((item) => !item.vjOnly || memberType !== 'general_member');
  const moreIndex = visibleNavigationItems.length;

  const activeIndex = visibleNavigationItems.findIndex((item) => {
    if (item.href === '/mini-app') return matchesAnyRoute(miniAppRoutes, pathname);
    if (item.href === '/member/notifications') return matchesAnyRoute(notificationRoutes, pathname);
    return matchesRoute(item.href, pathname);
  });
  const value = activeIndex >= 0 ? activeIndex : moreIndex;

  const handleChange = (_event: React.SyntheticEvent, nextValue: number) => {
    if (nextValue === moreIndex) {
      toggleSidebar();
      return;
    }

    const item = visibleNavigationItems[nextValue];
    closeSidebar();

    if (item.authOnly && status !== 'authenticated') {
      router.push('/login');
      return;
    }

    router.push(item.href);
  };

  return (
    <Paper
      component="nav"
      aria-label="เมนูหลักบนมือถือ"
      elevation={12}
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.modal + 1,
        pb: 'env(safe-area-inset-bottom)',
        borderTop: '1px solid rgba(15, 23, 42, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)'
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          height: 72,
          overflow: 'visible',
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            maxWidth: 'none',
            flex: '1 1 20%',
            px: 0.25,
            color: 'rgba(36, 46, 111, 0.58)',
            transition: 'color 160ms ease, transform 160ms ease'
          },
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            color: 'primary.main',
            transform: 'translateY(-2px)'
          },
          '& .MuiBottomNavigationAction-root:nth-of-type(3)': {
            zIndex: 1
          },
          '& .MuiBottomNavigationAction-root:nth-of-type(3).Mui-selected': {
            transform: 'translateY(-4px)',
            '& > .MuiBottomNavigationAction-label': {
              color: 'primary.main',
              fontWeight: 800
            }
          },
          '& .MuiBottomNavigationAction-label': {
            mt: 0.25,
            fontSize: '0.65rem',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          },
          '& .MuiSvgIcon-root': {
            fontSize: 23
          }
        }}
      >
        {visibleNavigationItems.map((item) => (
          <BottomNavigationAction key={item.href} label={item.label} icon={item.icon} />
        ))}
        <BottomNavigationAction label="เพิ่มเติม" icon={<MoreHorizRoundedIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
