'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDevice } from '@/hooks/useDevice';
import { useOrder } from '@/hooks/useOrder';
import { useCSRFToken } from '@/hooks/useCSRFToken';
import Guide from '@/components/Guide';
import QRCodeDisplay from '@/components/QrCodeDisplay';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

// Note: The actual timeout is controlled by BankSignering API
// These are estimates based on observed behavior:
// Start timeout: ~30-60 seconds to begin authentication (scan QR/open app)
// Total timeout: Unknown, but likely 3-5 minutes (controlled by BankSignering/BankID)
// The frontend timer is just a visual guide - the actual timeout is server-controlled
const transactionTimeoutSeconds = 180; // 3 minutes estimate

export default function SigneraPage() {
  const router = useRouter();
  const t = useTranslations('bankid');
  const { isMobile } = useDevice();
  const { orderDetails } = useOrder();
  const { secureFetch } = useCSRFToken();

  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState(null);
  const [hintCode, setHintCode] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [autoStartToken, setAutoStartToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(transactionTimeoutSeconds);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isResumed, setIsResumed] = useState(false);
  const [sessionConflict, setSessionConflict] = useState(null);

  const sessionInitiated = useRef(false);
  const pollingIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const timersStarted = useRef(false);
  const isUnmounting = useRef(false);

  const cleanupTimers = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    timersStarted.current = false;
  }, []);

  const initiateSession = useCallback(async () => {
    // Double-check to prevent race conditions in React Strict Mode
    if (isUnmounting.current || sessionInitiated.current) {
      return;
    }
    
    // Immediately mark as initiated to prevent race conditions
    sessionInitiated.current = true;
    
    // Reset timers flag so polling can start
    timersStarted.current = false;
    
    const personalNumberForBankId = orderDetails?.bankIdPersonalNumber;
    if (!personalNumberForBankId) {
      sessionInitiated.current = false;
      router.replace('/kassa');
      return;
    }

    try {
      setStatus('initializing');
      setError(null);
      
      // BUGFIX: First try to cancel any existing session before initiating new one
      try {
        await fetch('/api/internal/bankid/cancel', { 
          method: 'POST',
          credentials: 'include'
        });
        // Small delay to ensure server processes the cancellation
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (cancelError) {
        console.warn('Failed to cancel existing session (this is normal if no session exists):', cancelError);
      }
      
      const response = await secureFetch('/api/internal/bankid/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          personalNumber: personalNumberForBankId,
          signingText: t('signingText') // Pass translated signing text
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Server error - invalid response format');
      }
      
      if (!response.ok) {
        sessionInitiated.current = false; // Reset on error
        // Handle session conflict error specifically
        if (data.errorType === 'session_conflict') {
          setSessionConflict({
            message: data.error,
            retryAfter: data.retryAfter || 180
          });
          setStatus('session_conflict');
          return;
        }
        throw new Error(data.error || 'Failed to initiate BankID');
      }

      if (!isUnmounting.current) {
        // Already set to true at the beginning
        setAutoStartToken(data.autoStartToken);
        setQrImageUrl(data.qrImageUrl);
        setIsResumed(data.resumed || false);
        setHintCode('outstandingTransaction');
        setStatus('active');
        
        if (data.resumed) {
          // Resumed existing BankID session
        } else {
          // Created new BankID session
        }
        
        // Start polling after successful session creation
        // Use setTimeout to break out of the current call stack
        setTimeout(() => {
          if (!timersStarted.current && !isUnmounting.current) {
            timersStarted.current = true;
            
            pollingIntervalRef.current = setInterval(pollStatus, 2000);
            
            timerIntervalRef.current = setInterval(() => {
              setTimeLeft((prev) => {
                if (prev <= 1) {
                  cleanupTimers();
                  setError('Tiden för BankID-verifiering har gått ut.');
                  setStatus('error');
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        }, 0);
      }
    } catch (err) {
      sessionInitiated.current = false; // Reset on error
      if (isUnmounting.current) return;
      
      console.error('BankID initiation failed:', err);
      setError(err.message || t('errors.generic'));
      setStatus('error');
      cleanupTimers();
    }
  }, [orderDetails?.bankIdPersonalNumber, router, t, cleanupTimers]);

  const handleFailure = useCallback(
    (err) => {
      if (isUnmounting.current) return;
      
      console.error('BankID flow failed:', err);
      setError(err.message || t('errors.generic'));
      setStatus('error');
      cleanupTimers();
    },
    [cleanupTimers, t],
  );

  const pollStatus = useCallback(async () => {
    if (!sessionInitiated.current || isUnmounting.current) return;

    try {
      const response = await fetch('/api/internal/bankid/collect', { 
        method: 'POST',
        credentials: 'include' // Important for cookies
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Session expired, try to restart
          sessionInitiated.current = false;
          cleanupTimers();
          handleFailure(new Error('Session expired'));
          return;
        }
        const data = await response.json();
        throw new Error(data.error || 'Polling failed');
      }
      
      const data = await response.json();

      if (data.status === 'complete') {
        sessionInitiated.current = false;
        cleanupTimers();
        router.push('/kassa/bekraftelse');
      } else if (data.status === 'failed') {
        sessionInitiated.current = false;
        cleanupTimers();
        throw new Error(t(`hintCodes.${data.hintCode}`, t('hintCodes.default')));
      } else {
        setHintCode(data.hintCode);
      }
    } catch (err) {
      if (isUnmounting.current) return;
      console.error('Polling error:', err);
      
      // BUGFIX: Handle session conflict errors with user-friendly message
      if (err.message?.includes('previous BankID attempt is still active')) {
        console.warn('Session conflict detected, showing user-friendly message...');
        sessionInitiated.current = false;
        cleanupTimers();
        setSessionConflict({
          message: err.message,
          retryAfter: 120 // 2 minutes
        });
        setStatus('session_conflict');
        return;
      }
      
      sessionInitiated.current = false;
      cleanupTimers();
      handleFailure(err);
    }
  }, [handleFailure, router, t, cleanupTimers, initiateSession]);


  useEffect(() => {
    isUnmounting.current = false;
    
    // Only initiate if we haven't already started a session and we have required data
    if (!sessionInitiated.current && orderDetails?.bankIdPersonalNumber) {
      initiateSession();
    }

    return () => {
      isUnmounting.current = true;
      sessionInitiated.current = false;
      cleanupTimers();
      
      // Cancel session on unmount with better error handling
      fetch('/api/internal/bankid/cancel', { 
        method: 'POST', 
        credentials: 'include',
        keepalive: true 
      }).catch((error) => {
        console.warn('Failed to cancel session on unmount:', error);
      });
    };
  }, [orderDetails?.bankIdPersonalNumber, initiateSession]); // Include dependencies

  const handleCancel = useCallback(async () => {
    isUnmounting.current = true;
    sessionInitiated.current = false;
    cleanupTimers();
    
    try {
      await fetch('/api/internal/bankid/cancel', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Failed to cancel BankID session:', err);
    }
    
    router.push('/kassa');
  }, [router, cleanupTimers]);

  const handleRetryAfterConflict = useCallback(() => {
    setSessionConflict(null);
    setError(null);
    sessionInitiated.current = false;
    initiateSession();
  }, [initiateSession]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
  let message;
  if (isResumed && hintCode) {
    message = `${t('resuming')} - ${t(`hintCodes.${hintCode}`)}`;
  } else if (hintCode) {
    message = t(`hintCodes.${hintCode}`);
  } else {
    message = t('initializing');
  }

  const renderMainAction = () => {
    if (isMobile && !showQrCode) {
      return (
        <div className="flex flex-col items-center">
          <div className="p-6">
            <DevicePhoneMobileIcon className="h-24 w-24 text-secondary/80" />
          </div>
          <p className="text-center font-medium mt-4">{t('mobile.openApp')}</p>
          <a
            href={`https://app.bankid.com/?autostarttoken=${autoStartToken}&redirect=null`}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-base font-medium text-primary shadow-sm hover:opacity-90"
          >
            {t('mobile.openBankIDButton')}
          </a>
          <button
            onClick={() => {
              setShowQrCode(true);
            }}
            className="mt-4 text-sm text-secondary/70 hover:underline"
          >
            {t('mobile.showQrCodeInstead')}
          </button>
        </div>
      );
    }
    return <QRCodeDisplay qrImageUrl={qrImageUrl} />;
  };

  if (status === 'initializing') {
    return (
      <div className="bg-primary text-secondary flex min-h-screen flex-col items-center justify-start px-4 pt-8 sm:pt-16">
        <div className="w-full max-w-md p-8 space-y-6 bg-primary rounded-lg shadow-md border border-divider text-center">
          <h2 className="text-2xl font-bold">{t('initializing')}</h2>
          <p>{t('pleaseWait')}</p>
        </div>
      </div>
    );
  }

  if (status === 'session_conflict') {
    return (
      <div className="bg-primary text-secondary flex min-h-screen flex-col items-center justify-start px-4 pt-8 sm:pt-16">
        <div className="w-full max-w-md p-8 space-y-6 bg-primary rounded-lg shadow-md border border-divider text-center">
          <div className="p-4 bg-warning-light border border-warning rounded-lg">
            <h3 className="text-xl font-bold text-warning-dark mb-3">{t('sessionConflict.title')}</h3>
            <p className="text-sm text-warning-dark mb-4">{sessionConflict?.message}</p>
            <p className="text-xs text-secondary/70 mb-4">
              {t('sessionConflict.explanation')}
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleRetryAfterConflict}
              className="px-6 py-3 bg-accent text-primary rounded-md hover:opacity-90 font-medium"
            >
              {t('sessionConflict.retryNow')}
            </button>
            <button
              onClick={() => router.push('/kassa')}
              className="px-6 py-2 border border-secondary/20 text-secondary rounded-md hover:bg-secondary/5"
            >
              {t('sessionConflict.backToCheckout')}
            </button>
          </div>
          <p className="text-xs text-secondary/50">
            {t('sessionConflict.waitSuggestion', { minutes: Math.ceil((sessionConflict?.retryAfter || 180) / 60) })}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-primary text-secondary flex min-h-screen flex-col items-center justify-start px-4 pt-8 sm:pt-16">
        <div className="w-full max-w-md p-8 space-y-6 bg-primary rounded-lg shadow-md border border-divider text-center">
          <h3 className="text-2xl font-bold text-center">{t('errorTitle')}</h3>
          <div className="text-center text-failure mt-4">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => router.push('/kassa')}
              className="mt-6 px-6 py-2 bg-accent text-primary rounded-md hover:opacity-90"
            >
              {t('backToCheckoutButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary text-secondary flex min-h-screen flex-col items-center justify-start px-4 pt-8 sm:pt-16">
      <Guide onBackClick={handleCancel}>
        <div className="absolute top-2 right-2">
          <Image
            src="https://internetportcom.b-cdn.net/se/img/bankid-logo-svart.png"
            alt={t('logoAlt')}
            width={72}
            height={24}
            style={{ height: 'auto' }}
            unoptimized
          />
        </div>
        <h3 className="text-2xl font-bold text-center">{t('title')}</h3>
        <p className="text-center font-medium h-10 mt-4">{message}</p>
        {renderMainAction()}
        <div className="mt-4 space-y-2">
          <p className="text-sm text-secondary/70" aria-live="polite">
            {t('timer', { timerDisplay })}
          </p>
          <p className="text-xs text-warning font-medium">
            {t('quickStartNote')}
          </p>
        </div>
        <div className="grow" />
        <div className="w-full border-t border-divider my-6" />
        {!isMobile && hintCode === 'outstandingTransaction' && (
          <div className="flex flex-col items-center">
            <a
              href={`bankid:///?autostarttoken=${autoStartToken}&redirect=null`}
              className="text-sm font-semibold text-accent hover:underline"
            >
              {t('desktop.openOnThisDevice')}
            </a>
          </div>
        )}
        <button onClick={handleCancel} className="mt-4 text-sm text-secondary/70 hover:underline">
          {t('cancelButton')}
        </button>
      </Guide>
    </div>
  );
}
