// src/app/api/research/documents/proxy/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log("[PDF Proxy] Starting proxy request");
    
    try {
        const { url } = await request.json();
        console.log("[PDF Proxy] Fetching URL:", url);

        // Add headers to the fetch request for Pinata gateway
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/pdf',
                // Add Pinata gateway API key if needed
                // 'x-pinata-gateway-token': process.env.PINATA_GATEWAY_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        console.log("[PDF Proxy] Content type:", contentType);

        const blob = await response.blob();
        console.log("[PDF Proxy] Successfully fetched PDF, size:", blob.size);

        // Return the PDF with correct headers
        return new NextResponse(blob, {
            headers: {
                'Content-Type': contentType || 'application/pdf',
                'Content-Length': blob.size.toString(),
                'Content-Disposition': 'inline',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            }
        });

    } catch (error) {
        console.error('[PDF Proxy] Error:', error);
        console.error('[PDF Proxy] Error stack:', error.stack);
        return NextResponse.json({ 
            status: 'error',
            error: error.message || 'Failed to fetch PDF',
            details: error.stack
        }, { status: 500 });
    }
}