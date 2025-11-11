'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const SettingsToggle = ({ label, description, isChecked, onToggle, isLocked = false }) => {
  const isEffectivelyChecked = isLocked || isChecked;

  return (
    <div className="flex items-start justify-between py-4 border-b border-divider">
      <div>
        <p className="font-semibold text-secondary">{label}</p>
        <p className="text-sm text-secondary/70">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isEffectivelyChecked}
          onChange={onToggle}
          disabled={isLocked}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
            isEffectivelyChecked ? 'bg-accent after:translate-x-full' : 'bg-secondary/30'
          } ${isLocked ? 'cursor-not-allowed' : ''}`}
        ></div>
      </label>
    </div>
  );
};

export default function CookieBanner() {
  const t = useTranslations('cookieBanner');
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie_consent');
    if (storedConsent === null) {
      setShowBanner(true);
    }
  }, []);

  const updateGtmConsent = (newConsent) => {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: newConsent.analytics ? 'granted' : 'denied',
        ad_storage: newConsent.marketing ? 'granted' : 'denied',
        ad_user_data: newConsent.marketing ? 'granted' : 'denied',
        ad_personalization: newConsent.marketing ? 'granted' : 'denied',
      });
    }
  };

  const handleAcceptAll = () => {
    const newConsent = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookie_consent', JSON.stringify(newConsent));
    updateGtmConsent(newConsent);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const newConsent = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookie_consent', JSON.stringify(newConsent));
    updateGtmConsent(newConsent);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    updateGtmConsent(consent);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-darkblack/30 backdrop-blur-sm z-50 flex items-end justify-center sm:justify-end p-4">
      <div className="w-full max-w-xl bg-primary rounded-xl shadow-2xl ring-1 ring-divider">
        {showSettings ? (
          // Layer 2: Settings Modal.
          <div className="p-6">
            <h3 className="text-lg font-bold text-secondary">{t('settingsTitle')}</h3>
            <p className="text-sm text-secondary/80 mt-1">{t('settingsIntro')}</p>
            <div className="mt-4">
              {/* Using isLocked to control the "Necessary" toggle's appearance and behavior. */}
              <SettingsToggle
                label={t('necessaryTitle')}
                description={t('necessaryDescription')}
                isChecked={true}
                isLocked={true}
              />
              <SettingsToggle
                label={t('analyticsTitle')}
                description={t('analyticsDescription')}
                isChecked={consent.analytics}
                onToggle={() => setConsent((c) => ({ ...c, analytics: !c.analytics }))}
              />
              <SettingsToggle
                label={t('marketingTitle')}
                description={t('marketingDescription')}
                isChecked={consent.marketing}
                onToggle={() => setConsent((c) => ({ ...c, marketing: !c.marketing }))}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-accent/90"
              >
                {t('saveSettings')}
              </button>
            </div>
          </div>
        ) : (
          // Layer 1: Initial Banner.
          <div className="p-6">
            <p className="text-sm/6 text-secondary">
              {t('message')}{' '}
              <Link href="/cookies" className="font-semibold text-accent hover:text-accent/80">
                {t('policyLink')}
              </Link>
              .
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-secondary shadow-sm ring-1 ring-inset ring-divider hover:bg-secondary/5"
              >
                {t('settings')}
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="rounded-md px-3 py-2 text-sm font-semibold text-secondary shadow-sm ring-1 ring-inset ring-divider hover:bg-secondary/5"
              >
                {t('reject')}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-accent/90"
              >
                {t('accept')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
