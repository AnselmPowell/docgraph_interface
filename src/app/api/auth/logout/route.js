// // src/app/api/auth/logout/route.js
// import { NextResponse } from 'next/server';
// import config from '../../../../config'

// const LOGOUT_URL = `${config.backendApiUrl}auth/logout/`;

// export async function POST(request) {
//     try {
//         const response = await fetch(LOGOUT_URL, {
//             method: 'POST',
//             credentials: 'include'
//         });

//         // Create response
//         const res = NextResponse.json(
//             { message: 'Logout successful' },
//             { status: 200 }
//         );

//         Clear cookies
//         res.cookies.delete('token');
//         res.cookies.delete('refreshToken');

//         return res;

//     } catch (error) {
//         console.error('Logout error:', error);
//         return NextResponse.json(
//             { error: 'Logout failed' },
//             { status: 500 }
//         );
//     }
// }