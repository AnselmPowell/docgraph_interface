// src/app/api/research/notes/route.js
import { NextResponse } from 'next/server';
import config from '../../../../../config';

export async function POST(request) {
  try {
    const noteData = await request.json();
    
    // Send to backend
    const response = await fetch(`${config.backendApiUrl}research/notes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization'),
      },
      body: JSON.stringify(noteData),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to save note' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[POST] Error saving note:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save note' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get notes from backend

   
    const response = await fetch(`${config.backendApiUrl}research/notes/`, {
      method: 'GET',
      headers: {
        'Authorization': request.headers.get('Authorization'),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to retrieve notes' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[GET] Error retrieving notes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve notes' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { note_id } = await request.json();
    
    if (!note_id) {
      return NextResponse.json(
        { error: 'No note ID provided' },
        { status: 400 }
      );
    }
    
    // Delete note from backend
    const response = await fetch(`${config.backendApiUrl}research/notes/${note_id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('Authorization'),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete note' },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: 'success', message: 'Note deleted' });
    
  } catch (error) {
    console.error('[DELETE] Error deleting note:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete note' },
      { status: 500 }
    );
  }
}