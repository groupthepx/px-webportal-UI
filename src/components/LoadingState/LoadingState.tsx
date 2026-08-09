/**
 * LoadingState Component
 * ======================================
 * Component สำหรับแสดง loading state ที่สวยงามและ responsive
 */

'use client';

import React from 'react';
import { Box, CircularProgress, LinearProgress, Skeleton, styled, Typography } from '@mui/material';

export type LoadingVariant = 'circular' | 'linear' | 'skeleton' | 'fullscreen';

interface LoadingStateProps {
  variant?: LoadingVariant;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullHeight?: boolean;
  rows?: number; // สำหรับ skeleton variant
}

const LoadingContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fullHeight'
})<{ fullHeight?: boolean }>(({ theme, fullHeight }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  minHeight: fullHeight ? '100vh' : '200px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    minHeight: fullHeight ? '100vh' : '150px',
  },
}));

const LoadingMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1rem',
  },
}));

const FullscreenLoading = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  zIndex: 9999,
  backdropFilter: 'blur(4px)',
});

const LoadingImage = styled('img')(({ theme }) => ({
  width: '80px',
  height: '80px',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: '60px',
    height: '60px',
  },
}));

/**
 * LoadingState - Component แสดง loading state
 * 
 * @example
 * ```tsx
 * <LoadingState variant="circular" message="กำลังโหลด..." />
 * <LoadingState variant="skeleton" rows={3} />
 * <LoadingState variant="fullscreen" message="กำลังประมวลผล..." />
 * ```
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'circular',
  message,
  size = 'medium',
  fullHeight = false,
  rows = 3,
}) => {
  const getCircularSize = () => {
    switch (size) {
      case 'small':
        return 30;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  // Circular Loading
  if (variant === 'circular') {
    return (
      <LoadingContainer fullHeight={fullHeight}>
        <CircularProgress size={getCircularSize()} />
        {message && <LoadingMessage>{message}</LoadingMessage>}
      </LoadingContainer>
    );
  }

  // Linear Loading
  if (variant === 'linear') {
    return (
      <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
        <LinearProgress />
        {message && (
          <Typography
            variant="body2"
            sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  // Skeleton Loading
  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            height={60}
            sx={{ mb: 2, borderRadius: 1 }}
            animation="wave"
          />
        ))}
      </Box>
    );
  }

  // Fullscreen Loading
  if (variant === 'fullscreen') {
    return (
      <FullscreenLoading>
        <LoadingImage 
          src="/assets/image/loadding.png" 
          alt="Loading"
          onError={(e) => {
            // Fallback to circular progress if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
        <CircularProgress size={50} />
        {message && (
          <LoadingMessage sx={{ mt: 3 }}>{message}</LoadingMessage>
        )}
      </FullscreenLoading>
    );
  }

  return null;
};

export default LoadingState;

