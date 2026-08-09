import { AppDispatch } from '@/lib/store';
import { clearAllData } from '@/lib/userActions';
import { signOut } from 'next-auth/react';

/**
 * Clear all cookies including NextAuth cookies
 * ฟังก์ชันสำหรับ clear cookies ทั้งหมดรวมถึง NextAuth cookies
 * รองรับ secure cookies และ __Host- prefix cookies
 * ปรับปรุงให้รองรับ production environment อย่างสมบูรณ์
 */
const clearAllCookies = (): void => {
  if (typeof document === 'undefined') return;

  const hostname = window.location.hostname;
  const isProduction = process.env.NODE_ENV === 'production';
  
  // List of NextAuth cookie names (including production prefixes)
  const nextAuthCookieNames = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
  ];

  // ฟังก์ชันสำหรับ clear cookie ครบทุกกรณี
  const clearCookie = (name: string, options: {
    path?: string;
    domain?: string;
    secure?: boolean;
  } = {}) => {
    const { path = '/', domain, secure = false } = options;
    const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
    
    let cookieString = `${name}=;expires=${expires};path=${path};`;
    if (domain) {
      cookieString += `domain=${domain};`;
    }
    if (secure) {
      cookieString += 'secure;';
    }
    
    document.cookie = cookieString;
  };

  // Clear NextAuth cookies specifically
  nextAuthCookieNames.forEach((cookieName) => {
    // Clear for current path (no domain)
    clearCookie(cookieName, { path: '/' });
    
    // Clear for root path
    clearCookie(cookieName, { path: '/' });
    
    // Clear secure cookies (production)
    if (isProduction) {
      clearCookie(cookieName, { path: '/', secure: true });
      
      // Clear for parent domain (production) - แต่ไม่ใช้กับ __Host- prefix
      if (hostname.includes('.') && !cookieName.startsWith('__Host-')) {
        const domain = hostname.split('.').slice(-2).join('.');
        // Clear with leading dot (subdomain)
        clearCookie(cookieName, { path: '/', domain: `.${domain}`, secure: true });
        // Clear without leading dot (exact domain)
        clearCookie(cookieName, { path: '/', domain: domain, secure: true });
      }
      
      // สำหรับ __Host- prefix cookies ต้อง clear โดยไม่ใช้ domain
      if (cookieName.startsWith('__Host-')) {
        clearCookie(cookieName, { path: '/', secure: true });
      }
    }
  });

  // Clear all other cookies
  const allCookies = document.cookie.split(';');
  allCookies.forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Skip if already cleared
    if (nextAuthCookieNames.includes(name)) return;
    
    // Clear cookie for current domain
    clearCookie(name, { path: '/' });
    
    // Clear cookie for parent domain (production)
    if (hostname.includes('.')) {
      const domain = hostname.split('.').slice(-2).join('.');
      clearCookie(name, { path: '/', domain: `.${domain}` });
      clearCookie(name, { path: '/', domain: domain });
    }
    
    // Clear secure cookies (production)
    if (isProduction) {
      clearCookie(name, { path: '/', secure: true });
      if (hostname.includes('.')) {
        const domain = hostname.split('.').slice(-2).join('.');
        clearCookie(name, { path: '/', domain: `.${domain}`, secure: true });
        clearCookie(name, { path: '/', domain: domain, secure: true });
      }
    }
  });
};

/**
 * Call logout API to clear cookies from server-side
 * เรียกใช้ API route เพื่อ clear httpOnly cookies จาก server-side
 */
const callLogoutAPI = async (): Promise<boolean> => {
  try {
    // เรียก NextAuth signout endpoint ก่อนเพื่อให้ NextAuth clear cookies เอง
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (signOutError) {
      console.warn('NextAuth signout endpoint error (may be expected):', signOutError);
    }

    // เรียก custom logout API เพื่อ clear cookies เพิ่มเติม
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ส่ง cookies ไปด้วย
    });

    if (!response.ok) {
      console.error('Logout API failed:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error calling logout API:', error);
    return false;
  }
};

/**
 * Professional logout handler that clears all application data
 * and signs out the user properly
 *
 * @param dispatch - Redux dispatch function
 * @param router - Next.js router (optional, for fallback)
 */
