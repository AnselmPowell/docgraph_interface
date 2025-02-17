// // src/app/api/auth/csrf/route.js
// import { NextResponse } from 'next/server';
// import config from '../../../../config';
// import { cookies } from 'next/headers';

// const CSRF_URL = `${config.backendApiUrl}auth/csrf/`;

// export async function GET() {
//     try {
//         const response = await fetch(CSRF_URL, {
//             cache: 'no-store',
//             credentials: 'include'
//         });

//         if (!response.ok) {
//             return NextResponse.json(
//                 { error: 'Failed to get CSRF token' },
//                 { status: response.status }
//             );
//         }

//         const data = await response.json();
//         const { csrfToken } = data;

//         // Create response with CSRF token
//         const res = NextResponse.json({ csrfToken });

//         // Set CSRF cookie if it was provided
//         const csrfCookie = response.headers.get('set-cookie');
//         if (csrfCookie) {
//             res.headers.set('set-cookie', csrfCookie);
//         }

//         return res;

//     } catch (error) {
//         console.error('CSRF error:', error);
//         return NextResponse.json(
//             { error: 'Failed to get CSRF token' },
//             { status: 500 }
//         );
//     }
// }


// src/app/api/auth/csrf/route.js
import { NextResponse } from 'next/server';
import config from '../../../../config';
import { cookies } from 'next/headers';

const CSRF_URL = `${config.backendApiUrl}auth/csrf/`;

export async function GET() {
    console.log('csrf -- :', CSRF_URL )
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        const response = await fetch(CSRF_URL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { csrfToken: null },
                { status: 200 } // Return 200 even without token
            );
        }
        
        const data = await response.json();
        return NextResponse.json({ csrfToken: data.csrfToken });

    } catch (error) {
        console.error('CSRF error:', error);
        return NextResponse.json(
            { csrfToken: null },
            { status: 200 } // Return 200 to prevent cascade failures
        );
    }
}