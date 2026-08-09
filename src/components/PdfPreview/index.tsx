'use client';

import {
  Close as CloseIcon,
  Download as DownloadIcon,
  ErrorOutline as ErrorIcon,
  FirstPage as FirstPageIcon,
  CenterFocusStrong as FitToWidthIcon,
  FullscreenExit as FullscreenExitIcon,
  Fullscreen as FullscreenIcon,
  LastPage as LastPageIcon,
  ArrowForwardIos as NextIcon,
  PictureAsPdf as PdfIcon,
  ArrowBackIos as PrevIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  keyframes,
  LinearProgress,
  Slide,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import dynamic from 'next/dynamic';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface PdfPreviewProps {
  /** Whether the preview modal is open */
  open: boolean;
  /** Callback to close the preview */
  handleClose: () => void;
  /** URL or path to the PDF file */
  pdfUrl: string;
  /** Optional custom filename for display and download */
  fileName?: string;
  /** Enable/disable print functionality */
  enablePrint?: boolean;
  /** Enable/disable share functionality */
  enableShare?: boolean;
  /** Enable/disable download functionality */
  enableDownload?: boolean;
}

interface PdfDocumentState {
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  loadingProgress: number;
}

interface PdfViewState {
  currentPage: number;
  scale: number;
  isFullscreen: boolean;
}

interface ControlsState {
  showControls: boolean;
  mouseTimer: NodeJS.Timeout | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const CONTROLS_HIDE_DELAY = 3000;
const CONTROLS_FADE_DELAY = 800;
const DEFAULT_PDFJS_VERSION = '5.4.296';

const ZOOM_PRESETS = [
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1.0 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2.0 },
];

// =============================================================================
// ANIMATIONS
// =============================================================================

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// =============================================================================
// DYNAMIC IMPORTS (SSR-safe)
// =============================================================================

const Document = dynamic(
  () =>
    import('react-pdf').then((reactPdf) => {
      const version = reactPdf.pdfjs.version || DEFAULT_PDFJS_VERSION;
      if (typeof window !== 'undefined') {
        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
      }
      return reactPdf.Document;
    }),
  { ssr: false, loading: () => null }
);

const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), {
  ssr: false,
  loading: () => null,
});

// =============================================================================
// STYLED COMPONENTS
// =============================================================================

const PreviewContainer = styled(Box)(
  ({ theme }) => `
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, 
      ${alpha(theme.palette.common.black, 0.97)} 0%,
      ${alpha('#0a0a0f', 0.98)} 50%,
      ${alpha(theme.palette.common.black, 0.97)} 100%
    );
    backdrop-filter: blur(32px) saturate(180%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: ${theme.zIndex.modal + 100};
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse 80% 50% at 50% -20%,
        ${alpha(theme.palette.primary.main, 0.08)} 0%,
        transparent 50%
      );
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        ellipse 60% 40% at 50% 120%,
        ${alpha(theme.palette.secondary.main, 0.05)} 0%,
        transparent 50%
      );
      pointer-events: none;
    }
  `
);

const GlassPanel = styled(Box)(
  ({ theme }) => `
    background: linear-gradient(
      135deg,
      ${alpha(theme.palette.common.white, 0.08)} 0%,
      ${alpha(theme.palette.common.white, 0.04)} 100%
    );
    backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid ${alpha(theme.palette.common.white, 0.12)};
    box-shadow: 
      0 8px 32px ${alpha(theme.palette.common.black, 0.4)},
      0 0 0 1px ${alpha(theme.palette.common.white, 0.05)} inset,
      0 1px 0 ${alpha(theme.palette.common.white, 0.1)} inset;
    border-radius: 20px;
  `
);

const CloseButton = styled(IconButton)(
  ({ theme }) => `
    position: absolute;
    top: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      ${alpha(theme.palette.common.white, 0.95)} 0%,
      ${alpha(theme.palette.grey[100], 0.95)} 100%
    );
    backdrop-filter: blur(12px);
    border: 1px solid ${alpha(theme.palette.common.white, 0.3)};
    color: ${theme.palette.common.black};
    z-index: 100;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      top: 24px;
      right: 24px;
      width: 52px;
      height: 52px;
    }

    &:hover {
      background: ${theme.palette.common.white};
      transform: translateY(-3px) scale(1.08);
      box-shadow: 
        0 12px 40px ${alpha(theme.palette.common.black, 0.25)},
        0 0 24px ${alpha(theme.palette.error.main, 0.2)};

      svg {
        color: ${theme.palette.error.main};
      }
    }

    &:active {
      transform: translateY(-1px) scale(1.02);
    }

    svg {
      font-size: 22px;
      transition: all 0.3s ease;
    }
  `
);

const ToolbarButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: 'default' | 'primary' | 'success' }>(
  ({ theme, variant = 'default' }) => {
    const getGradient = () => {
      switch (variant) {
        case 'primary':
          return `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.25)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`;
        case 'success':
          return `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.25)} 0%, ${alpha(theme.palette.success.dark, 0.2)} 100%)`;
        default:
          return `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.12)} 0%, ${alpha(theme.palette.common.white, 0.06)} 100%)`;
      }
    };

    const getHoverGradient = () => {
      switch (variant) {
        case 'primary':
          return `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.4)} 0%, ${alpha(theme.palette.primary.dark, 0.35)} 100%)`;
        case 'success':
          return `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.4)} 0%, ${alpha(theme.palette.success.dark, 0.35)} 100%)`;
        default:
          return `linear-gradient(135deg, ${alpha(theme.palette.common.white, 0.2)} 0%, ${alpha(theme.palette.common.white, 0.12)} 100%)`;
      }
    };

    return `
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: ${getGradient()};
      backdrop-filter: blur(12px);
      border: 1px solid ${alpha(theme.palette.common.white, 0.15)};
      color: ${theme.palette.common.white};
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      flex-shrink: 0;

      @media (min-width: ${theme.breakpoints.values.sm}px) {
        width: 48px;
        height: 48px;
      }

      &:hover {
        background: ${getHoverGradient()};
        transform: translateY(-2px) scale(1.05);
        border-color: ${alpha(theme.palette.common.white, 0.3)};
        box-shadow: 0 8px 24px ${alpha(theme.palette.common.black, 0.3)};
      }

      &:active {
        transform: translateY(0) scale(0.98);
      }

      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      svg {
        font-size: 20px;
      }
    `;
  }
);

const InfoPanel = styled(GlassPanel)(
  ({ theme }) => `
    position: absolute;
    top: 16px;
    left: 16px;
    color: ${theme.palette.common.white};
    padding: 14px 20px;
    z-index: 99;
    max-width: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      top: 24px;
      left: 24px;
      max-width: 380px;
      padding: 16px 24px;
    }

    .filename-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pdf-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, 
        ${alpha(theme.palette.error.main, 0.2)} 0%, 
        ${alpha(theme.palette.error.dark, 0.15)} 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        font-size: 22px;
        color: ${theme.palette.error.light};
      }
    }

    .filename-text {
      flex: 1;
      min-width: 0;
    }

    .filename {
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      line-height: 1.4;
      letter-spacing: 0.2px;

      @media (min-width: ${theme.breakpoints.values.sm}px) {
        font-size: 15px;
      }
    }

    .meta-info {
      font-size: 12px;
      opacity: 0.7;
      margin-top: 2px;
    }

    .page-chips {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
  `
);

const Toolbar = styled(GlassPanel)(
  ({ theme }) => `
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 14px;
    display: flex;
    gap: 8px;
    z-index: 99;
    align-items: center;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      bottom: 28px;
      padding: 12px 16px;
      gap: 10px;
    }
  `
);

const PageNavigator = styled(GlassPanel)(
  ({ theme }) => `
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 99;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      bottom: 110px;
      gap: 12px;
      padding: 12px 20px;
    }
  `
);

const PdfViewerContainer = styled(Box)(
  ({ theme }) => `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 90px 16px 160px;
    overflow: auto;
    position: relative;
    scroll-behavior: smooth;
    overflow-anchor: none;
    overscroll-behavior: contain;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      padding: 100px 24px 180px;
    }

    @media (min-width: ${theme.breakpoints.values.md}px) {
      padding: 100px 40px 200px;
    }

    &::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    &::-webkit-scrollbar-track {
      background: ${alpha(theme.palette.common.black, 0.2)};
      border-radius: 6px;
      margin: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(
        180deg,
        ${alpha(theme.palette.common.white, 0.25)} 0%,
        ${alpha(theme.palette.common.white, 0.15)} 100%
      );
      border-radius: 6px;
      border: 2px solid transparent;
      background-clip: padding-box;

      &:hover {
        background: linear-gradient(
          180deg,
          ${alpha(theme.palette.common.white, 0.4)} 0%,
          ${alpha(theme.palette.common.white, 0.25)} 100%
        );
      }
    }
  `
);

const PdfWrapper = styled(Box)(
  ({ theme }) => `
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 100%;
    max-width: 1400px;
    padding: 32px;
    border-radius: 24px;
    background: ${alpha(theme.palette.common.white, 0.03)};
    overflow-anchor: none;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      gap: 32px;
    }
  `
);