export const handleProfessionalLogout = async (
  dispatch: AppDispatch,
  router?: any
): Promise<void> => {
  try {
    // Step 1: Clear all cached data first
    dispatch(clearAllData());

    // Step 2: Add a small delay to ensure state clearing completes
    await new Promise(resolve => setTimeout(resolve, 100));

    // Step 3: Save rememberedEmail before clearing localStorage
    const rememberedEmail = localStorage.getItem('userEmail');
    const rememberedPassword = localStorage.getItem('userPassword');
    
    // Step 4: Clear localStorage
    localStorage.clear();
    
    // Step 5: Restore rememberedEmail
    if (rememberedEmail && rememberedPassword) {
      localStorage.setItem('userEmail', rememberedEmail);
      localStorage.setItem('userPassword', rememberedPassword);
    }
    
    // Step 6: Clear sessionStorage
    sessionStorage.clear();

    // Step 7: Clear cookies from client-side (for non-httpOnly cookies)
    clearAllCookies();

    // Step 8: Call logout API to clear httpOnly cookies from server-side
    await callLogoutAPI();

    // Step 9: Sign out the user with callback URL
    // ใช้ redirect: false แล้วจัดการ redirect เองเพื่อให้แน่ใจว่า cookies ถูก clear
    await signOut({ 
      callbackUrl: '/login',
      redirect: false 
    });
    
    // Step 10: Clear cookies อีกครั้งหลังจาก signOut เพื่อให้แน่ใจ
    clearAllCookies();
    
    // Step 11: Call logout API อีกครั้งเพื่อให้แน่ใจ
    await callLogoutAPI();
    
    // Step 12: Redirect manually
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (err) {
    console.error('Logout error:', err);

    // Fallback - clear everything and redirect
    try {
      clearAllCookies();
      await callLogoutAPI();
      localStorage.clear();
      sessionStorage.clear();
    } catch (clearErr) {
      console.error('Error clearing storage:', clearErr);
    }

    if (router) {
      router.push('/login');
      router.refresh();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

/**
 * Enhanced logout handler with forced redirect for problematic cases
 * ปรับปรุงให้ clear ข้อมูลครบถ้วนใน production
 * ใช้ API route เพื่อ clear httpOnly cookies จาก server-side
 *
 * @param dispatch - Redux dispatch function
 * @param router - Next.js router
 */
export const handleForceLogout = async (
  dispatch: AppDispatch,
  router: any,
  callbackUrl?: string
): Promise<void> => {
  try {
    if (callbackUrl) {
      callbackUrl = callbackUrl;
    } else {
      callbackUrl = '/login';
    }

    // Step 1: Clear all Redux state and cached data
    dispatch(clearAllData());

    // Step 2: Save remembered credentials before clearing
    const rememberedEmail = localStorage.getItem('userEmail');
    const rememberedPassword = localStorage.getItem('userPassword');

    // Step 3: Clear localStorage
    localStorage.clear();
    
    // Step 4: Restore remembered credentials if exist
    if (rememberedEmail && rememberedPassword) {
      localStorage.setItem('userEmail', rememberedEmail);
      localStorage.setItem('userPassword', rememberedPassword);
    }
    
    // Step 5: Clear sessionStorage
    sessionStorage.clear();

    // Step 6: Ensure clearing completes
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 7: Clear cookies from client-side (for non-httpOnly cookies)
    clearAllCookies();

    // Step 8: Call logout API to clear httpOnly cookies from server-side
    await callLogoutAPI();

    // Step 9: Force sign out without callback to handle it manually
    await signOut({ redirect: false });

    // Step 10: Additional delay to ensure cookies are cleared
    await new Promise(resolve => setTimeout(resolve, 200));

    // Step 11: Clear cookies อีกครั้งหลังจาก signOut เพื่อให้แน่ใจ
    clearAllCookies();

    // Step 12: Call logout API อีกครั้งเพื่อให้แน่ใจ
    await callLogoutAPI();

    // Step 13: Manual redirect to login page
    // ใช้ window.location.href แทน router.push เพื่อ force reload
    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl;
    } else {
      router.push(callbackUrl);
      router.refresh();
    }

  } catch (err) {
    console.error('Force logout error:', err);
    // Final fallback - clear everything and redirect
    try {
      clearAllCookies();
      await callLogoutAPI();
      localStorage.clear();
      sessionStorage.clear();
    } catch (clearErr) {
      console.error('Error clearing storage:', clearErr);
    }
    
    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl || '/login';
    } else {
      router.push(callbackUrl || '/login');
    }
  }
};

/**
 * Clear application data for login state reset
 * This ensures clean state when user logs in again
 *
 * @param dispatch - Redux dispatch function
 */
export const clearLoginData = (dispatch: AppDispatch): void => {
  // Clear all cached data to ensure fresh login state
  dispatch(clearAllData());

};