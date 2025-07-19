import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://internet-banking-production-68f4.up.railway.app';

export async function GET(req: NextRequest) {
  try {
    // Get cookies from the request
    const cookieHeader = req.headers.get('cookie');
    
    // Proxy the request to the backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader || '',
      },
    });

    const data = await backendResponse.json();

    // Create response with the backend data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward cookies from backend to frontend
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error('Me proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}