
import { NextResponse } from 'next/server';
import { getGoogleUser } from '../../../../../auth/social/googleAuth';
import { googleLoginRegister } from '../../../../../auth/core/auth';
import { cookies } from 'next/headers';
import config from '../../../../../config';

export async function GET(request) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  console.log("CALLBACK ")
  try {
    const cookieStore = cookies();
    const googleUser = await getGoogleUser(code);
    console.log("CALLBACK Google response:", googleUser)
    const { access_token, refresh_token, user} = await googleLoginRegister(googleUser.email, googleUser.name);
    console.log("User logged In", user)

        // Create response with user data and set cookies
        // const res = NextResponse.json(
        //     { user, message: 'Login successful' },
        //     { status: 200 }
        // );

        // // Set cookies
        // res.cookies.set('token', access_token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     path: '/'
        // });

        // res.cookies.set('refreshToken', refresh_token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     path: '/'
        // });

    // Store tokens in cookies (non-httpOnly for client access)
    cookieStore.set('accessToken', access_token, {
        httpOnly: false, // Allow access from JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
    });


    // Set cookies
    cookieStore.set('refreshToken', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
    });

    // Store user data in a non-httpOnly cookie so we can access it client-side
    cookieStore.set('userData', JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
    });

    cookieStore.delete('codeVerifier');

    // Redirect to main application
    return NextResponse.redirect(new URL(config.redirectUrl, request.url));
   
        
  } catch (error) {
    console.error('Microsoft authentication error:', error);
    
    // Redirect to login with error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'microsoft_auth_failed');
    return NextResponse.redirect(new URL(config.redirectUrl, request.url));
}
}