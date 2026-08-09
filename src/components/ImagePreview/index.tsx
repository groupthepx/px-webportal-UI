import React, { FC, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Box,
  styled,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  FitScreen as FitScreenIcon,
  CenterFocusStrong as CenterFocusIcon,
} from '@mui/icons-material';



/**
 * Professional Styled Components using Theme
 */

/**
 * Main preview container with theme-aware background
 */
const PreviewContainer = styled(Box, {
  shouldForwardProp: (prop) => !['isFullscreen', 'scale'].includes(prop as string),
})<{ isFullscreen: boolean; scale: number }>(
  ({ theme, isFullscreen, scale }) => `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${alpha(theme.palette.common.black, 0.95)};
    backdrop-filter: blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${theme.zIndex.modal + 1};
    opacity: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `
);

/**
 * Image container with zoom, rotation, and pan functionality
 */
const ImageContainer = styled(Box, {
  shouldForwardProp: (prop) => !['scale', 'isFullscreen', 'rotation', 'positionX', 'positionY'].includes(prop as string),
})<{ scale: number; isFullscreen: boolean; rotation: number; positionX: number; positionY: number }>(
  ({ theme, scale, isFullscreen, rotation, positionX, positionY }) => `
    position: relative;
    max-width: ${isFullscreen ? '95vw' : '90vw'};
    max-height: ${isFullscreen ? '95vh' : '90vh'};
    transform: translate(${positionX}px, ${positionY}px) scale(${scale}) rotate(${rotation}deg);
    transition: ${positionX === 0 && positionY === 0 ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'};
    cursor: grab;
    user-select: none;

    &:active {
      cursor: grabbing;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: ${theme.general.borderRadius};
      box-shadow: ${theme.shadows[24]};
    }
  `
);

/**
 * Close button with theme-aware styling
 */
const CloseButton = styled(Box)(
  ({ theme }) => `
    position: absolute;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${alpha(theme.palette.common.white, 0.95)};
    backdrop-filter: blur(10px);
    border: 1px solid ${alpha(theme.palette.common.white, 0.2)};
    color: ${theme.palette.common.black};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    user-select: none;

    &:hover {
      background: ${theme.palette.common.white};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows[10]};
    }

    &:active {
      transform: translateY(0);
    }

    svg {
      font-size: 24px;
    }
  `
);

/**
 * Navigation button for prev/next image
 */
