
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
//   console.log("CALLBACK ")
//   try {
//     const cookieStore = cookies();
//     const googleUser = await getGoogleUser(code);
//     console.log("CALLBACK Google response:", googleUser)
//     const { access_token, refresh_token, user} = await googleLoginRegister(googleUser.email, googleUser.name);
//     console.log("User logged In", user)

//         // Create response with user data and set cookies
//         // const res = NextResponse.json(
//         //     { user, message: 'Login successful' },
//         //     { status: 200 }
//         // );

//         // // Set cookies
//         // res.cookies.set('token', access_token, {
//         //     httpOnly: true,
//         //     secure: process.env.NODE_ENV === 'production',
//         //     sameSite: 'strict',
//         //     path: '/'
//         // });

//         // res.cookies.set('refreshToken', refresh_token, {
//         //     httpOnly: true,
//         //     secure: process.env.NODE_ENV === 'production',
//         //     sameSite: 'strict',
//         //     path: '/'
//         // });

//     // Store tokens in cookies (non-httpOnly for client access)
//     cookieStore.set('accessToken', access_token, {
//         httpOnly: false, // Allow access from JavaScript
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 7 * 24 * 60 * 60,
//         path: '/',
//     });


//     // Set cookies
//     cookieStore.set('refreshToken', refresh_token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 7 * 24 * 60 * 60,
//         path: '/',
//     });

//     // Store user data in a non-httpOnly cookie so we can access it client-side
//     cookieStore.set('userData', JSON.stringify(user), {
//         httpOnly: false,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 7 * 24 * 60 * 60,
//         path: '/',
//     });

//     // Redirect to main application
//     return NextResponse.redirect(new URL(config.redirectUrl, request.url));
   
        
//   } catch (error) {
//     console.error('Google authentication error:', error);
    
//     // Redirect to login with error
//     const loginUrl = new URL('/login', request.url);
//     loginUrl.searchParams.set('error', 'google_auth_failed');
//     return NextResponse.redirect(new URL(config.redirectUrl, request.url));
// }
// }


export async function GET(request) {
  const code = request.nextUrl.searchParams.get('code');
  
  // Log the code (but truncate it for security)
  console.log("CALLBACK Received code:", code ? `${code.substring(0, 10)}...` : 'null');
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  
  try {
    // Add these lines to log request details
    console.log("CALLBACK Request URL:", request.url);
    console.log("CALLBACK Redirect URI from config:", config.googleRedirectUri);
    
    const cookieStore = cookies();
    
    // Wrap this call with additional error handling
    // try {
      console.log("CALLBACK Calling getGoogleUser with code");
      const googleUser = await getGoogleUser(code);
      console.log("CALLBACK Google response successful:", googleUser);
    // } catch (googleError) {
    //   console.error('CALLBACK getGoogleUser failed:', googleError);
    //   // Re-throw to be caught by the outer handler
    //   throw googleError;
    // }
    

    const { access_token, refresh_token, user} = await googleLoginRegister(googleUser.email, googleUser.name);
    console.log("User logged In", user)

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
      
    
      return NextResponse.redirect(new URL(config.redirectUrl, request.url));
    
  } catch (error) {
    // Enhanced error logging
    console.error('Google authentication error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3)
    });

    return NextResponse.redirect(new URL(config.redirectUrl, request.url));
    
  }
}