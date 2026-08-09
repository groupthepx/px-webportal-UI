/**
 * MemberDetail Page Component (Refactored Version)
 * 
 * Performance Optimizations:
 * - ใช้ custom hooks แทน logic ที่ซับซ้อน
 * - ใช้ React.memo และ useMemo เพื่อป้องกัน re-render
 * - แยก logic ออกเป็น hooks
 * - ใช้ constants แทน hard-coded values
 */

'use client';

import { HistoryOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  Chip,
  Container,
  Fade,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FC, Suspense, memo, use, useCallback, useMemo, useState } from 'react';

// Components
import BannerAds from '@/components/BannerAds';
import CustomButton from '@/components/CustomButton';
import PageHeader from '@/components/PageHeader';
import LivePointsSummary from '@/components/LivePointsSummary';

// Lazy-loaded Components
import * as LazyCards from './Card/index.lazy';
import * as LazyDialogs from './Dialogs/index.lazy';

// Skeleton Components
import {
  CardLoadingFallback,
  FullPageSkeleton,
  SmallCardLoadingFallback,
} from './components/Skeletons';

// Hooks & Utils
import { useGetBannerListAllQuery } from '@/lib/features/ads';
import { useGetProfileByIdQuery } from '@/lib/features/profile';
import { useGetPxMarketProductHistoryListAllQuery } from '@/lib/features/px_market_product';
import { buildUploadUrl } from '@/content/Home/homeData';
import { decrypt, encrypt } from '@/utils/encryption';
import { FADE_TIMEOUT, GRID_SIZES, GRID_SPACING } from './constants';
import { useMemberData } from './hooks';
import { MemberDetailPageProps } from './types';

// Styled Components
/**
 * Application Header Component — แสดงข้อมูล App ของรายการที่กำลังเปิดอยู่
 */
const ApplicationHeader = memo<{ memberDataDetail: any }>(({ memberDataDetail }) => {
  const theme = useTheme();
  const organization = memberDataDetail?.organization;
  const appName = organization?.company_name || 'App ของคุณ';
  const joinedAt = memberDataDetail?.joined_at ? new Date(memberDataDetail.joined_at) : null;
  const joinedDate = joinedAt && !Number.isNaN(joinedAt.getTime())
    ? format(joinedAt, 'dd/MM/yyyy')
    : 'N/A';
  const isActive = memberDataDetail?.is_active !== false;

  return (
    <Grid size={12}>
      <Card
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          background: (t) => `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.04)} 0%, ${alpha(t.palette.primary.main, 0.01)} 100%)`,
          border: (t) => `1px solid ${alpha(t.palette.divider, 0.08)}`,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 3 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Avatar
            variant="rounded"
            alt={appName}
            src={buildUploadUrl(organization?.company_logo) || undefined}
            sx={{
              width: { xs: 64, sm: 72, md: 84 },
              height: { xs: 64, sm: 72, md: 84 },
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontSize: { xs: 24, md: 32 },
              fontWeight: 800,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.15)}`,
              flexShrink: 0,
            }}
          >
            {appName.slice(0, 1)}
          </Avatar>

          <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={1}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  color="primary"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {appName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  เข้าร่วมวันที่: {joinedDate}
                </Typography>
                <Chip
                  label={isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                  size="small"
                  color={isActive ? 'success' : 'default'}
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary">
                  User ID: <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{memberDataDetail?.user_id || 'N/A'}</Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ไอดีห้อง: <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{memberDataDetail?.room_id || 'N/A'}</Box>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </Grid>
  );
});

ApplicationHeader.displayName = 'ApplicationHeader';

/**
 * Sticky Banner Component (แสดง Banner ที่ติดด้านบนเมื่อ scroll)
 */
const StickyBanner = memo<{
  banners: any[];
  isSticky: boolean;
  onClose: () => void;
  isClosed: boolean;
}>(({ banners, isSticky, onClose, isClosed }) => {
  // ไม่แสดงถ้า: ไม่ sticky หรือถูกปิด หรือไม่มี banners
  if (!isSticky || isClosed || !banners || banners.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease-out',
      }}
    >
      <BannerAds
        banners={banners}
        isSticky={true}
        onClose={onClose}
        isClosed={false}
      />
    </Box>
  );
});

StickyBanner.displayName = 'StickyBanner';

/**
 * Main Content Area (Memoized with Suspense)
 * Performance: ใช้ Suspense + Lazy Loading เพื่อลด initial bundle size
 */
const MainContentArea = memo<{
  isBannerSticky: boolean;
  isBannerClosed: boolean;
  memberDetail: any;
  overviewDetailById: any;
  ParamsId: string;
  bannerList: any;
  onHistoryClick: () => void;
  onLiveHistoryClick: () => void;
  showInlineBanner: boolean;
}>(({ isBannerSticky, isBannerClosed, memberDetail, overviewDetailById, ParamsId, bannerList, onHistoryClick, onLiveHistoryClick, showInlineBanner }) => (
  <Grid size={{ xs: 12, md: GRID_SIZES.main.md }} order={{ xs: 1, md: 1 }}>
    <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={GRID_SPACING}>
      {/* Banner - แสดงในตำแหน่งปกติ (จะซ่อนเมื่อเป็น sticky หรือถูกปิด) */}
      {((showInlineBanner && !isBannerSticky) || isBannerClosed) && (
        <Grid size={GRID_SIZES.fullWidth} sx={{ order: { xs: -999, md: 0 } }}>
          <BannerAds
            banners={bannerList?.data || []}
            isSticky={false}
            onClose={() => { }}
            isClosed={false}
          />
        </Grid>
      )}

      {/* History Button & Close Balance Last */}
      <Grid size={GRID_SIZES.fullWidth}>
        <CustomButton
          text="ดูประวัติ ยอด+โบนัส"
          startIcon={<HistoryOutlined />}
          variant="history"
          size="medium"
          onClick={onHistoryClick}
        />
        <Box sx={{ my: 1.5 }}>
          <LivePointsSummary onViewHistory={onLiveHistoryClick} />
        </Box>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.CloseBalanceLastMember
            member={memberDetail}
            overviewDetailById={overviewDetailById}
            ParamsId={ParamsId}
          />
        </Suspense>
      </Grid>

      {/* Close Balance */}
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.CloseBalanceMember
            member={memberDetail}
            overviewDetailById={overviewDetailById}
            ParamsId={ParamsId}
          />
        </Suspense>
      </Grid>

      {/* Mission Coin & VJ Mission */}
      <Grid size={GRID_SIZES.fullWidth}>
        <Grid container spacing={{ xs: 1.5, md: 2 }} sx={{ height: '100%' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: { xs: 1.5, sm: 2, md: 3 }, height: '100%' }}>
              <Suspense fallback={<SmallCardLoadingFallback />}>
                <LazyCards.MissionCoinWallet overviewDetailById={overviewDetailById} />
              </Suspense>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: { xs: 1.5, sm: 2, md: 3 }, height: '100%' }}>
              <Suspense fallback={<CardLoadingFallback />}>
                <LazyCards.VJMissionMember
                  overviewDetailById={overviewDetailById}
                  memberById={memberDetail}
                  ParamsId={ParamsId}
                />
              </Suspense>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* App Revenue */}
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.AppRevenueMember
            overviewDetailById={overviewDetailById}
            memberById={memberDetail}
            ParamsId={ParamsId}
          />
        </Suspense>
      </Grid>

      {/* Conquest Mission */}
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.ConquestMissionMember
            overviewDetailById={overviewDetailById}
            memberById={memberDetail}
            ParamsId={ParamsId}
          />
        </Suspense>
      </Grid>

    </Grid>
  </Grid>
));

MainContentArea.displayName = 'MainContentArea';

/**
 * Sidebar Area (Memoized with Suspense)
 * Performance: ใช้ Suspense + Lazy Loading สำหรับ sidebar cards
 */
const SidebarArea = memo<{
  memberDetail: any;
  overviewDetailById: any;
  ParamsId: string;
}>(({ memberDetail, overviewDetailById, ParamsId }) => (
  <Grid size={{ xs: 12, md: GRID_SIZES.sidebar.md }} order={{ xs: 2, md: 2 }}>
    <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={GRID_SPACING}>
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.WalletDetails overviewDetailById={overviewDetailById} ParamsId={ParamsId} />
        </Suspense>
      </Grid>
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.AddOnsDetails overviewDetailById={overviewDetailById} ParamsId={ParamsId} />
        </Suspense>
      </Grid>
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.BonusDetails overviewDetailById={overviewDetailById} memberById={memberDetail} />
        </Suspense>
      </Grid>
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.PositionDetails
            overviewDetailById={overviewDetailById}
            memberById={memberDetail}
            ParamsId={ParamsId}
          />
        </Suspense>
      </Grid>
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.VJRankDetails
            member={memberDetail}
            overviewDetailById={overviewDetailById}
            ParamsId={ParamsId}
          />
        </Suspense>
      </Grid>
      <Grid size={GRID_SIZES.fullWidth}>
        <Suspense fallback={<CardLoadingFallback />}>
          <LazyCards.VJRankLastMonthDetails
            member={memberDetail}
            overviewDetailById={overviewDetailById}
            ParamsId={ParamsId}
          />
        </Suspense>
      </Grid>
      <Grid size={{ xs: 6, md: 12 }}>
        <Suspense fallback={<SmallCardLoadingFallback />}>
          <LazyCards.BonusStudyDetails overviewDetailById={overviewDetailById} />
        </Suspense>
      </Grid>
      <Grid size={{ xs: 6, md: 12 }}>
        <Suspense fallback={<SmallCardLoadingFallback />}>
          <LazyCards.BonusFriendsDetails organizationParamsId={ParamsId} memberById={memberDetail} overviewDetailById={overviewDetailById} />
        </Suspense>
      </Grid>
    </Grid>
  </Grid>
));

SidebarArea.displayName = 'SidebarArea';

/**
 * MemberDetail Page Component
 */
const MemberDetailPage: FC<MemberDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const { id } = useParams();

  // Dialog state สำหรับฟอร์มแก้ไขข้อมูลสมาชิกจากหน้าที่เลือก App
  const [openActionEdit, setOpenActionEdit] = useState(false);

  // Banner states
  const [isBannerSticky, setIsBannerSticky] = useState(false);
  const [isBannerClosed, setIsBannerClosed] = useState(false);

  // Ref สำหรับ trigger point (IntersectionObserver)
  const triggerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    // ตรวจสอบว่าเป็น mobile หรือไม่
    const isMobile = window.innerWidth < 768; // md breakpoint
    const threshold = isMobile ? 250 : 200; // mobile: 250px, desktop: 200px

    const observer = new IntersectionObserver(
      ([entry]) => {
        // เมื่อ trigger element ออกจากหน้าจอ (scroll ลง) = sticky
        const shouldBeSticky = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setIsBannerSticky(shouldBeSticky);
      },
      {
        threshold: [0, 1],
        rootMargin: `-${threshold}px 0px 0px 0px`
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Decrypt params
  const resolvedParams: any = id ? use(params) : null;
  const ParamsId = resolvedParams?.id
    ? `${decrypt(decodeURIComponent(resolvedParams.id as string))}`
    : '0';

  // ดึงข้อมูล profile ก่อน (ต้องเรียกก่อน useMemberData)
  const { data: profileById, isLoading: isLoadingProfile } = useGetProfileByIdQuery();

  // ใช้ custom hook สำหรับดึงข้อมูล member
  const {
    memberById,
    memberDetail,
    memberDataDetail,
    overviewDetailById,
    isLoading,
    refetchMember,
    refetchOverview,
  } = useMemberData({
    memberParamsId:
      profileById?.data?.member_id ? `${profileById.data.member_id}` : '0',
    organizationId: ParamsId,
  });

  // ดึงข้อมูล PX Market Product History
  const { data: pxMarketProductHistory, isLoading: isLoadingPxMarketProductHistory } =
    useGetPxMarketProductHistoryListAllQuery(
      { status: '' },
      {
        skip:
          !profileById?.data?.member_id ||
          profileById.data.member_id === '0',
      }
    );
  const productHistoryData = pxMarketProductHistory?.data;

  // คำนวณจำนวน product history
  // Performance: Memoize expensive filter operation
  const productHistoryCount = useMemo(() => {
    if (productHistoryData) {
      return productHistoryData.filter(
        (item: any) =>
          item.buy_by_id === `${profileById?.data?.member_id}` &&
          (ParamsId === '0' ? false : item.organization_id === ParamsId)
      ).length;
    }
    return 0;
  }, [productHistoryData, profileById?.data?.member_id, ParamsId]);

  // ดึงข้อมูล banner
  const { data: bannerList } = useGetBannerListAllQuery(
    { id: ParamsId },
    { skip: ParamsId === '0' }
  );

  // ไม่ใช้ scroll handler แล้ว เปลี่ยนเป็น IntersectionObserver แทน
  // (ดูที่ triggerRef ด้านบน)

  // Callbacks
  const handleActionEditClose = useCallback(() => {
    setOpenActionEdit(false);
    refetchMember();
  }, [refetchMember]);

  const handleHistoryClick = useCallback(() => {
    if (ParamsId) {
      const encryptedId = encrypt(ParamsId.toString());
      router.push(`/profile/history/${encryptedId}`);
    }
  }, [ParamsId, router]);

  const handleLiveHistoryClick = useCallback(() => {
    router.push(`/home/live_history`);
  }, [router]);

  const handleBannerClose = useCallback(() => {
    setIsBannerClosed(true);
  }, []);

  // Loading state รวม
  const isLoadingAll = isLoadingProfile || isLoading || isLoadingPxMarketProductHistory;

  // Render selection page
  if (ParamsId === '0') {
    return (
      <>
        <Suspense fallback={<FullPageSkeleton />}>
          <LazyDialogs.SelectOrganizationPage
            memberById={memberById}
            setOpenActionEdit={setOpenActionEdit}
            coutPxMarketProductHistoryData={productHistoryCount}
          />
        </Suspense>
        {openActionEdit && (
          // <Suspense fallback={null}>
          <LazyDialogs.MemberManagementForm
            openAction={openActionEdit}
            handleActionClose={handleActionEditClose}
            member={memberDetail}
            updateMemberComission={refetchMember}
          />
          // </Suspense>
        )}

      </>
    );
  }

  // Render loading skeleton
  if (isLoadingAll) {
    return <FullPageSkeleton />;
  }

  // Render main content
  return (
    <>
      {/* Sticky Banner - แสดงที่ด้านบนเมื่อ scroll ลง */}
      <StickyBanner
        banners={bannerList?.data || []}
        isSticky={isBannerSticky}
        onClose={handleBannerClose}
        isClosed={isBannerClosed}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          bgcolor: (t) => t.palette.grey[50],
          overflowX: 'hidden',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1.5, sm: 2, md: 3, lg: 4 } }}>
          {/* Page Header */}
          <Box sx={{ mt: 1, mb: { xs: 1, md: 2 } }}>
            <Fade in timeout={FADE_TIMEOUT}>
              <div>
                <PageHeader textHeader="รายละเอียด App" />
              </div>
            </Fade>
          </Box>

          {/* Trigger Element สำหรับ IntersectionObserver */}
          <Box
            ref={triggerRef}
            sx={{
              height: 1,
              width: '100%',
              pointerEvents: 'none',
              visibility: 'hidden',
            }}
          />

          {/* Main Content */}
          <Box sx={{ mb: 5 }}>
            <Fade in timeout={FADE_TIMEOUT}>
              <div>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  spacing={GRID_SPACING}
                >
                  {/* Application Header */}
                  <ApplicationHeader memberDataDetail={memberDataDetail} />

                  {/* Main Content Area */}
                  <MainContentArea
                    isBannerSticky={isBannerSticky}
                    isBannerClosed={isBannerClosed}
                    memberDetail={memberDetail}
                    overviewDetailById={overviewDetailById}
                    ParamsId={ParamsId}
                    bannerList={bannerList}
                    onHistoryClick={handleHistoryClick}
                    onLiveHistoryClick={handleLiveHistoryClick}
                    showInlineBanner={true}
                  />

                  {/* Sidebar Area */}
                  <SidebarArea
                    memberDetail={memberDetail}
                    overviewDetailById={overviewDetailById}
                    ParamsId={ParamsId}
                  />
                </Grid>
              </div>
            </Fade>
          </Box>
        </Container>
      </Box>

      {/* Edit Member Form - Lazy Loaded */}
      {openActionEdit && (
        // <Suspense fallback={null}>
        <LazyDialogs.MemberManagementForm
          openAction={openActionEdit}
          handleActionClose={handleActionEditClose}
          member={memberDetail}
          updateMemberComission={refetchMember}
        />
        // </Suspense>
      )}
    </>
  );
};

export default MemberDetailPage;
