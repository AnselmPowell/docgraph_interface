// /// src/app/api/auth/register/route.js

// import { NextResponse } from 'next/server';
// import config from '../../../../config';

// const REGISTER_URL = `${config.backendApiUrl}auth/register/`;

// export async function POST(request) {
//     console.log("SIGN UP --- 3")
//     try {
//         const data = await request.json();
        
//         console.log("Moove forward-- data:", data)
//         const { csrfToken } = await csrfResponse.json();

//         // Make registration request
//         const response = await fetch(REGISTER_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'X-CSRFToken': csrfToken,
//             },
//             body: JSON.stringify(data),
//             credentials: 'include'
//         });

//         const responseData = await response.json();
//         console.log("Sign Up response:", resposne )

//         if (!response.ok) {
//             return NextResponse.json(
//                 { error: responseData.error || 'Registration failed' },
//                 { status: response.status }
//             );
//         }

//         return NextResponse.json(responseData);

//     } catch (error) {
//         console.error('Registration error:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }