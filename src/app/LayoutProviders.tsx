'use client'
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MobileBottomNavigation from '@/components/MobileBottomNavigation';
import BackToPreviousButton from '@/components/BackToPreviousButton';
import { ROUTES_NOT_USER_SIDE_HEADER } from '@/constants/route';
import { Box, Card, styled } from '@mui/material';
import { usePathname } from 'next/navigation';


const ContentWrapper = styled('main')(({ theme }) => ({
  width: '100%',
  minHeight: 'calc(100vh - 80px)',
  [theme.breakpoints.down('md')]: {
    minHeight: 'calc(100vh - 64px)',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: 'calc(100vh - 56px)',
    paddingBottom: theme.spacing(10),
  },
}));

const OverviewWrapper = styled(Card)(({ theme }) => ({
  overflow: 'auto',
  background: theme.palette.common.white,
  flex: 1,
  overflowX: 'hidden',
  paddingTop: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(8),
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(7),
  },
}));

const matchRoute = (pathToMatch: string, currentPath: string): boolean => {
  return currentPath === pathToMatch || currentPath.startsWith(`${pathToMatch}/`);
};

const BACK_BUTTON_HIDDEN_ROUTES = [
  '/home',
  '/public',
  '/login',
  '/register',
  '/register/success',
  '/apply/success',
  '/member/history',
  '/member/level-progress',
  '/profile/vj_star_video',
];

export default function LauoutProviders({
  children
}: {
  children: React.ReactNode
}) {


  const currentRoute = usePathname();
  const showBackButton = !BACK_BUTTON_HIDDEN_ROUTES.some((route) => matchRoute(route, currentRoute));

  if (ROUTES_NOT_USER_SIDE_HEADER.some((route) => matchRoute(route, currentRoute))
  || matchRoute('/profile/withdraw_money/report', currentRoute)
  ) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <OverviewWrapper>
      <Header />
      <ContentWrapper>
        {showBackButton && (
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 0.75, md: 1.25 } }}>
            <BackToPreviousButton />
          </Box>
        )}
        {children}
      </ContentWrapper>
      <Box sx={{ pb: { xs: 10, md: 0 } }}>
        <Footer />
      </Box>
      <MobileBottomNavigation />
    </OverviewWrapper>

  )

}
