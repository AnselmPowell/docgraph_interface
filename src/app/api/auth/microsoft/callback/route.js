export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { msalInstance } from '../../../../../auth/social/microsoftAuth';
import { microsoftLoginRegister } from '../../../../../auth/core/auth';
import { cookies } from 'next/headers';
import config from '../../../../../config';




// src/app/api/auth/microsoft/callback/route.js
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    console.log("CALLBACK");
    const code = searchParams.get('code');
    console.log("CALLBACK Code:", code);

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const cookieStore = cookies();
        const codeVerifier = cookieStore.get('codeVerifier')?.value;
        console.log("CALLBACK Code Verifier:", codeVerifier);

        if (!codeVerifier) {
            console.error('No code verifier found in cookies');
            return NextResponse.json(
                { error: 'Authentication failed', details: 'No code verifier found' }, 
                { status: 400 }
            );
        }

        const tokenRequest = {
                        code,
                        scopes: ["user.read", "openid", "profile", "email"],
                        redirectUri: config.microsoftRedirectUri,
                        codeVerifier: codeVerifier,
                    };
            
        const response = await msalInstance.acquireTokenByCode(tokenRequest);
        console.log("CALLBACK  Mirosoft Repsonse: ", response)
        const { account } = response;

        const email = account.username || account.idTokenClaims.email;
        const name = account.name 
        console.log("CALLBACK Send to backend ")

        const { access_token, refresh_token, user}  = await microsoftLoginRegister(email, name);
        console.log("User logged In", user)

        // // Create response with user data and set cookies
        // const res = NextResponse.json(
        //     { user, message: 'Login successful' },
        //     { status: 200 }
        // );

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
        // return NextResponse.redirect(loginUrl);
        return NextResponse.redirect(new URL(config.redirectUrl, request.url));
    }

}


