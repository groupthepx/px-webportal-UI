/**
 * Performance Hooks: useThrottle & useDebounce
 * ============================================
 * Custom hooks สำหรับ optimize event handlers และลด re-renders
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useThrottle Hook
 * ================
 * จำกัดการเรียกใช้ function ให้ทำงานสูงสุดครั้งหนึ่งใน interval ที่กำหนด
 * เหมาะสำหรับ: scroll events, resize events, mouse move events
 * 
 * @param callback - Function ที่ต้องการ throttle
 * @param delay - ระยะเวลาขั้นต่ำระหว่างการเรียกใช้ (milliseconds)
 * @returns Throttled function
 * 
 * @example
 * ```tsx
 * const handleScroll = useThrottle(() => {
 *   console.log('Scrolling...');
 * }, 200);
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      // ถ้าผ่านไปมากกว่า delay แล้ว ให้เรียกทันที
      if (timeSinceLastRun >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        // ถ้ายังไม่ถึง delay ให้รอจนครบ delay
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    },
    [callback, delay]
  ) as T;

  // Cleanup timeout เมื่อ unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * useDebounce Hook
 * ================
 * รอให้ user หยุดทำ action ก่อนจะเรียก function
 * เหมาะสำหรับ: search input, auto-save, form validation
 * 
 * @param value - ค่าที่ต้องการ debounce
 * @param delay - ระยะเวลารอ (milliseconds)
 * @returns Debounced value
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // เรียก API เมื่อ user พิมพ์เสร็จแล้ว 500ms
 *   if (debouncedSearchTerm) {
 *     fetchSearchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // ตั้ง timeout เพื่ออัพเดทค่าหลังจากผ่าน delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout ถ้า value เปลี่ยนก่อนครบ delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useThrottledCallback Hook
 * =========================
 * สร้าง throttled callback ที่ stable (ไม่เปลี่ยนทุก render)
 * เหมาะสำหรับ: pass เป็น prop ไปยัง child components
 * 
 * @param callback - Function ที่ต้องการ throttle
 * @param delay - ระยะเวลาขั้นต่ำระหว่างการเรียกใช้ (milliseconds)
 * @returns Throttled callback
 * 
 * @example
 * ```tsx
 * const handleSearch = useThrottledCallback((term: string) => {
 *   api.search(term);
 * }, 300);
 * 
 * <SearchInput onChange={handleSearch} />
 * ```
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // อัพเดท callback ref เมื่อ callback เปลี่ยน
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        callbackRef.current(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...args);
          lastRun.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    },
    [delay]
  );
}

/**
 * useDebouncedCallback Hook
 * =========================
 * สร้าง debounced callback ที่ stable
 * 
 * @param callback - Function ที่ต้องการ debounce
 * @param delay - ระยะเวลารอ (milliseconds)
 * @returns Debounced callback
 * 
 * @example
 * ```tsx
 * const handleSave = useDebouncedCallback((data) => {
 *   api.save(data);
 * }, 1000);
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