const PageWrapper = styled(Box)(
  ({ theme }) => `
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 
      0 25px 80px ${alpha(theme.palette.common.black, 0.5)},
      0 12px 40px ${alpha(theme.palette.common.black, 0.3)},
      0 0 0 1px ${alpha(theme.palette.common.white, 0.08)};
    background: ${theme.palette.common.white};
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
      box-shadow: 
        0 30px 100px ${alpha(theme.palette.common.black, 0.55)},
        0 15px 50px ${alpha(theme.palette.common.black, 0.35)},
        0 0 0 1px ${alpha(theme.palette.common.white, 0.1)};
    }

    canvas {
      display: block;
      width: 100% !important;
      height: auto !important;
    }
  `
);

const LoadingContainer = styled(Box)(
  ({ theme }) => `
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      ${alpha(theme.palette.common.black, 0.95)} 0%,
      ${alpha('#0a0a0f', 0.98)} 100%
    );
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    gap: 32px;
  `
);

const LoadingCard = styled(GlassPanel)(
  ({ theme }) => `
    padding: 40px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    border-radius: 24px;
    animation: ${float} 3s ease-in-out infinite;
  `
);

const LoadingProgress = styled(LinearProgress)(
  ({ theme }) => `
    width: 200px;
    height: 6px;
    border-radius: 3px;
    background: ${alpha(theme.palette.common.white, 0.1)};

    .MuiLinearProgress-bar {
      background: linear-gradient(
        90deg,
        ${theme.palette.primary.main} 0%,
        ${theme.palette.secondary.main} 50%,
        ${theme.palette.primary.main} 100%
      );
      background-size: 200% 100%;
      animation: ${gradientShift} 2s ease infinite;
      border-radius: 3px;
    }
  `
);

const LoadingDots = styled(Box)(`
  display: flex;
  gap: 10px;
  margin-top: 8px;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
    animation: ${pulse} 1.4s ease-in-out infinite;

    &:nth-of-type(1) { animation-delay: 0s; }
    &:nth-of-type(2) { animation-delay: 0.2s; }
    &:nth-of-type(3) { animation-delay: 0.4s; }
  }
`);

