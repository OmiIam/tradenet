import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

// GET /api/chat/sessions/[id]/messages - Get messages for a chat session
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get('cookie');
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/chat/sessions/${params.id}/messages`, {
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
    console.error('Chat messages proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat/sessions/[id]/messages - Send a message in a chat session
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const body = await req.json();
    
    const backendResponse = await fetch(`${BACKEND_URL}/api/chat/sessions/${params.id}/messages`, {
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
    console.error('Send message proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}