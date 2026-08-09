import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * API Route สำหรับ logout และ clear cookies จาก server-side
 * จำเป็นสำหรับ production เพราะ httpOnly cookies ไม่สามารถ clear จาก client-side ได้
 */
export async function POST(request: NextRequest) {
  try {
    // Get the token to verify session exists
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });

    // Get hostname for domain setting
    const hostname = request.headers.get('host') || '';
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Extract domain (remove port if exists)
    const domain = hostname.split(':')[0];
    
    // Get base domain for cookie domain setting
    // ใช้ domain ที่ตรงกับ NextAuth config
    let cookieDomain: string | undefined = undefined;
    if (isProduction && process.env.NEXTAUTH_URL) {
      try {
        const nextAuthUrl = process.env.NEXTAUTH_URL;
        const url = nextAuthUrl.startsWith('http') 
          ? new URL(nextAuthUrl) 
          : new URL(`https://${nextAuthUrl}`);
        cookieDomain = url.hostname.replace(/^www\./, '');
      } catch (error) {
        console.error('Error parsing NEXTAUTH_URL:', error);
      }
    }
    
    // Fallback to extracted domain if NEXTAUTH_URL is not available
    if (!cookieDomain) {
      cookieDomain = domain.includes('.') 
        ? domain.split('.').slice(-2).join('.')
        : domain;
    }

    // List of NextAuth cookie names (including production prefixes)
    const nextAuthCookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
    ];

    // Clear all NextAuth cookies
    // ต้องใช้ attributes ที่ตรงกับตอนสร้าง cookies อย่างแม่นยำ
    nextAuthCookieNames.forEach((cookieName) => {
      // สำหรับ __Host- prefix cookies: ต้องใช้ path='/', secure=true, และไม่ใช้ domain
      if (cookieName.startsWith('__Host-')) {
        // __Host- cookies ไม่สามารถใช้ domain ได้เลย
        // ต้อง clear ด้วย attributes ที่ตรงกับตอนสร้าง
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          httpOnly: true,
          secure: true, // __Host- ต้องใช้ secure
          sameSite: 'lax',
          // ไม่ใช้ domain สำหรับ __Host- (ห้ามใช้ domain)
        });
      }
      // สำหรับ __Secure- prefix cookies
      else if (cookieName.startsWith('__Secure-')) {
        // __Secure-next-auth.session-token ใช้ domain (จาก config)
        // __Secure-next-auth.callback-url ไม่ใช้ domain (จาก config)
        const isSessionToken = cookieName === '__Secure-next-auth.session-token';
        
        // Clear cookie without domain (สำหรับ callback-url หรือ fallback)
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          httpOnly: true,
          secure: true, // __Secure- ต้องใช้ secure
          sameSite: 'lax',
        });
        
        // สำหรับ session-token ต้อง clear ด้วย domain ด้วย (ถ้ามี)
        // ต้อง clear ทั้งแบบไม่มี domain และมี domain เพื่อให้แน่ใจ
        if (isSessionToken && isProduction && cookieDomain) {
          // Clear cookie with domain (ตรงกับ config ของ NextAuth)
          // ใช้ domain โดยไม่ใส่ leading dot (ตรงกับ config)
          response.cookies.set(cookieName, '', {
            expires: new Date(0),
            path: '/',
            domain: cookieDomain,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
          });
          
          // Clear cookie with leading dot domain (เพื่อครอบคลุมทุกกรณี)
          response.cookies.set(cookieName, '', {
            expires: new Date(0),
            path: '/',
            domain: `.${cookieDomain}`,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
          });
        }
      }
      // สำหรับ cookies ปกติ (development)
      else {
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          httpOnly: true,
          secure: isProduction,
          sameSite: 'lax',
        });
      }
    });

    // Clear any other cookies that might exist
    const allCookies = request.cookies.getAll();
    allCookies.forEach((cookie) => {
      const cookieName = cookie.name;
      
      // Skip if already cleared
      if (nextAuthCookieNames.includes(cookieName)) return;

      // Clear cookie
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
      });

      // Clear with domain (production only)
      if (isProduction && cookieDomain && cookieDomain !== domain) {
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          domain: cookieDomain,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          domain: `.${cookieDomain}`,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
      }
    });

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    
    // Even if there's an error, try to clear cookies
    const response = NextResponse.json({ 
      success: false, 
      message: 'Error during logout',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });

    // Clear cookies anyway
    const hostname = request.headers.get('host') || '';
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = hostname.split(':')[0];
    
    // Get base domain for cookie domain setting
    let cookieDomain: string | undefined = undefined;
    if (isProduction && process.env.NEXTAUTH_URL) {
      try {
        const nextAuthUrl = process.env.NEXTAUTH_URL;
        const url = nextAuthUrl.startsWith('http') 
          ? new URL(nextAuthUrl) 
          : new URL(`https://${nextAuthUrl}`);
        cookieDomain = url.hostname.replace(/^www\./, '');
      } catch (error) {
        console.error('Error parsing NEXTAUTH_URL:', error);
      }
    }
    
    if (!cookieDomain) {
      cookieDomain = domain.includes('.') 
        ? domain.split('.').slice(-2).join('.')
        : domain;
    }

    const nextAuthCookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
    ];

    // Clear cookies with correct attributes
    nextAuthCookieNames.forEach((cookieName) => {
      // สำหรับ __Host- prefix
      if (cookieName.startsWith('__Host-')) {
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
      }
      // สำหรับ __Secure- prefix
      else if (cookieName.startsWith('__Secure-')) {
        const isSessionToken = cookieName === '__Secure-next-auth.session-token';
        
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
        
        if (isSessionToken && isProduction && cookieDomain && cookieDomain !== domain) {
          response.cookies.set(cookieName, '', {
            expires: new Date(0),
            path: '/',
            domain: cookieDomain,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
          });
          response.cookies.set(cookieName, '', {
            expires: new Date(0),
            path: '/',
            domain: `.${cookieDomain}`,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
          });
        }
      }
      // สำหรับ cookies ปกติ
      else {
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          httpOnly: true,
          secure: isProduction,
          sameSite: 'lax',
        });
      }
    });

    return response;
  }
}

// Support GET method as well for flexibility
export async function GET(request: NextRequest) {
  return POST(request);
}

