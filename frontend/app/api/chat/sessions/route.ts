import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

// GET /api/chat/sessions - Get user's chat sessions
export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/chat/sessions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader || '',
      },
    });

    const data = await backendResponse.json();

    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error('Chat sessions proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}

// POST /api/chat/sessions - Create new chat session
export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const body = await req.json();
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader || '',
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error('Create chat session proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    );
  }
}