import { Box, Card, Typography, useTheme, IconButton } from '@mui/material';
import { FC, useState, useEffect, memo, useCallback, useMemo } from 'react';
import { BannerDetailModel } from '@/model/banner';
import { KeyboardArrowLeft, KeyboardArrowRight, Close } from '@mui/icons-material';
import ImagePreview from '@/components/ImagePreview';
import { useThrottledCallback } from '@/utils/useThrottle';

interface Props {
  banners: BannerDetailModel[];
  isSticky?: boolean;
  onClose?: () => void;
  isClosed?: boolean;
}

// Custom Navigation Button Component (extracted for performance)
const NavButton = memo<{
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}>(({ direction, onClick, disabled }) => (
  <Box
    onClick={(e) => {
      e.stopPropagation();
      if (disabled || !onClick) return;
      onClick();
    }}
    sx={{
      position: 'absolute',
      [direction]: 8,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: disabled
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease-in-out',
      zIndex: 10,
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      pointerEvents: 'auto',
      userSelect: 'none',
      '&:hover': disabled ? {} : {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        transform: 'translateY(-50%) scale(1.1)',
      },
    }}
  >
    {direction === 'left' ? (
      <KeyboardArrowLeft
        sx={{
          color: 'white',
          fontSize: 20
        }}
      />
    ) : (
      <KeyboardArrowRight
        sx={{
          color: 'white',
          fontSize: 20
        }}
      />
    )}
  </Box>
));

NavButton.displayName = 'NavButton';

// Custom Dots Indicator Component (extracted for performance)
const DotsIndicator = memo<{
  banners: BannerDetailModel[];
  activeStep: number;
  isMounted: boolean;
  onDotClick: (index: number) => void;
}>(({ banners, activeStep, isMounted, onDotClick }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 1,
      zIndex: 2,
    }}
  >
    {banners.map((banner, index) => {
      const isActive = isMounted && index === activeStep;
      return (
        <Box
          key={banner.banner_id || index}
          onClick={() => onDotClick(index)}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: isActive
              ? 'white'
              : 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              transform: 'scale(1.2)',
            },
          }}
        />
      );
    })}
  </Box>
));

DotsIndicator.displayName = 'DotsIndicator';

const BannerAds: FC<Props> = ({ banners, isSticky = false, onClose, isClosed = false }) => {

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Handle client-side mounting - prevents hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize current banner และ maxSteps
  const currentBanner = useMemo(() => 
    banners[isMounted ? activeStep : 0],
    [banners, isMounted, activeStep]
  );
  
  const maxSteps = useMemo(() => banners.length, [banners.length]);

  // Auto-slide functionality - throttled version
  // Performance: ใช้ throttle เพื่อป้องกัน rapid state changes
  const handleAutoSlide = useThrottledCallback(() => {
    if (isMounted && globalThis.window !== undefined && banners.length > 1) {
      setActiveStep((prev) => (prev + 1) % banners.length);
    }
  }, 3000);

  useEffect(() => {
    if (isMounted && globalThis.window !== undefined && banners.length > 1) {
      const timer = setInterval(handleAutoSlide, 3000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isMounted, banners.length, handleAutoSlide]);

  // Memoized handlers
  const handleNext = useCallback(() => {
    setActiveStep((prev) => (prev + 1) % maxSteps);
  }, [maxSteps]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => (prev - 1 + maxSteps) % maxSteps);
  }, [maxSteps]);

  const handleDotClick = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  const handleImagePreviewOpen = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImagePreviewOpen(true);
  }, []);

  const handleImagePreviewClose = useCallback(() => {
    setImagePreviewOpen(false);
    setSelectedImage('');
  }, []);

  // Early return - no need to render
  if (banners.length === 0 || isClosed) {
    return null;
  }

  return (
    <>
      <Card
        sx={{
          width: '100%',
          maxWidth: isSticky ? '100%' : '993px',
          height: '120px',
          margin: '0 auto',
          overflow: 'hidden',
          borderRadius: isSticky ? 0 : 2,
          boxShadow: theme.shadows[2],
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentBanner?.file_type === 'IMAGE' ? (
            <Box
              component="img"
              src={currentBanner.file_url}
              alt="Banner Ad"
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: isMounted ? 'pointer' : 'default',
                transition: isMounted ? 'opacity 0.5s ease-in-out' : 'none',
              }}
              onClick={() => {
                if (isMounted && currentBanner?.file_url) {
                  handleImagePreviewOpen(currentBanner.file_url);
                }
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.grey[200],
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Unsupported banner type
              </Typography>
            </Box>
          )}

          {/* Navigation arrows - only show when mounted and multiple banners */}
          {isMounted && maxSteps > 1 && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 15,
              pointerEvents: 'none'
            }}>
              <NavButton
                direction="left"
                onClick={handleBack}
                disabled={false}
              />
              <NavButton
                direction="right"
                onClick={handleNext}
                disabled={false}
              />
            </Box>
          )}

          {/* Dots indicator - only show when mounted and multiple banners */}
          {isMounted && maxSteps > 1 && (
            <DotsIndicator
              banners={banners}
              activeStep={activeStep}
              isMounted={isMounted}
              onDotClick={handleDotClick}
            />
          )}

          {/* Close button - only show when sticky and onClose is provided */}
          {isSticky && onClose && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 20,
                width: 32,
                height: 32,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Card>

      {/* ImagePreview Modal */}
      <ImagePreview
        open={imagePreviewOpen}
        handleClose={handleImagePreviewClose}
        imagePreviews={selectedImage}
      />
    </>
  );
};

// Performance: React.memo with custom comparison
// เปรียบเทียบเฉพาะ props ที่สำคัญเพื่อลด re-renders
const MemoizedBannerAds = memo(BannerAds, (prevProps, nextProps) => {
  // Re-render เฉพาะเมื่อ banners, isSticky, หรือ isClosed เปลี่ยน
  return (
    prevProps.banners === nextProps.banners &&
    prevProps.isSticky === nextProps.isSticky &&
    prevProps.isClosed === nextProps.isClosed &&
    prevProps.onClose === nextProps.onClose
  );
});

MemoizedBannerAds.displayName = 'BannerAds';

export default MemoizedBannerAds;