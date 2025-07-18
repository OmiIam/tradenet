import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Forward request to backend
    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5001'}/api/admin/payees`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      console.error('Backend admin payees error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payees' }, 
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Admin payees API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { payeeId, ...updateData } = body;

    // Forward request to backend
    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5001'}/api/admin/payees/${payeeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      console.error('Backend update payee error:', error);
      return NextResponse.json(
        { error: 'Failed to update payee' }, 
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Admin update payee API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}