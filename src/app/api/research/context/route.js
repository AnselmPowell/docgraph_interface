// src/app/api/research/context/route.js

import { NextResponse } from 'next/server';
import config from '../../../../config';



export async function POST(request) {
  try {
    const contextData = await request.json();
    
    // Send to backend
    const response = await fetch(`${config.backendApiUrl}research/research-context/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization'),
      }, 
      body: JSON.stringify({ content: contextData.content }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to save research context' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[POST] Error saving research context:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save research context' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get research context from backend
    const response = await fetch(`${config.backendApiUrl}research/research-context/`, {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('Authorization'),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to retrieve research context' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[GET] Error retrieving research context:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve research context' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Delete research context from backend
    const response = await fetch(`${config.backendApiUrl}research/research-context/clear/`, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('Authorization'),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete research context' },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: 'success', message: 'Research context deleted' });
    
  } catch (error) {
    console.error('[DELETE] Error deleting research context:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete research context' },
      { status: 500 }
    );
  }
}