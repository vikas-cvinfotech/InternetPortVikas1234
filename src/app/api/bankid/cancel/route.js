import { NextResponse } from 'next/server';
import bankIdSessionTracker from '@/lib/bankidSessionTracker';
import jwt from 'jsonwebtoken';
import { generalRateLimiter, authRateLimiter, applyRouteRateLimit } from '@/lib/rateLimit';

// JWT secret is validated by environment validation
const JWT_SECRET = process.env.SECRET_COOKIE_PASSWORD;

export async function POST(request) {
  // Layer 1: General rate limiting only (cancel is a cleanup operation, doesn't need strict auth limiting)
  const generalLimit = await applyRouteRateLimit(request, generalRateLimiter);
  if (generalLimit) return generalLimit;

  try {
    // Get the session token to extract personal number
    const sessionToken = request.cookies.get('bankid-session')?.value;
    
    if (sessionToken) {
      try {
        const sessionData = jwt.verify(sessionToken, JWT_SECRET);
        if (sessionData.personalNumber) {
          // Clean up the ongoing initiation for this personal number
          bankIdSessionTracker.clearOngoingInitiation(sessionData.personalNumber);
        }
      } catch (jwtError) {
        // Token invalid or expired, that's okay
      }
    }

    // Clear the session cookie
    const response = NextResponse.json({ success: true, message: 'Session cancelled.' });
    response.cookies.delete('bankid-session');
    return response;
  } catch (error) {
    console.error('Error cancelling BankID session:', error);
    const response = NextResponse.json({ success: true, message: 'Session cancelled.' });
    response.cookies.delete('bankid-session');
    return response;
  }
}