const ErrorContainer = styled(Box)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 48px;
    text-align: center;
    max-width: 480px;
    margin: 0 auto;

    .error-icon-wrapper {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        ${alpha(theme.palette.error.main, 0.15)} 0%,
        ${alpha(theme.palette.error.dark, 0.1)} 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      animation: ${pulse} 2s ease-in-out infinite;

      svg {
        font-size: 48px;
        color: ${theme.palette.error.light};
      }
    }

    .error-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .error-title {
      color: ${theme.palette.common.white};
      font-weight: 700;
      font-size: 22px;
      letter-spacing: -0.5px;
    }

    .error-message {
      color: ${alpha(theme.palette.common.white, 0.7)};
      font-size: 15px;
      line-height: 1.7;
    }
  `
);

const StyledChip = styled(Chip)(
  ({ theme }) => `
    height: 26px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    border-radius: 8px;
    backdrop-filter: blur(8px);

    .MuiChip-label {
      padding: 0 10px;
    }
  `
);

const ZoomChip = styled(Chip)(
  ({ theme }) => `
    height: 36px;
    min-width: 72px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      ${alpha(theme.palette.common.white, 0.15)} 0%,
      ${alpha(theme.palette.common.white, 0.08)} 100%
    );
    color: white;
    border: 1px solid ${alpha(theme.palette.common.white, 0.18)};
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      background: linear-gradient(
        135deg,
        ${alpha(theme.palette.common.white, 0.25)} 0%,
        ${alpha(theme.palette.common.white, 0.15)} 100%
      );
      transform: scale(1.05);
    }
  `
);

const PageIndicator = styled(Typography)(
  ({ theme }) => `
    color: ${theme.palette.common.white};
    text-align: center;
    min-width: 90px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 0 8px;

    .current-page {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .separator {
      margin: 0 4px;
      opacity: 0.6;
    }

    .total-pages {
      opacity: 0.8;
    }
  `
);

const Divider = styled(Box)(
  ({ theme }) => `
    width: 1px;
    height: 28px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      ${alpha(theme.palette.common.white, 0.2)} 50%,
      transparent 100%
    );
    margin: 0 4px;
  `
);

const PageLoadingPlaceholder = styled(Box)(
  ({ theme }) => `
    min-height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      90deg,
      ${alpha(theme.palette.common.white, 0.03)} 0%,
      ${alpha(theme.palette.common.white, 0.08)} 50%,
      ${alpha(theme.palette.common.white, 0.03)} 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s ease-in-out infinite;
    border-radius: 12px;
  `
);

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

/**
 * Hook to manage body scroll lock when modal is open
 */
function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked || typeof window === 'undefined') return;

    const scrollY = window.scrollY;
    const body = document.body;

    Object.assign(body.style, {
      overflow: 'hidden',
      position: 'fixed',
      top: `-${scrollY}px`,
      width: '100%',
    });

    return () => {
      Object.assign(body.style, {
        overflow: '',
        position: '',
        top: '',
        width: '',
      });
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}

/**
 * Hook to manage controls visibility with auto-hide
 */
function useControlsVisibility(isActive: boolean): ControlsState & {
  handleMouseMove: () => void;
  handleMouseLeave: () => void;
} {
  const [showControls, setShowControls] = useState(true);
  const [mouseTimer, setMouseTimer] = useState<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (mouseTimer) {
      clearTimeout(mouseTimer);
      setMouseTimer(null);
    }
  }, [mouseTimer]);

  const startHideTimer = useCallback(
    (delay: number = CONTROLS_HIDE_DELAY) => {
      clearTimer();
      const timer = setTimeout(() => setShowControls(false), delay);
      setMouseTimer(timer);
    },
    [clearTimer]
  );

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    startHideTimer();
  }, [startHideTimer]);

  const handleMouseLeave = useCallback(() => {
    startHideTimer(CONTROLS_FADE_DELAY);
  }, [startHideTimer]);

  useEffect(() => {
    if (isActive) {
      setShowControls(true);
      startHideTimer();
    } else {
      clearTimer();
      setShowControls(true);
    }
    return clearTimer;
  }, [isActive, startHideTimer, clearTimer]);

  return { showControls, mouseTimer, handleMouseMove, handleMouseLeave };
}

/**
 * Hook to calculate responsive page width
 */
function useResponsivePageWidth(isMobile: boolean): number {
  const [pageWidth, setPageWidth] = useState(() => {
    if (typeof window === 'undefined') return 1200;
    return isMobile ? window.innerWidth - 48 : Math.min(window.innerWidth - 180, 1200);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newWidth = isMobile
        ? window.innerWidth - 48
        : Math.min(window.innerWidth - 180, 1200);
      setPageWidth(newWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  return pageWidth;
}

/**
 * Hook to handle keyboard shortcuts
 */
function useKeyboardShortcuts(
  isActive: boolean,
  handlers: {
    onClose: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onPrevPage: () => void;
    onNextPage: () => void;
    onFirstPage: () => void;
    onLastPage: () => void;
    onToggleFullscreen?: () => void;
  }
): void {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return;

      switch (event.key) {
        case 'Escape':
          handlers.onClose();
          break;
        case '+':
        case '=':
          event.preventDefault();
          handlers.onZoomIn();
          break;
        case '-':
        case '_':
          event.preventDefault();
          handlers.onZoomOut();
          break;
        case '0':
          event.preventDefault();
          handlers.onResetZoom();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault();
          handlers.onPrevPage();
          break;
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault();
          handlers.onNextPage();
          break;
        case 'Home':
          event.preventDefault();
          handlers.onFirstPage();
          break;
        case 'End':
          event.preventDefault();
          handlers.onLastPage();
          break;
        case 'f':
        case 'F':
          if (handlers.onToggleFullscreen) {
            event.preventDefault();
            handlers.onToggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handlers]);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Builds the full PDF URL, using a proxy for external URLs to bypass CORS
 */
function buildPdfUrl(url: string): string {
  if (!url.startsWith('http')) {
    return `${process.env.NEXT_PUBLIC_BASE_UPLOADS || ''}/${url}`;
  }
  return `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
}

/**
 * Extracts filename from URL or uses provided filename
 */
function extractFilename(url: string, customFilename?: string): string {
  if (customFilename) return customFilename;
  const filename = url.split('/').pop() || 'document.pdf';
  return decodeURIComponent(filename);
}

/**
 * Formats file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Loading state component with progress indication
 */
const LoadingState: FC<{ progress: number }> = memo(({ progress }) => {
  const theme = useTheme();

  return (
    <LoadingContainer>
      <LoadingCard>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.15)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.1)} 100%
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: 'white',
              '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
            }}
          />
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              letterSpacing: 0.5,
              mb: 1,
            }}
          >
            กำลังโหลดเอกสาร PDF
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: alpha(theme.palette.common.white, 0.6), fontSize: '0.85rem' }}
          >
            กรุณารอสักครู่...
          </Typography>
        </Box>

        <LoadingProgress variant="determinate" value={progress} />

        <LoadingDots>
          <Box className="dot" />
          <Box className="dot" />
          <Box className="dot" />
        </LoadingDots>
      </LoadingCard>
    </LoadingContainer>
  );
});

LoadingState.displayName = 'LoadingState';

/**
 * Error state component with retry functionality
 */
