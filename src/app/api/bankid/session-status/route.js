import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { generalRateLimiter, applyRouteRateLimit } from '@/lib/rateLimit';

export async function GET(request) {
  // Layer 1: General rate limiting only (session status check is a read operation, doesn't need strict auth limiting)
  const generalLimit = await applyRouteRateLimit(request, generalRateLimiter);
  if (generalLimit) return generalLimit;

  try {
    const session = await getSession();
    // Check if there is an active BankID order reference in the session.
    const hasActiveSession = !!session.bankid?.orderRef;

    return NextResponse.json({ hasActiveSession });
  } catch (error) {
    console.error('Session status check failed:', error);
    return NextResponse.json(
      { hasActiveSession: false, error: 'Failed to check session status.' },
      { status: 500 },
    );
  }
}
