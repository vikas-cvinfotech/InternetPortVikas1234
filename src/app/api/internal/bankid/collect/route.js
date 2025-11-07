import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { bankIdAPI } from '@/lib/bankid-api';
import { pollingRateLimiter, applyRateLimiter } from '@/lib/rateLimit';
import jwt from 'jsonwebtoken';

// JWT secret is validated by environment validation
const JWT_SECRET = process.env.SECRET_COOKIE_PASSWORD;

export async function POST(request) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  // Temporarily disable rate limiting for testing
  // const { success } = await applyRateLimiter(pollingRateLimiter, ip);
  // if (!success) {
  //   return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  // }

  // Get session token from cookie
  const sessionToken = request.cookies.get('bankid-session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'No active session found.' }, { status: 400 });
  }

  try {
    // Verify and decode JWT token
    const sessionData = jwt.verify(sessionToken, JWT_SECRET);
    const { orderRef, personalNumber: originalPersonalNumber } = sessionData;

    if (!orderRef) {
      return NextResponse.json({ error: 'No active transaction found.' }, { status: 400 });
    }

    const statusResponse = await bankIdAPI.collectStatus({ orderRef });
    const { Status, HintCode, CompletionData } = statusResponse.Response;

    // If the transaction is complete, perform validation.
    if (Status === 'complete') {
      if (CompletionData?.user?.personalNumber !== originalPersonalNumber) {
        console.error('BankID validation failed: Personal number mismatch.');
        
        // Clear session cookie
        const response = NextResponse.json({ 
          error: 'Identiteten kunde inte verifieras. Vänligen försök igen.' 
        }, { status: 400 });
        response.cookies.delete('bankid-session');
        return response;
      }
      
      // On successful validation, clear session and return data.
      const response = NextResponse.json({
        status: 'complete',
        hintCode: HintCode,
        completionData: CompletionData,
      });
      response.cookies.delete('bankid-session');
      return response;
    }

    // If failed, clear the session and return failure status.
    if (Status === 'failed') {
      // Check if this is a session conflict rather than user cancellation
      // If cancelled within 5 seconds of creation, it's almost certainly a conflict
      const sessionAge = sessionData.createdAt ? Date.now() - sessionData.createdAt : null;
      let adjustedHintCode = HintCode;
      
      if (HintCode === 'cancelled' && sessionAge && sessionAge < 5000) {
        // BankID cancelled the session immediately due to conflict with another session
        adjustedHintCode = 'sessionConflict';
      }
      
      const response = NextResponse.json({
        status: Status,
        hintCode: adjustedHintCode,
      });
      response.cookies.delete('bankid-session');
      return response;
    }

    return NextResponse.json({
      status: Status,
      hintCode: HintCode,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      // JWT token invalid or expired
      const response = NextResponse.json({ error: 'Session expired. Please try again.' }, { status: 401 });
      response.cookies.delete('bankid-session');
      return response;
    }
    
    console.error('BankID Collect Error:', error);
    const response = NextResponse.json({ error: error.message }, { status: 500 });
    response.cookies.delete('bankid-session');
    return response;
  }
}
