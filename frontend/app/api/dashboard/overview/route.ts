import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(req: NextRequest) {
  try {
    // Get cookies from the request
    const cookieHeader = req.headers.get('cookie');
    
    // Proxy the request to the backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/dashboard/overview`, {
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
    console.error('Dashboard overview proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}