const ErrorState: FC<{
  message: string;
  onRetry: () => void;
}> = memo(({ message, onRetry }) => {
  const theme = useTheme();

  return (
    <ErrorContainer>
      <Box className="error-icon-wrapper">
        <ErrorIcon />
      </Box>

      <Box className="error-content">
        <Typography className="error-title">เกิดข้อผิดพลาด</Typography>
        <Typography className="error-message">{message}</Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={onRetry}
        sx={{
          mt: 2,
          textTransform: 'none',
          borderRadius: '12px',
          px: 4,
          py: 1.5,
          fontWeight: 600,
          fontSize: '0.95rem',
          background: `linear-gradient(135deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.primary.dark} 100%
          )`,
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
          '&:hover': {
            background: `linear-gradient(135deg, 
              ${theme.palette.primary.light} 0%, 
              ${theme.palette.primary.main} 100%
            )`,
            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
          },
        }}
      >
        ลองใหม่อีกครั้ง
      </Button>
    </ErrorContainer>
  );
});

ErrorState.displayName = 'ErrorState';

/**
 * Page loading placeholder with shimmer effect
 */
const PagePlaceholder: FC<{ pageNumber: number }> = memo(({ pageNumber }) => (
  <PageLoadingPlaceholder>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={40} sx={{ color: 'white' }} />
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
        กำลังโหลดหน้า {pageNumber}
      </Typography>
    </Box>
  </PageLoadingPlaceholder>
));

PagePlaceholder.displayName = 'PagePlaceholder';

/**
 * Page error state
 */
const PageError: FC<{ pageNumber: number }> = memo(({ pageNumber }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: alpha(theme.palette.common.white, 0.05),
        borderRadius: '12px',
        color: 'white',
        gap: 2,
        p: 4,
      }}
    >
      <ErrorIcon sx={{ fontSize: 40, opacity: 0.7 }} />
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        ไม่สามารถโหลดหน้า {pageNumber} ได้
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.6 }}>
        กรุณาลองรีเฟรชหน้าใหม่
      </Typography>
    </Box>
  );
});

PageError.displayName = 'PageError';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Professional PDF Preview Component
 *
 * Features:
 * - Premium glassmorphism UI design
 * - Smooth animations and transitions
 * - Responsive layout for all screen sizes
 * - Keyboard shortcuts for navigation
 * - Zoom controls with presets
 * - Page navigation with scroll sync
 * - Download, print, and share capabilities
 * - Error handling with retry functionality
 * - Loading states with progress indication
 * - Auto-hiding controls for immersive viewing
 */
