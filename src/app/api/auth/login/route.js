// // src/app/api/auth/login/route.js
// import { NextResponse } from 'next/server';
// import config from '../../../../config'

// const LOGIN_URL = `${config.backendApiUrl}auth/login/`;

// export async function POST(request) {
//     try {
//         const data = await request.json();
        
//         // Get CSRF token
//         const csrfResponse = await fetch(`${config.backendApiUrl}auth/csrf/`, {
//             credentials: 'include'
//         });
//         const { csrfToken } = await csrfResponse.json();

//         // Make login request
//         const response = await fetch(LOGIN_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': csrfToken
//             },
//             body: JSON.stringify({
//                 email: data.email,
//                 password: data.password
//             }),
//             credentials: 'include'
//         });

//         if (!response.ok) {
//             const error = await response.json();
//             return NextResponse.json(
//                 { error: error.message || 'Login failed' },
//                 { status: response.status }
//             );
//         }

//         const responseData = await response.json();
//         const { access_token, refresh_token, user } = responseData;

//         // Create response with user data and set cookies
//         const res = NextResponse.json(
//             { user, message: 'Login successful' },
//             { status: 200 }
//         );

//         // Set cookies
//         res.cookies.set('token', access_token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             path: '/'
//         });

//         res.cookies.set('refreshToken', refresh_token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             path: '/'
//         });

//         return res;

//     } catch (error) {
//         console.error('Login error:', error);
//         return NextResponse.json(
//             { error: 'Login failed' },
//             { status: 500 }
//         );
//     }
// }


