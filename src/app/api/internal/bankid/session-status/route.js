import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
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
