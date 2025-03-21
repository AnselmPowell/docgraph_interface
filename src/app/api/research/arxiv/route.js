// src/app/api/research/arxiv/route.js
import { NextResponse } from 'next/server';
import config from '../../../../config';

export async function POST(request) {
  try {
    const data = await request.json();
    const isContextSearch = !!data.context_id;
    const endpoint = isContextSearch ? 'context' : 'direct';
    
    // Send to backend
    const response = await fetch(`${config.backendApiUrl}research/arxiv-search/${endpoint}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization'),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to search arXiv' },
        { status: response.status }
      );
    }

    const searchResults = await response.json();
    return NextResponse.json(searchResults);
    
  } catch (error) {
    console.error('[POST] Error searching arXiv:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search arXiv' },
      { status: 500 }
    );
  }
}