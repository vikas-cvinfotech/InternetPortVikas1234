import { NextResponse } from 'next/server';
import { getJwtSession, destroyJwtSession } from '@/lib/jwtSession';
import { bankIdAPI } from '@/lib/bankid-api';

export async function GET(request) {
  
  try {
    const session = await getJwtSession();
    
    if (!session.bankid?.orderRef) {
      return NextResponse.json({ 
        hasActiveSession: false,
        status: 'none'
      });
    }

    const { orderRef, personalNumber } = session.bankid;

    // Check the status of the existing session
    try {
      const statusResponse = await bankIdAPI.collectStatus({ orderRef });
      const { Status, HintCode } = statusResponse.Response;

      if (Status === 'complete') {
        // Session completed, clean up
        await destroyJwtSession();
        return NextResponse.json({
          hasActiveSession: false,
          status: 'completed'
        });
      }

      if (Status === 'failed' || (HintCode && ['expiredTransaction', 'cancelled', 'startFailed'].includes(HintCode))) {
        // Session failed or expired, clean up
        await destroyJwtSession();
        return NextResponse.json({
          hasActiveSession: false,
          status: 'expired'
        });
      }

      if (Status === 'pending') {
        // Session is still active, get QR code
        try {
          const qrResponse = await bankIdAPI.collectQr({ orderRef });
          return NextResponse.json({
            hasActiveSession: true,
            status: 'pending',
            orderRef: orderRef,
            personalNumber: personalNumber,
            qrImageUrl: qrResponse.Response.qrImage,
            autoStartToken: null, // We don't store this, but it's not needed for resume
            hintCode: HintCode
          });
        } catch (qrError) {
          console.error('[BANKID STATUS] Failed to get QR for existing session:', qrError);
          // QR failed, session might be expired
          await destroyJwtSession();
          return NextResponse.json({
            hasActiveSession: false,
            status: 'expired'
          });
        }
      }

      // Unknown status, assume expired
      await destroyJwtSession();
      return NextResponse.json({
        hasActiveSession: false,
        status: 'expired'
      });

    } catch (error) {
      console.error('[BANKID STATUS] Error checking session status:', error);
      // If we can't check status, assume session is expired
      await destroyJwtSession();
      return NextResponse.json({
        hasActiveSession: false,
        status: 'expired'
      });
    }

  } catch (error) {
    console.error('[BANKID STATUS] Error:', error);
    return NextResponse.json({ error: 'Failed to check session status' }, { status: 500 });
  }
}