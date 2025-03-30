// src/app/api/research/documents/references/route.js

import { NextResponse } from 'next/server';
import config from '../../../../../config';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.document_id || !data.reference_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Send to backend
    const response = await fetch(`${config.backendApiUrl}research/references/update_references/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization'),
      }, 
      body: JSON.stringify({
        document_id: data.document_id,
        reference_text: data.reference_text
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to update references' },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('[POST] Error updating references:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update references' },
      { status: 500 }
    );
  }
}