const NavButton = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${alpha(theme.palette.common.black, 0.7)};
    backdrop-filter: blur(10px);
    border: 1px solid ${alpha(theme.palette.common.white, 0.2)};
    color: ${theme.palette.common.white};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    user-select: none;

    &:hover {
      background: ${alpha(theme.palette.common.black, 0.9)};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows[8]};
    }

    &:active {
      transform: translateY(0);
    }

    svg {
      font-size: 24px;
    }
  `
);

/**
 * Toolbar button for zoom, rotate, and other controls
 */
const ToolbarButton = styled(Box)(
  ({ theme }) => `
    width: 40px;
    height: 40px;
    border-radius: ${theme.general.borderRadius};
    background: ${alpha(theme.palette.common.black, 0.7)};
    backdrop-filter: blur(10px);
    border: 1px solid ${alpha(theme.palette.common.white, 0.1)};
    color: ${theme.palette.common.white};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;

    &:hover {
      background: ${alpha(theme.palette.common.black, 0.9)};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    svg {
      font-size: 20px;
    }
  `
);

/**
 * Info panel showing image details and controls
 */
const InfoPanel = styled(Box)(
  ({ theme }) => `
    position: absolute;
    top: 20px;
    left: 20px;
    background: ${alpha(theme.palette.common.black, 0.8)};
    backdrop-filter: blur(10px);
    color: ${theme.palette.common.white};
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 5;
    max-width: 300px;
    border: 1px solid ${alpha(theme.palette.common.white, 0.1)};

    .filename {
      font-weight: 600;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dimensions {
      opacity: 0.8;
      font-size: 12px;
    }

    .controls-info {
      margin-top: 8px;
      font-size: 11px;
      opacity: 0.7;
      line-height: 1.4;
    }
  `
);

/**
 * Bottom toolbar containing action buttons
 */
const Toolbar = styled(Box)(
  ({ theme }) => `
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${alpha(theme.palette.common.black, 0.8)};
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 8px;
    display: flex;
    gap: 4px;
    z-index: 5;
    border: 1px solid ${alpha(theme.palette.common.white, 0.1)};
  `
);

/**
 * Zoom level indicator
 */
const ZoomIndicator = styled(Box)(
  ({ theme }) => `
    position: absolute;
    top: 20px;
    right: 80px;
    background: ${alpha(theme.palette.common.black, 0.8)};
    backdrop-filter: blur(10px);
    color: ${theme.palette.common.white};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    z-index: 5;
    border: 1px solid ${alpha(theme.palette.common.white, 0.1)};
  `
);

/**
 * Loading overlay displayed while image is loading
 */
const LoadingOverlay = styled(Box)(
  ({ theme }) => `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${alpha(theme.palette.common.black, 0.7)};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    border-radius: ${theme.general.borderRadius};
  `
);

/**
 * Props for ImagePreview component
 */
interface ImagePreviewProps {
  /** Controls the visibility of the image preview modal */
  open: boolean;
  /** Callback function to close the preview */
  handleClose: () => void;
  /** Single image URL or array of image URLs to preview */
  imagePreviews: string | string[];
  /** Initial image index to display (for array of images) */
  currentIndex?: number;
}

/**
 * Image Preview Component
 * Professional full-screen image viewer with zoom, pan, rotate, and navigation features
 * Supports single image or gallery mode with keyboard shortcuts
 * 
 * Features:
 * - Zoom in/out (mouse wheel, +/- keys)
 * - Pan (drag with mouse)
 * - Rotate (R/Shift+R keys)
 * - Fullscreen toggle (F key, double-click)
 * - Navigation arrows (for multiple images)
 * - Download functionality
 * - Keyboard shortcuts
 */
const ImagePreview: FC<ImagePreviewProps> = ({
  open,
  handleClose,
  imagePreviews,
  currentIndex = 0
}) => {
  const theme = useTheme();
  
  // State management
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Convert single image to array for consistent handling
  const images = Array.isArray(imagePreviews) ? imagePreviews : [imagePreviews];
  const currentImage = images[currentImageIndex];

  // Body scroll lock and prevent scroll to top
  useEffect(() => {
    if (open) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore body scroll
        document.body.style.overflow = 'unset';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
    return undefined;
  }, [open]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setScale(1);
      setRotation(0);
      setIsFullscreen(false);
      setCurrentImageIndex(currentIndex);
      setImageLoaded(false);
      setPosition({ x: 0, y: 0 });
    }
  }, [open, currentIndex]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.25));
  }, []);

  const handleResetView = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleFitToScreen = useCallback(() => {
    setScale(1);
  }, []);

  // Rotation controls
  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => prev - 90);
  }, []);

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => prev + 90);
  }, []);

  // Navigation
  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    handleResetView();
  }, [images.length, handleResetView]);

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    handleResetView();
  }, [images.length, handleResetView]);

  // Download functionality
  const handleDownload = useCallback(() => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }, [currentImage]);

  // Fullscreen toggle
  const handleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (open) {
      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'Escape':
            handleClose();
            break;
          case '+':
          case '=':
            handleZoomIn();
            break;
          case '-':
          case '_':
            handleZoomOut();
            break;
          case '0':
            handleResetView();
            break;
          case 'ArrowLeft':
            handlePrevious();
            break;
          case 'ArrowRight':
            handleNext();
            break;
          case 'f':
            handleFullscreen();
            break;
          case 'r':
            handleRotateRight();
            break;
          case 'R':
            handleRotateLeft();
            break;
        }
      };

      globalThis.addEventListener('keydown', handleKeyDown);
      return () => globalThis.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [open, handleClose, handleZoomIn, handleZoomOut, handleResetView, handlePrevious, handleNext, handleFullscreen, handleRotateLeft, handleRotateRight]);

  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Helper function to extract filename from URL
  const getFilename = (url: string) => {
    return url.split('/').pop() || 'image';
  };

  if (!open || !currentImage) return null;

  return createPortal(
    <PreviewContainer isFullscreen={isFullscreen} scale={scale}>
      {/* Close button */}
      <CloseButton onClick={handleClose}>
        <CloseIcon />
      </CloseButton>

      {/* Image info panel */}
      <InfoPanel>
        <div className="filename">{getFilename(currentImage)}</div>
        <div className="dimensions">
          {images.length > 1 && `Image ${currentImageIndex + 1} / ${images.length}`}
        </div>
        <div className="controls-info">
          Zoom: {Math.round(scale * 100)}% | Rotation: {rotation}°
          <br />
          Use mouse wheel to zoom, drag to pan
        </div>
      </InfoPanel>

      {/* Zoom indicator */}
      <ZoomIndicator>
        {Math.round(scale * 100)}%
      </ZoomIndicator>

      {/* Main image container */}
      <ImageContainer
        scale={scale}
        isFullscreen={isFullscreen}
        rotation={rotation}
        positionX={position.x}
        positionY={position.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleFullscreen}
      >
        {!imageLoaded && (
          <LoadingOverlay>
            <Typography color="white">Loading...</Typography>
          </LoadingOverlay>
        )}
        <img
          src={currentImage}
          alt="Preview"
          draggable={false}
          onLoad={() => setImageLoaded(true)}
          onWheel={(e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setScale((prev) => Math.max(0.25, Math.min(4, prev + delta)));
          }}
        />
      </ImageContainer>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <NavButton
            sx={{
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
            }}
            onClick={handlePrevious}
          >
            <PrevIcon />
          </NavButton>
          <NavButton
            sx={{
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
            }}
            onClick={handleNext}
          >
            <NextIcon />
          </NavButton>
        </>
      )}

      {/* Toolbar */}
      <Toolbar>
        <ToolbarButton onClick={handleZoomOut}>
          <ZoomOutIcon />
        </ToolbarButton>
        <ToolbarButton onClick={handleZoomIn}>
          <ZoomInIcon />
        </ToolbarButton>
        <ToolbarButton onClick={handleResetView}>
          <CenterFocusIcon />
        </ToolbarButton>
        <ToolbarButton onClick={handleFitToScreen}>
          <FitScreenIcon />
        </ToolbarButton>
        <ToolbarButton onClick={handleRotateLeft}>
          <RotateLeftIcon />
        </ToolbarButton>
        <ToolbarButton onClick={handleRotateRight}>
          <RotateRightIcon />
        </ToolbarButton>
        <ToolbarButton onClick={handleDownload}>
          <DownloadIcon />
        </ToolbarButton>
        <ToolbarButton onClick={handleFullscreen}>
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </ToolbarButton>
      </Toolbar>
    </PreviewContainer>,
    document.body
  );
};

export default ImagePreview;
