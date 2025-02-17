// src/app/api/auth/user/route.js
import { NextResponse } from 'next/server';
import config from '../../../../config';

export async function GET(request) {
    console.log("[GET] Fetching user profile");
    const authHeader = request.headers.get('authorization');
    console.log("[POST] Auth header:", authHeader);
    
    try {
        const response = await fetch(`${config.backendApiUrl}auth/profile/`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authHeader}`,
            }
        });

        if (!response.ok) {
            console.log("[GET] Profile fetch failed:", response.status);
            throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        console.log("[GET] Profile data received:", data);
        
        return NextResponse.json({
            user: data,
            status: 'success'
        });
        
    } catch (error) {
        console.error('[GET] Profile error:', error);
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }
}