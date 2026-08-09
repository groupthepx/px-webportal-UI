/**
 * Skeleton Loading Components
 * ===============================
 * Skeleton components สำหรับแสดงระหว่างโหลดข้อมูล
 * เพื่อ UX ที่ดีขึ้นและลด perceived loading time
 */

'use client';

import { Box, Card, Container, Skeleton, Stack, styled } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { memo } from 'react';

// ========================================
// Styled Components
// ========================================

const SkeletonCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

// ========================================
// Profile Header Skeleton
// ========================================

export const ProfileHeaderSkeleton = memo(() => (
  <Grid size={12}>
    <Card
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 3 }}
        alignItems={{ xs: 'center', sm: 'flex-start' }}
      >
        {/* Avatar Skeleton */}
        <Skeleton
          variant="rounded"
          sx={{
            width: { xs: 72, sm: 88, md: 96 },
            height: { xs: 72, sm: 88, md: 96 },
            borderRadius: 2,
            flexShrink: 0,
          }}
        />

        {/* Profile Info Skeleton */}
        <Box sx={{ flex: 1, width: '100%' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', sm: 'flex-start' }}
            spacing={1}
          >
            <Box>
              <Skeleton variant="text" width={180} height={36} sx={{ mb: 0.5 }} />
              <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 1, borderRadius: 4 }} />
              <Skeleton variant="text" width={140} height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={140} height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={120} height={20} />
            </Box>
            <Skeleton variant="circular" width={32} height={32} />
          </Stack>
        </Box>
      </Stack>
    </Card>
  </Grid>
));

ProfileHeaderSkeleton.displayName = 'ProfileHeaderSkeleton';

// ========================================
// Generic Card Skeleton
// ========================================

interface CardSkeletonProps {
  height?: number | string;
  lines?: number;
}

export const CardSkeleton = memo<CardSkeletonProps>(({ height = 200, lines = 4 }) => (
  <SkeletonCard>
    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '40%' : '100%'}
        height={24}
        sx={{ mb: 1 }}
      />
    ))}
  </SkeletonCard>
));

CardSkeleton.displayName = 'CardSkeleton';

// ========================================
// Main Content Skeleton
// ========================================

export const MainContentSkeleton = memo(() => (
  <Grid size={{ xs: 12, md: 8.5 }} order={{ xs: 2, md: 1 }}>
    <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2}>
      {/* Banner Skeleton */}
      <Grid size={12}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={120}
          sx={{ borderRadius: 2 }}
        />
      </Grid>

      {/* History Button Skeleton */}
      <Grid size={12}>
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1, mb: 2 }} />
        <CardSkeleton height={150} lines={3} />
      </Grid>

      {/* Close Balance Skeleton */}
      <Grid size={12}>
        <CardSkeleton height={200} lines={5} />
      </Grid>

      {/* Mission Cards Skeleton */}
      <Grid size={12}>
        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <CardSkeleton height={180} lines={3} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <CardSkeleton height={180} lines={4} />
          </Grid>
        </Grid>
      </Grid>

      {/* App Revenue Skeleton */}
      <Grid size={12}>
        <CardSkeleton height={250} lines={6} />
      </Grid>

      {/* Other Cards */}
      {[1, 2, 3].map((index) => (
        <Grid size={12} key={index}>
          <CardSkeleton height={200} lines={4} />
        </Grid>
      ))}
    </Grid>
  </Grid>
));

MainContentSkeleton.displayName = 'MainContentSkeleton';

// ========================================
// Sidebar Wallet Skeleton
// ========================================

export const WalletCardSkeleton = memo(() => (
  <SkeletonCard>
    <Skeleton variant="text" width="70%" height={28} sx={{ mb: 2 }} />
    <Box display="flex" flexDirection="column" gap={1.5}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="30%" height={20} />
        </Box>
      ))}
    </Box>
    <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: 1 }} />
  </SkeletonCard>
));

WalletCardSkeleton.displayName = 'WalletCardSkeleton';

// ========================================
// Sidebar Area Skeleton
// ========================================

export const SidebarSkeleton = memo(() => (
  <Grid size={{ xs: 12, md: 3.5 }} order={{ xs: 1, md: 2 }}>
    <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={2}>
      {/* Wallet Cards */}
      {[1, 2, 3, 4].map((index) => (
        <Grid size={12} key={index}>
          <WalletCardSkeleton />
        </Grid>
      ))}

      {/* Smaller Cards */}
      <Grid size={{ xs: 6, md: 12 }}>
        <CardSkeleton height={120} lines={2} />
      </Grid>
      <Grid size={{ xs: 6, md: 12 }}>
        <CardSkeleton height={120} lines={2} />
      </Grid>
    </Grid>
  </Grid>
));

SidebarSkeleton.displayName = 'SidebarSkeleton';

// ========================================
// Full Page Skeleton (เมื่อโหลดครั้งแรก)
// ========================================

export const FullPageSkeleton = memo(() => (
  <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 2 }}>
    <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1.5, sm: 2, md: 3, lg: 4 } }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={{ xs: 1.5, sm: 2, md: 3 }}
      >
        {/* Page Header Skeleton */}
        <Grid size={12}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
        </Grid>

        {/* Profile Header Skeleton */}
        <ProfileHeaderSkeleton />

        {/* Main Content + Sidebar */}
        <MainContentSkeleton />
        <SidebarSkeleton />
      </Grid>
    </Container>
  </Box>
));

FullPageSkeleton.displayName = 'FullPageSkeleton';

// ========================================
// Loading Fallback Component (สำหรับ Suspense)
// ========================================

export const CardLoadingFallback = memo(() => (
  <CardSkeleton height={200} lines={4} />
));

CardLoadingFallback.displayName = 'CardLoadingFallback';

export const SmallCardLoadingFallback = memo(() => (
  <CardSkeleton height={120} lines={2} />
));

SmallCardLoadingFallback.displayName = 'SmallCardLoadingFallback';

