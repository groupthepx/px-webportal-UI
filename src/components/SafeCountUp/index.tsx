'use client'

import { FC, useEffect, useRef, useState, CSSProperties } from 'react';

/**
 * Professional AnimatedCounter Component
 * 
 * A custom-built, dependency-free counter animation component with:
 * - Smooth easing animations
 * - Configurable formatting (separator, decimals, prefix, suffix)
 * - requestAnimationFrame for optimal performance
 * - SSR-safe implementation
 * - TypeScript support
 * 
 * @example
 * <AnimatedCounter end={1000} duration={2} separator="," prefix="$" />
 */

export interface AnimatedCounterProps {
  /** Starting value (default: 0) */
  start?: number;
  /** Ending value (required) */
  end: number | string;
  /** Animation duration in seconds (default: 2) */
  duration?: number;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Decimal character (default: '.') */
  decimal?: string;
  /** Thousands separator (default: ',') */
  separator?: string;
  /** Text before the number */
  prefix?: string;
  /** Text after the number */
  suffix?: string;
  /** Use easing animation (default: true) */
  useEasing?: boolean;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Callback when animation completes */
  onEnd?: () => void;
  /** Callback when animation starts */
  onStart?: () => void;
  /** Custom CSS styles */
  style?: CSSProperties;
  /** Custom CSS class */
  className?: string;
}

const AnimatedCounter: FC<AnimatedCounterProps> = ({
  start = 0,
  end,
  duration = 2,
  decimals = 0,
  decimal = '.',
  separator = ',',
  prefix = '',
  suffix = '',
  useEasing = true,
  delay = 0,
  onEnd,
  onStart,
  style,
  className
}) => {
  // Parse end value with safety checks
  const parseEndValue = (): number => {
    if (end === null || end === undefined) return 0;
    const parsed = typeof end === 'string' ? parseFloat(end) : end;
    return isNaN(parsed) ? 0 : parsed;
  };

  const endValue = parseEndValue();
  const startValue = (start === null || start === undefined || isNaN(start)) ? 0 : start;

  const [count, setCount] = useState<number>(startValue);
  const [isClient, setIsClient] = useState(false);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Easing function (easeOutExpo)
  const easeOutExpo = (t: number, b: number, c: number, d: number): number => {
    return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  };

  // Format number with separators, decimals, prefix, suffix
  const formatNumber = (value: number): string => {
    // Handle null, undefined, and NaN
    if (value === null || value === undefined || isNaN(value)) {
      return `${prefix}0${suffix}`;
    }

    const fixedValue = value.toFixed(decimals);
    const parts = fixedValue.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    // Add thousands separator
    let formattedInteger = integerPart;
    if (separator) {
      formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    // Combine parts
    let result = formattedInteger;
    if (decimals > 0 && decimalPart) {
      result += decimal + decimalPart;
    }

    return `${prefix}${result}${suffix}`;
  };

  // Animation loop
  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      if (onStart) onStart();
    }

    const progress = timestamp - startTimeRef.current;
    const durationMs = duration * 1000;

    if (progress < durationMs) {
      const currentTime = progress;
      const change = endValue - startValue;
      
      let newCount: number;
      if (useEasing) {
        newCount = easeOutExpo(currentTime, startValue, change, durationMs);
      } else {
        newCount = startValue + (change * (currentTime / durationMs));
      }

      setCount(newCount);
      frameRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      setCount(endValue);
      if (onEnd) onEnd();
    }
  };

  // Start animation on mount
  useEffect(() => {
    setIsClient(true);

    const startAnimation = () => {
      // Reset for new animation
      startTimeRef.current = undefined;
      setCount(startValue);

      // Start animation
      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          frameRef.current = requestAnimationFrame(animate);
        }, delay * 1000);
        return () => clearTimeout(timeoutId);
      } else {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    const cleanup = startAnimation();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (cleanup) cleanup();
    };
  }, [endValue, duration, delay, useEasing]);

  // Show final value during SSR
  if (!isClient) {
    return (
      <span className={className} style={style}>
        {formatNumber(endValue)}
      </span>
    );
  }

  return (
    <span className={className} style={style}>
      {formatNumber(count)}
    </span>
  );
};

// Export as default for import compatibility
export default AnimatedCounter;

// Also export as named export for flexibility
export { AnimatedCounter };
export { AnimatedCounter as SafeCountUp };

