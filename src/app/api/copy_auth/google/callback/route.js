
import { NextResponse } from 'next/server';
import { getGoogleUser } from '../../../../../auth/social/googleAuth';
import { googleLoginRegister } from '../../../../../auth/core/auth';
import { cookies } from 'next/headers';
import config from '../../../../../config';

// export async function GET(request) {
//   const code = request.nextUrl.searchParams.get('code');
//   if (!code) {
//     return NextResponse.json({ error: 'No code provided' }, { status: 400 });
//   }
  
//   try {
//     const googleUser = await getGoogleUser(code);
//     console.log("Google user: ", googleUser)
//     console.log("send to backend user details: ",)
//     const response = await googleLoginRegister(googleUser.email, googleUser.name);
//     console.log("storage data repsosnse :", response)
//     const data = await response.json()
//     const cookieStore = cookies();
//     cookieStore.set('refreshToken', data.user.refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
        
//         maxAge: 7 * 24 * 60 * 60, // 7 days
//         path: '/',
//       });
//     //  Redirect to the home page or dashboard
//     return NextResponse.redirect(new URL( config.redirectUrl, request.url));
        

//   } catch (error) {
//     console.error('Google authentication error:', error);
//     return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
//   }
// }


// src/app/api/auth/google/callback/route.js
export async function GET(request) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  
  try {
    console.log("[Google Callback] Starting token exchange");
    const googleUser = await getGoogleUser(code);
    
    if (!googleUser || !googleUser.email) {
      throw new Error('Failed to get user info from Google');
    }

    console.log("[Google Callback] Got user info, registering with backend");
    const response = await googleLoginRegister(googleUser.email, googleUser.name);
    const data = await response.json();

    const cookieStore = cookies();
    if (data.user?.refreshToken) {
      cookieStore.set('refreshToken', data.user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
    }

    return NextResponse.redirect(new URL(config.redirectUrl, request.url));

  } catch (error) {
    console.error('[Google Callback] Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Redirect to login page with error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'google_auth_failed');
    return NextResponse.redirect(loginUrl);
  }
}