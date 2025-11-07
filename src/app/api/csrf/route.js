import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';

/**
 * GET /api/csrf
 * Returns a CSRF token for the current session
 */
export async function GET() {
  try {
    // Generate new CSRF token
    const token = generateCSRFToken();
    
    // Create response with token
    const response = NextResponse.json({ 
      token,
      message: 'CSRF token generated successfully'
    });
    
    // Set token as httpOnly cookie for validation
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Failed to generate CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}