import NextAuth, { User } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { firebaseAdmin } from "@/services/firebaseAdmin";

import { JWT } from "next-auth/jwt";

// Custom types for better type safety
interface FirebaseUser extends User {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

interface CustomJWT extends JWT {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
}



/**
 * Refreshes the Firebase access token using the refresh token
 * @param token Current JWT token containing refresh token
 * @returns Updated token object or null if refresh failed
 */
async function refreshAccessToken(token: CustomJWT): Promise<CustomJWT> {
  try {
 
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_API_KEY}`;
    const payload = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    });

    const response = await fetch(url, {
      method: 'POST',
      body: payload.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

  

    const data = await response.json();

 
    if (!response.ok) {
      // Check if the error is due to an expired refresh token
      if (data.error && data.error.message === 'TOKEN_EXPIRED') {
        throw new Error('RefreshTokenExpired');
      }
      throw new Error(data.error.message || 'Failed to refresh access token');
    }


    return {
      ...token,
      error : '',
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken, // Keep the old refresh token if none is returned
      accessTokenExpires: Date.now() + data.expires_in * 1000, // Convert expires_in to milliseconds
      
    };
  } catch (error: any) {
    console.error('Error refreshing access token:', error);

    return {
      ...token,
      error: error.message,
    };
  }
}

// export const authOptions: NextAuthOptions = 

const handler = NextAuth(
  {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials): Promise<FirebaseUser | null> {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials');
          }

          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              credentials.email,
              credentials.password
            );

            const idToken = await userCredential.user.getIdToken();
            await firebaseAdmin
              .auth()
              .verifyIdToken(idToken);

            return {
              id: userCredential.user.uid,
              email: userCredential.user.email!,
              name: userCredential.user.displayName || '',
              accessToken: idToken,
              refreshToken: userCredential.user.refreshToken,
            };

          } catch (error: any) {
            console.error('Authentication error:', error);
            // Provide more specific error messages based on Firebase error codes
            if (error.code === 'auth/user-not-found') {
              throw new Error('No user found with this email');
            } else if (error.code === 'auth/wrong-password') {
              throw new Error('Incorrect password');
            }
            throw new Error('Authentication failed');
          }
        },
      })
    ],

    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,

    // Cookie configuration เพื่อแก้ปัญหา domain และ secure cookies
    cookies: {
      sessionToken: {
        name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : 'webportal.'}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          // ไม่กำหนด domain ใน development (localhost) 
          // กำหนด domain เฉพาะใน production
          ...(process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL 
            ? { domain: new URL(process.env.NEXTAUTH_URL).hostname.replace(/^www\./, '') }
            : {}),
        },
      },
      callbackUrl: {
        name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : 'webportal.'}next-auth.callback-url`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
      csrfToken: {
        name: `${process.env.NODE_ENV === 'production' ? '__Host-' : 'webportal.'}next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    },

    callbacks: {
      jwt: async ({ token, user }: any) => {
        // Initial sign in
        if (user) {
          return {
            ...token,
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            accessTokenExpires: Date.now() + 3600 * 1000, // Assuming the token expires in 1 hour
          };
        }
       // Return previous token if the access token has not expired
        if (Date.now() < token.accessTokenExpires - 5 * 60 * 1000) {
          return token;
        }
       
        // Access token has expired, try to refresh it
        const refreshedToken = await refreshAccessToken(token);


       
      
        // Handle errors during token refresh
        if (refreshedToken.error) {
          return {
            ...token,
            error: refreshedToken.error,
          };
        }

        return refreshedToken;



      },

      session: async ({ session, token }): Promise<any> => {
          // console.log("session" , session)
    
        if (token.error === 'RefreshTokenExpired') {
          // If the refresh token has expired, invalidate the session
          return null;
        }
   
        // @ts-ignore 
        session.accessToken = token.accessToken;
        // @ts-ignore
        session.error = token.error;




        return {
          ...session,
          id: token.id,
          email: token.email,
          name: token.name,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
      },
    },
  }

);
export { handler as GET, handler as POST };