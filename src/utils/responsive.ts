/**
 * Responsive Utilities
 * ======================================
 * Utility functions สำหรับการจัดการ responsive design
 * รองรับทั้ง MUI breakpoints และ Tailwind CSS
 */

// Breakpoints Standards
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
  xxl: 1920,
} as const;

// Media Query Helpers
export const mediaQueries = {
  xs: `@media (min-width: ${BREAKPOINTS.xs}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `@media (min-width: ${BREAKPOINTS.xxl}px)`,
} as const;

// Responsive Spacing Scale
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
  xxxl: '4rem',    // 64px
} as const;

// Container Max Widths
export const containerMaxWidth = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
} as const;

// Helper: Check if current screen size matches breakpoint
export const useMediaQuery = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

// Helper: Get responsive value based on screen size
export const getResponsiveValue = <T,>(
  values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    xxl?: T;
  },
  currentWidth: number
): T | undefined => {
  const breakpointKeys = Object.keys(BREAKPOINTS).reverse() as Array<keyof typeof BREAKPOINTS>;
  
  for (const key of breakpointKeys) {
    if (currentWidth >= BREAKPOINTS[key] && values[key] !== undefined) {
      return values[key];
    }
  }
  
  return values.xs;
};

// Typography Responsive Sizes
export const typographySizes = {
  h1: {
    xs: '1.75rem',   // 28px
    sm: '2rem',      // 32px
    md: '2.25rem',   // 36px
    lg: '2.5rem',    // 40px
  },
  h2: {
    xs: '1.5rem',    // 24px
    sm: '1.75rem',   // 28px
    md: '2rem',      // 32px
    lg: '2.25rem',   // 36px
  },
  h3: {
    xs: '1.25rem',   // 20px
    sm: '1.375rem',  // 22px
    md: '1.5rem',    // 24px
    lg: '1.75rem',   // 28px
  },
  h4: {
    xs: '1.125rem',  // 18px
    sm: '1.25rem',   // 20px
    md: '1.375rem',  // 22px
    lg: '1.5rem',    // 24px
  },
  body1: {
    xs: '0.875rem',  // 14px
    sm: '1rem',      // 16px
    md: '1rem',      // 16px
  },
  body2: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '0.875rem',  // 14px
  },
} as const;

// Grid Columns สำหรับ Responsive Layouts
export const gridColumns = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 12,
  xl: 12,
} as const;

// Helper: Calculate responsive padding
export const getResponsivePadding = (multiplier: number = 1) => ({
  xs: `${0.5 * multiplier}rem`,
  sm: `${1 * multiplier}rem`,
  md: `${1.5 * multiplier}rem`,
  lg: `${2 * multiplier}rem`,
  xl: `${2.5 * multiplier}rem`,
});

// Helper: Calculate responsive margin
export const getResponsiveMargin = (multiplier: number = 1) => ({
  xs: `${0.5 * multiplier}rem`,
  sm: `${1 * multiplier}rem`,
  md: `${1.5 * multiplier}rem`,
  lg: `${2 * multiplier}rem`,
  xl: `${2.5 * multiplier}rem`,
});

// Export types
export type Breakpoint = keyof typeof BREAKPOINTS;
export type ResponsiveValue<T> = {
  [K in Breakpoint]?: T;
};