const PdfPreview: FC<PdfPreviewProps> = ({
  open,
  handleClose,
  pdfUrl,
  fileName,
  enablePrint = false,
  enableShare = false,
  enableDownload = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);

  // PDF.js version state
  const [pdfjsVersion, setPdfjsVersion] = useState<string>(DEFAULT_PDFJS_VERSION);

  // Document state
  const [documentState, setDocumentState] = useState<PdfDocumentState>({
    isLoading: true,
    error: null,
    totalPages: 0,
    loadingProgress: 0,
  });

  // View state
  const [viewState, setViewState] = useState<PdfViewState>({
    currentPage: 1,
    scale: 1.0,
    isFullscreen: false,
  });

  // Custom hooks
  const pageWidth = useResponsivePageWidth(isMobile);
  useBodyScrollLock(open);
  const { showControls, handleMouseMove, handleMouseLeave } = useControlsVisibility(open);

  // Computed values
  const computedWidth = useMemo(
    () => Math.max(280, Math.floor(pageWidth * viewState.scale)),
    [pageWidth, viewState.scale]
  );

  const displayFilename = useMemo(() => extractFilename(pdfUrl, fileName), [pdfUrl, fileName]);

  const fullPdfUrl = useMemo(() => buildPdfUrl(pdfUrl), [pdfUrl]);

  const pdfDocumentOptions = useMemo(
    () => ({
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/standard_fonts/`,
    }),
    [pdfjsVersion]
  );

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setDocumentState((prev) => ({
      ...prev,
      isLoading: false,
      error: null,
      totalPages: numPages,
      loadingProgress: 100,
    }));

    setViewState((prev) => ({ ...prev, currentPage: 1 }));
    isNavigatingRef.current = true;

    const container = scrollContainerRef.current;
    if (container) container.scrollTop = 0;
  }, []);

  const handleDocumentLoadError = useCallback((err: Error) => {
    console.error('PDF Load Error:', err);
    setDocumentState((prev) => ({
      ...prev,
      isLoading: false,
      error: 'ไม่สามารถโหลดไฟล์ PDF ได้ กรุณาตรวจสอบ URL หรือลองใหม่อีกครั้ง',
      loadingProgress: 0,
    }));
  }, []);

  const handleDocumentLoadProgress = useCallback(({ loaded, total }: { loaded: number; total: number }) => {
    const progress = total > 0 ? Math.round((loaded / total) * 100) : 0;
    setDocumentState((prev) => ({ ...prev, loadingProgress: Math.min(progress, 95) }));
  }, []);

  const handleRetry = useCallback(() => {
    setDocumentState({
      isLoading: true,
      error: null,
      totalPages: 0,
      loadingProgress: 0,
    });
    setViewState({ currentPage: 1, scale: 1.0, isFullscreen: false });

    const container = scrollContainerRef.current;
    if (container) container.scrollTop = 0;
  }, []);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      scale: Math.min(prev.scale + ZOOM_STEP, MAX_ZOOM),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      scale: Math.max(prev.scale - ZOOM_STEP, MIN_ZOOM),
    }));
  }, []);

  const handleResetZoom = useCallback(() => {
    setViewState((prev) => ({ ...prev, scale: 1.0 }));
  }, []);

  const handleFitToWidth = useCallback(() => {
    setViewState((prev) => ({ ...prev, scale: 1.0 }));
  }, []);

  // Navigation handlers
  const scrollToPage = useCallback(
    (pageNumber: number) => {
      const { totalPages } = documentState;
      if (pageNumber < 1 || (totalPages > 0 && pageNumber > totalPages)) return;

      const container = scrollContainerRef.current;
      const pageEl = document.getElementById(`pdf-page-${pageNumber}`);
      if (!container || !pageEl) return;

      isNavigatingRef.current = true;
      setViewState((prev) => ({ ...prev, currentPage: pageNumber }));

      if (pageNumber === 1) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        requestAnimationFrame(() => {
          pageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 600);
    },
    [documentState.totalPages]
  );

  const handleFirstPage = useCallback(() => scrollToPage(1), [scrollToPage]);
  const handleLastPage = useCallback(
    () => scrollToPage(documentState.totalPages),
    [scrollToPage, documentState.totalPages]
  );
  const handlePrevPage = useCallback(
    () => scrollToPage(viewState.currentPage - 1),
    [scrollToPage, viewState.currentPage]
  );
  const handleNextPage = useCallback(
    () => scrollToPage(viewState.currentPage + 1),
    [scrollToPage, viewState.currentPage]
  );

  // Download handler
  const handleDownload = useCallback(() => {
    if (!pdfUrl) return;

    const link = document.createElement('a');
    const fullUrl = pdfUrl.startsWith('http')
      ? pdfUrl
      : `${process.env.NEXT_PUBLIC_BASE_UPLOADS || ''}/${pdfUrl}`;

    link.href = fullUrl;
    link.download = displayFilename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl, displayFilename]);

  // Print handler
  const handlePrint = useCallback(() => {
    const printWindow = window.open(fullPdfUrl, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  }, [fullPdfUrl]);

  // Share handler
  const handleShare = useCallback(async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: displayFilename,
          text: `ดูเอกสาร PDF: ${displayFilename}`,
          url: fullPdfUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', err);
      }
    }
  }, [displayFilename, fullPdfUrl]);

  // Fullscreen handler
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setViewState((prev) => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen?.();
      setViewState((prev) => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  // Load PDF.js CSS and version
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // @ts-ignore - Dynamic CSS imports
      require('react-pdf/dist/Page/AnnotationLayer.css');
      // @ts-ignore
      require('react-pdf/dist/Page/TextLayer.css');
    } catch {
      // CSS import failed, continue without
    }

    import('react-pdf')
      .then((reactPdf) => {
        setPdfjsVersion(reactPdf.pdfjs.version || DEFAULT_PDFJS_VERSION);
      })
      .catch(() => {
        setPdfjsVersion(DEFAULT_PDFJS_VERSION);
      });
  }, []);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setDocumentState({
        isLoading: true,
        error: null,
        totalPages: 0,
        loadingProgress: 0,
      });
      setViewState({ currentPage: 1, scale: 1.0, isFullscreen: false });
      return;
    }

    isNavigatingRef.current = true;
    setViewState((prev) => ({ ...prev, currentPage: 1 }));
  }, [open]);

  // Force scroll to top when opening
  useLayoutEffect(() => {
    if (!open) return;
    const container = scrollContainerRef.current;
    if (container) container.scrollTop = 0;
  }, [open]);

  // IntersectionObserver for page tracking
  useEffect(() => {
    if (!open || documentState.totalPages === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const pageVisibility = new Map<number, number>();

    const observerOptions: IntersectionObserverInit = {
      root: container,
      rootMargin: '-25% 0px -25% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isNavigatingRef.current) return;

      entries.forEach((entry) => {
        const pageEl = entry.target as HTMLElement;
        const pageNum = parseInt(pageEl.dataset.pageNumber || '0', 10);
        if (pageNum) {
          pageVisibility.set(pageNum, entry.intersectionRatio);
        }
      });

      if (container.scrollTop <= 10) {
        setViewState((prev) => (prev.currentPage !== 1 ? { ...prev, currentPage: 1 } : prev));
        return;
      }

      let maxVisiblePage = viewState.currentPage;
      let maxVisibility = 0;

      pageVisibility.forEach((visibility, page) => {
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          maxVisiblePage = page;
        }
      });

      if (maxVisibility > 0.25 && maxVisiblePage !== viewState.currentPage) {
        setViewState((prev) => ({ ...prev, currentPage: maxVisiblePage }));
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    for (let i = 1; i <= documentState.totalPages; i++) {
      const pageEl = document.getElementById(`pdf-page-${i}`);
      if (pageEl) observer.observe(pageEl);
    }

    return () => {
      observer.disconnect();
      pageVisibility.clear();
    };
  }, [open, documentState.totalPages, viewState.currentPage]);

  // Keyboard shortcuts
  useKeyboardShortcuts(open, {
    onClose: handleClose,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onResetZoom: handleResetZoom,
    onPrevPage: handlePrevPage,
    onNextPage: handleNextPage,
    onFirstPage: handleFirstPage,
    onLastPage: handleLastPage,
    onToggleFullscreen: handleToggleFullscreen,
  });

  // ==========================================================================
  // RENDER
  // ==========================================================================

  if (!open || !pdfUrl) return null;

  const { isLoading, error, totalPages, loadingProgress } = documentState;
  const { currentPage, scale, isFullscreen } = viewState;

  return createPortal(
    <PreviewContainer
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{ cursor: showControls ? 'default' : 'none' }}
      role="dialog"
      aria-modal="true"
      aria-label={`PDF Preview: ${displayFilename}`}
    >
      {/* Close Button */}
      <Fade in={showControls} timeout={300}>
        <CloseButton
          onClick={handleClose}
          aria-label="ปิด"
          size="medium"
        >
          <CloseIcon />
        </CloseButton>
      </Fade>

      {/* Info Panel */}
      <Slide direction="down" in={showControls} timeout={300}>
        <InfoPanel>
          <Box className="filename-row">
            <Box className="pdf-icon">
              <PdfIcon />
            </Box>
            <Box className="filename-text">
              <Typography className="filename">{displayFilename}</Typography>
              {totalPages > 0 && (
                <Typography className="meta-info">{totalPages} หน้า</Typography>
              )}
            </Box>
          </Box>

          {totalPages > 0 && (
            <Box className="page-chips">
              <StyledChip
                label={`หน้า ${currentPage} / ${totalPages}`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  color: 'white',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              />
              <StyledChip
                label={`${Math.round(scale * 100)}%`}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.common.white, 0.12),
                  color: 'white',
                }}
              />
            </Box>
          )}
        </InfoPanel>
      </Slide>

      {/* PDF Viewer */}
      <PdfViewerContainer ref={scrollContainerRef}>
        {isLoading && <LoadingState progress={loadingProgress} />}

        {error ? (
          <ErrorState message={error} onRetry={handleRetry} />
        ) : (
          <PdfWrapper>
            <Document
              file={fullPdfUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              onLoadProgress={handleDocumentLoadProgress}
              loading={null}
              error={null}
              options={pdfDocumentOptions}
            >
              {totalPages > 0 &&
                Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;

                  return (
                    <PageWrapper
                      key={`pdf-page-${pageNum}`}
                      id={`pdf-page-${pageNum}`}
                      data-page-number={pageNum}
                      sx={{
                        marginBottom: index < totalPages - 1 ? '32px' : 0,
                        scrollMarginTop: '24px',
                      }}
                    >
                      <Page
                        pageNumber={pageNum}
                        width={computedWidth}
                        renderTextLayer
                        renderAnnotationLayer
                        onRenderSuccess={() => {
                          if (pageNum !== 1) return;
                          const container = scrollContainerRef.current;
                          if (!container) return;

                          requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                              container.scrollTop = 0;
                              isNavigatingRef.current = false;
                            });
                          });
                        }}
                        loading={<PagePlaceholder pageNumber={pageNum} />}
                        error={<PageError pageNumber={pageNum} />}
                      />
                    </PageWrapper>
                  );
                })}
            </Document>
          </PdfWrapper>
        )}
      </PdfViewerContainer>

      {/* Page Navigator */}
      {totalPages > 1 && !error && (
        <Slide direction="up" in={showControls} timeout={300}>
          <PageNavigator>
            {!isMobile && (
              <Tooltip title="หน้าแรก (Home)" arrow>
                <span>
                  <ToolbarButton
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    size="small"
                    aria-label="หน้าแรก"
                  >
                    <FirstPageIcon />
                  </ToolbarButton>
                </span>
              </Tooltip>
            )}

            <Tooltip title="หน้าก่อนหน้า (←)" arrow>
              <span>
                <ToolbarButton
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  size="small"
                  aria-label="หน้าก่อนหน้า"
                >
                  <PrevIcon sx={{ fontSize: 18, ml: 0.5 }} />
                </ToolbarButton>
              </span>
            </Tooltip>

            <PageIndicator>
              <span className="current-page">{currentPage}</span>
              <span className="separator">/</span>
              <span className="total-pages">{totalPages}</span>
            </PageIndicator>

            <Tooltip title="หน้าถัดไป (→)" arrow>
              <span>
                <ToolbarButton
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  size="small"
                  aria-label="หน้าถัดไป"
                >
                  <NextIcon sx={{ fontSize: 18 }} />
                </ToolbarButton>
              </span>
            </Tooltip>

            {!isMobile && (
              <Tooltip title="หน้าสุดท้าย (End)" arrow>
                <span>
                  <ToolbarButton
                    onClick={handleLastPage}
                    disabled={currentPage >= totalPages}
                    size="small"
                    aria-label="หน้าสุดท้าย"
                  >
                    <LastPageIcon />
                  </ToolbarButton>
                </span>
              </Tooltip>
            )}
          </PageNavigator>
        </Slide>
      )}

      {/* Main Toolbar */}
      <Slide direction="up" in={showControls} timeout={300}>
        <Toolbar>
          {/* Zoom Controls */}
          <Tooltip title="ซูมออก (−)" arrow>
            <span>
              <ToolbarButton
                onClick={handleZoomOut}
                disabled={scale <= MIN_ZOOM}
                size="small"
                aria-label="ซูมออก"
              >
                <ZoomOutIcon />
              </ToolbarButton>
            </span>
          </Tooltip>

          <Tooltip title="คลิกเพื่อรีเซ็ตซูม (0)" arrow>
            <ZoomChip
              label={`${Math.round(scale * 100)}%`}
              onClick={handleResetZoom}
            />
          </Tooltip>

          <Tooltip title="ซูมเข้า (+)" arrow>
            <span>
              <ToolbarButton
                onClick={handleZoomIn}
                disabled={scale >= MAX_ZOOM}
                size="small"
                aria-label="ซูมเข้า"
              >
                <ZoomInIcon />
              </ToolbarButton>
            </span>
          </Tooltip>

          <Divider />

          {/* Fit to Width */}
          {!isMobile && (
            <Tooltip title="พอดีหน้าจอ" arrow>
              <ToolbarButton
                onClick={handleFitToWidth}
                size="small"
                aria-label="พอดีหน้าจอ"
              >
                <FitToWidthIcon />
              </ToolbarButton>
            </Tooltip>
          )}

          {/* Fullscreen Toggle */}
          {!isMobile && document.fullscreenEnabled && (
            <Tooltip title={isFullscreen ? 'ออกจากเต็มจอ (F)' : 'เต็มหน้าจอ (F)'} arrow>
              <ToolbarButton
                onClick={handleToggleFullscreen}
                size="small"
                aria-label={isFullscreen ? 'ออกจากเต็มจอ' : 'เต็มหน้าจอ'}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </ToolbarButton>
            </Tooltip>
          )}

          {(!isMobile || enableDownload) && <Divider />}

          {/* Print */}
          {enablePrint && !isMobile && (
            <Tooltip title="พิมพ์" arrow>
              <ToolbarButton
                onClick={handlePrint}
                size="small"
                aria-label="พิมพ์"
              >
                <PrintIcon />
              </ToolbarButton>
            </Tooltip>
          )}

          {/* Share */}
          {enableShare && typeof navigator.share === 'function' && (
            <Tooltip title="แชร์" arrow>
              <ToolbarButton
                onClick={handleShare}
                size="small"
                aria-label="แชร์"
              >
                <ShareIcon />
              </ToolbarButton>
            </Tooltip>
          )}

          {/* Download */}
          {enableDownload && (
            <Tooltip title="ดาวน์โหลด" arrow>
              <ToolbarButton
                onClick={handleDownload}
                size="small"
                variant="success"
                aria-label="ดาวน์โหลด"
              >
                <DownloadIcon />
              </ToolbarButton>
            </Tooltip>
          )}
        </Toolbar>
      </Slide>
    </PreviewContainer>,
    document.body
  );
};

export default memo(PdfPreview);
