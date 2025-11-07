import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { bankIdAPI } from '@/lib/bankid-api';
import { authRateLimiter, applyRateLimiter } from '@/lib/rateLimit';
import bankIdSessionTracker from '@/lib/bankidSessionTracker';
import { validateCSRFMiddleware } from '@/lib/csrf';
import { initializeApplication } from '@/lib/startup';
import jwt from 'jsonwebtoken';

// JWT secret is validated by environment validation
const JWT_SECRET = process.env.SECRET_COOKIE_PASSWORD;

export async function POST(request) {
  // Initialize application if not already done
  initializeApplication();
  
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  let personalNumber; // Declare in outer scope for catch block

  // Validate CSRF token for authentication endpoint
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid && !csrfValidation.skip) {
    return NextResponse.json(
      { error: csrfValidation.error, code: csrfValidation.code },
      { status: 403 }
    );
  }

  // Apply rate limiting to prevent brute force attacks (disabled in development due to React Strict Mode)
  if (process.env.NODE_ENV === 'production') {
    const { success } = await applyRateLimiter(authRateLimiter, ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }
  }

  try {
    const requestBody = await request.json();
    personalNumber = requestBody.personalNumber;
    const signingText = requestBody.signingText || 'Jag godkänner beställningen från Internetport Sweden AB.'; // Get signing text from request, with Swedish fallback
    
    if (!personalNumber) {
      return NextResponse.json({ error: 'Personal number is required.' }, { status: 400 });
    }

    // Don't block based on local tracking since it can get out of sync with BankID API
    // The BankID API will return an error if there's an actual conflict
    // We still track locally for cleanup purposes
    bankIdSessionTracker.setOngoingInitiation(personalNumber);

    // Check for existing session first
    const existingSessionToken = request.cookies.get('bankid-session')?.value;
    if (existingSessionToken) {
      try {
        const existingSessionData = jwt.verify(existingSessionToken, JWT_SECRET);
        if (existingSessionData.orderRef && existingSessionData.personalNumber === personalNumber) {
          // We have an active session for the same user - check if it's still valid
          
          const statusResponse = await bankIdAPI.collectStatus({ orderRef: existingSessionData.orderRef });
          const { Status } = statusResponse.Response;
          
          if (Status === 'pending') {
            // Session is still active, return existing session data
            
            const qrResponse = await bankIdAPI.collectQr({ orderRef: existingSessionData.orderRef });
            const qrImageUrl = qrResponse.Response.qrImage;
            
            // Clean up the ongoing initiation marker
            bankIdSessionTracker.clearOngoingInitiation(personalNumber);
            
            return NextResponse.json({
              autoStartToken: existingSessionData.autoStartToken,
              qrImageUrl: qrImageUrl,
              resumed: true
            });
          } else if (Status === 'complete' || Status === 'failed') {
            // Session is finished, clear it and create new one
          }
        }
      } catch (jwtError) {
        // Token invalid or expired, proceed with new session
      }
    }

    // Step 1: Initiate the signature to get the orderRef.
    let signResponse;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        signResponse = await bankIdAPI.sign({
          endUserIp: ip,
          personalNumber,
          userVisibleData: signingText, // Use the translated signing text from frontend
        });
        break; // Success, exit the retry loop
      } catch (signError) {
        // Check if it's a session conflict error
        if (signError.message?.includes('already in progress') && retryCount < maxRetries) {
          console.log(`[BANKID INITIATE] Session conflict detected, retrying... (attempt ${retryCount + 1}/${maxRetries})`);
          // Wait 2 seconds before retrying to let the old session expire
          await new Promise(resolve => setTimeout(resolve, 2000));
          retryCount++;
        } else {
          // Not a conflict error or max retries reached, throw the error
          throw signError;
        }
      }
    }
    
    if (!signResponse) {
      throw new Error('Failed to initiate BankID signature after retries');
    }

    const { OrderRef, AutoStartToken } = signResponse.Response;
    if (!OrderRef || !AutoStartToken) {
      throw new Error('Incomplete response from BankID sign API.');
    }

    // Step 2: Use the orderRef to get the QR code.
    const qrResponse = await bankIdAPI.collectQr({ orderRef: OrderRef });
    const qrImageUrl = qrResponse.Response.qrImage;
    if (!qrImageUrl) {
      throw new Error('Failed to retrieve QR code from BankID API.');
    }

    // Create JWT token with session data
    const sessionData = {
      orderRef: OrderRef,
      autoStartToken: AutoStartToken,
      personalNumber: personalNumber,
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    };
    
    const newSessionToken = jwt.sign(sessionData, JWT_SECRET, { expiresIn: '10m' });

    const response = NextResponse.json({
      autoStartToken: AutoStartToken,
      qrImageUrl: qrImageUrl,
    });

    // Set session token as httpOnly cookie
    response.cookies.set('bankid-session', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes in seconds
      path: '/'
    });

    // Clean up the ongoing initiation marker
    bankIdSessionTracker.clearOngoingInitiation(personalNumber);
    
    return response;
  } catch (error) {
    // Clean up the ongoing initiation marker
    if (personalNumber) {
      bankIdSessionTracker.clearOngoingInitiation(personalNumber);
    }
    console.error('BankID Initiation Error:', error);
    
    // Check for BankSignering API session conflict error
    if (error.message && error.message.includes('Invalid parameters') || 
        error.message.includes('already in progress')) {
      console.warn('BankID session conflict detected');
      console.warn('Error type:', error.name);
      
      return NextResponse.json(
        { 
          error: 'Ett tidigare BankID-försök pågår fortfarande. Vänta några minuter innan du försöker igen.',
          errorType: 'session_conflict',
          retryAfter: 180 // Suggest retry after 3 minutes
        },
        { status: 409 }, // 409 Conflict status code
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to initiate BankID signature.' },
      { status: 500 },
    );
  }
}
