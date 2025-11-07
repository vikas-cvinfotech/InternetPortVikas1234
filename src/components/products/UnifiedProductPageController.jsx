'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import ProductErrorBoundary from './ProductErrorBoundary';
import { useBroadbandData } from '@/hooks/useBroadbandData';
import { useCart } from '@/hooks/useCart';
import {
  determineProductStrategy,
  extractProductIdFromSlug,
  requiresAddressData,
} from '@/lib/utils/productStrategy';
import { getCartPricingData } from '@/lib/utils/productPricing';
import { isTelephonyHardware } from '@/config/telephonyProducts';
import { PageSkeleton } from '@/components/skeletons';

const TelephonyProductDescription = lazy(() => import('./TelephonyProductDescription'));

// Helper to generate a URL-friendly slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const categoryNames = {
  vpn: 'Säkerhet',
  sakerhet: 'Säkerhet', // Allow 'sakerhet' to map to the same display name
  natverksprodukter: 'Nätverksprodukter',
  telefoni: 'Telefoni',
  bredband: 'Bredband',
  tv: 'TV',
};

const categoryIds = {
  vpn: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_SECURITY, 10) || 22,
  natverksprodukter: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_BROADBAND, 10) || 10, // Network products use broadband category
  telefoni: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TELEPHONY, 10) || 16,
  bredband: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_BROADBAND, 10) || 10, // Broadband category (10 in both dev and prod)
  sakerhet: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_SECURITY, 10) || 22, // Same as VPN category
  tv: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TV, 10) || 21, // TV category ID from environment (21 dev, 60 prod)
};

// Helper function to render translated product descriptions
const renderBroadbandDescription = (t) => {
  return `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
        <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
          <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          ${t('productDescriptions.broadband.heroTitle')}
        </h3>
        <p class="text-secondary/80 leading-relaxed">${t.raw(
          'productDescriptions.broadband.heroDescription'
        )}</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-success-light/50 p-5 rounded-lg border border-success/20">
          <h4 class="font-semibold text-success-dark mb-2 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${t('productDescriptions.broadband.noBindingTitle')}
          </h4>
          <p class="text-secondary/75 text-sm">${t(
            'productDescriptions.broadband.noBindingDescription'
          )}</p>
        </div>

        <div class="bg-info-light/50 p-5 rounded-lg border border-info/20">
          <h4 class="font-semibold text-info-dark mb-2 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            ${t('productDescriptions.broadband.transparentPricingTitle')}
          </h4>
          <p class="text-secondary/75 text-sm">${t(
            'productDescriptions.broadband.transparentPricingDescription'
          )}</p>
        </div>
      </div>

      <div class="bg-secondary/5 p-6 rounded-xl">
        <h4 class="font-bold text-secondary mb-4">${t(
          'productDescriptions.broadband.lifestyleTitle'
        )}</h4>
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">🏠</div>
            <strong class="block text-secondary mb-1">${t(
              'productDescriptions.broadband.homeUsersTitle'
            )}</strong>
            <span class="text-secondary/70">${t(
              'productDescriptions.broadband.homeUsersDescription'
            )}</span>
          </div>
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">💼</div>
            <strong class="block text-secondary mb-1">${t(
              'productDescriptions.broadband.remoteWorkersTitle'
            )}</strong>
            <span class="text-secondary/70">${t(
              'productDescriptions.broadband.remoteWorkersDescription'
            )}</span>
          </div>
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">🎮</div>
            <strong class="block text-secondary mb-1">${t(
              'productDescriptions.broadband.gamersCreatorsTitle'
            )}</strong>
            <span class="text-secondary/70">${t(
              'productDescriptions.broadband.gamersCreatorsDescription'
            )}</span>
          </div>
        </div>
      </div>

      <div class="text-center bg-accent/5 p-4 rounded-lg border border-accent/20">
        <p class="text-secondary/80">${t.raw('productDescriptions.broadband.ctaText')}</p>
      </div>
    </div>
  `;
};

// Legacy descriptions removed to reduce bundle size

// Broadband service mock data (for address-based services)
const createMockBroadbandProduct = (locale, t, tDescription, tImages, tCategories) => {
  // Use translation-based description
  let description;
  try {
    description = renderBroadbandDescription(tDescription);
  } catch (error) {
    console.error('Failed to render broadband description:', error);
    description =
      '<div class="text-center p-6"><p class="text-secondary">Broadband service description unavailable</p></div>';
  }

  return {
    name: tCategories('broadband.name') || 'Bredband',
    description,
    images: [
      {
        src: 'https://internetportcom.b-cdn.net/se/img/kvinna-studerar-online-med-laptop-i-sangen.jpg',
        alt: tImages('broadband.studyingOnline'),
      },
      {
        src: 'https://internetportcom.b-cdn.net/se/img/man-spelar-tvspel-i-soffan-med-snacks.jpg',
        alt: tImages('broadband.gamingConsole'),
      },
      {
        src: 'https://internetportcom.b-cdn.net/se/img/man-gamer-vid-dator-med-headset.jpg',
        alt: tImages('broadband.gamerSetup'),
      },
    ],
  };
};

// Helper functions to render TV descriptions with translations
const renderTvBaspaketDescription = (t) => {
  return `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
        <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
          <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
          </svg>
          ${t('productDescriptions.tvBaspaket.heroTitle')}
        </h3>
        <p class="text-secondary/80 leading-relaxed">${t.raw(
          'productDescriptions.tvBaspaket.heroDescription'
        )}</p>
      </div>

      <div class="bg-accent p-4 rounded-lg text-center border-2 border-accent">
        <div class="flex items-center justify-center">
          <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4"></path>
          </svg>
          <h4 class="text-lg font-bold text-primary">${t(
            'productDescriptions.tvBaspaket.channelCountTitle'
          )}</h4>
        </div>
        <p class="text-sm text-primary/90 mt-1">${t(
          'productDescriptions.tvBaspaket.channelCountDescription'
        )}</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-success-light/50 p-5 rounded-lg border border-success/20">
          <h4 class="font-semibold text-success-dark mb-3 flex items-center">
            <span class="text-xl mr-2">🇸🇪</span>
            ${t('productDescriptions.tvBaspaket.swedishCoreTitle')}
          </h4>
          <div class="text-secondary/75 text-sm space-y-1">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>${t.raw('productDescriptions.tvBaspaket.swedishCoreDescription')}</span>
            </div>
          </div>
        </div>

        <div class="bg-info-light/50 p-5 rounded-lg border border-info/20">
          <h4 class="font-semibold text-info-dark mb-3 flex items-center">
            <span class="text-xl mr-2">🎤</span>
            ${t('productDescriptions.tvBaspaket.entertainmentTitle')}
          </h4>
          <div class="text-secondary/75 text-sm space-y-1">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>${t.raw('productDescriptions.tvBaspaket.entertainmentDescription')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TV Box Compatibility Information -->
      <div class="bg-secondary/5 p-5 rounded-lg border border-divider">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 mt-0.5">
            <div class="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-secondary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-medium text-secondary mb-2">${t(
              'productDescriptions.tvCompatibility.ownDeviceTitle'
            )}</h4>
            <p class="text-secondary/75 mb-4 text-sm leading-relaxed">${t.raw(
              'productDescriptions.tvCompatibility.ownDeviceDescription'
            )}</p>
            
            <div class="bg-primary p-4 rounded-lg border border-secondary/10 mb-4">
              <h5 class="text-sm font-medium text-secondary mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2 text-secondary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                ${t('productDescriptions.tvCompatibility.compatibleModelsTitle')}
              </h5>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP1113</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.refurbishedLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP1003</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.standardLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP1963</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.standardLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP1853</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.standardLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP2853</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.standardLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP4302</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.premiumLabel'
                    )}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-warning-light/30 p-3 rounded border-l-3 border-warning-light">
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-2 mt-0.5">
                  <svg class="w-4 h-4 text-warning-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h6 class="font-medium text-warning-dark mb-1 text-sm">${t(
                    'productDescriptions.tvCompatibility.importantNoteTitle'
                  )}</h6>
                  <p class="text-xs text-secondary/70 leading-relaxed">${t.raw(
                    'productDescriptions.tvCompatibility.importantNoteDescription'
                  )}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center bg-accent/5 p-6 rounded-lg border border-accent/20">
        <h4 class="font-bold text-accent mb-3">${t('productDescriptions.tvBaspaket.ctaTitle')}</h4>
        <p class="text-secondary/80 mb-4">${t.raw(
          'productDescriptions.tvBaspaket.ctaDescription'
        )}</p>
        <div class="bg-primary p-4 rounded-lg inline-block">
          <div class="text-secondary text-sm">${t(
            'productDescriptions.tvBaspaket.ctaFeatures'
          )}</div>
        </div>
      </div>
    </div>
  `;
};

const renderTvBaspaketPlusDescription = (t) => {
  return `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
        <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
          <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
          ${t('productDescriptions.tvBaspaketPlus.heroTitle')}
        </h3>
        <p class="text-secondary/80 leading-relaxed">${t.raw(
          'productDescriptions.tvBaspaketPlus.heroDescription'
        )}</p>
      </div>

      <div class="bg-gradient-to-r from-accent/20 to-accent/10 p-4 rounded-lg text-center border-2 border-accent">
        <div class="flex items-center justify-center mb-1">
          <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
          <h4 class="text-lg font-bold text-accent">✨ ${t(
            'productDescriptions.tvBaspaketPlus.premiumUpgradeTitle'
          )}</h4>
        </div>
        <p class="text-lg font-semibold text-secondary">${t(
          'productDescriptions.tvBaspaketPlus.premiumUpgradeSubtitle'
        )}</p>
        <p class="text-sm text-secondary/80 mt-1">${t(
          'productDescriptions.tvBaspaketPlus.premiumUpgradeDescription'
        )}</p>
      </div>

      <div class="bg-success-light/30 p-6 rounded-xl border-2 border-success/30">
        <h4 class="font-bold text-success-dark mb-4 flex items-center text-lg">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ${t('productDescriptions.tvBaspaketPlus.whatsIncludedTitle')}
        </h4>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-success-light/50 p-4 rounded-lg">
            <h5 class="font-semibold text-success-dark mb-2">✅ ${t(
              'productDescriptions.tvBaspaketPlus.allBaseChannelsTitle'
            )}</h5>
            <p class="text-secondary/75 text-sm">${t(
              'productDescriptions.tvBaspaketPlus.allBaseChannelsDescription'
            )}</p>
          </div>
          <div class="bg-success-light/50 p-4 rounded-lg">
            <h5 class="font-semibold text-success-dark mb-2">🌟 ${t(
              'productDescriptions.tvBaspaketPlus.premiumChannelsTitle'
            )}</h5>
            <p class="text-secondary/75 text-sm">${t(
              'productDescriptions.tvBaspaketPlus.premiumChannelsDescription'
            )}</p>
          </div>
        </div>
      </div>

      <!-- Premium Channels Spotlight -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-warning-light/50 p-5 rounded-lg border border-warning/30">
          <h4 class="font-semibold text-warning-dark mb-3 flex items-center">
            <span class="text-xl mr-2">🏆</span>
            ${t('productDescriptions.tvBaspaketPlus.premiumSportSubtitle')}
          </h4>
          <div class="text-secondary/75 text-sm space-y-2">
            <div class="flex items-start">
              <svg class="w-4 h-4 mr-2 text-warning mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <strong>${t('productDescriptions.tvBaspaketPlus.channels.eurosport2Hd')}</strong>
                <p class="text-xs text-secondary/60">${t(
                  'productDescriptions.tvBaspaketPlus.eurosport2Description'
                )}</p>
              </div>
            </div>
            <div class="flex items-start">
              <svg class="w-4 h-4 mr-2 text-warning mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <strong>${t('productDescriptions.tvBaspaketPlus.channels.atgLiveHd')}</strong>
                <p class="text-xs text-secondary/60">${t(
                  'productDescriptions.tvBaspaketPlus.atgLiveDescription'
                )}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-info-light/50 p-5 rounded-lg border border-info/30">
          <h4 class="font-semibold text-info-dark mb-3 flex items-center">
            <span class="text-xl mr-2">🌎</span>
            ${t('productDescriptions.tvBaspaketPlus.worldClassDocsSubtitle')}
          </h4>
          <div class="text-secondary/75 text-sm space-y-2">
            <div class="flex items-start">
              <svg class="w-4 h-4 mr-2 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <strong>${t(
                  'productDescriptions.tvBaspaketPlus.channels.nationalGeographicHd'
                )}</strong>
                <p class="text-xs text-secondary/60">${t(
                  'productDescriptions.tvBaspaketPlus.natGeoDescription'
                )}</p>
              </div>
            </div>
            <div class="flex items-start">
              <svg class="w-4 h-4 mr-2 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <strong>${t('productDescriptions.tvBaspaketPlus.channels.travelChannel')}</strong>
                <p class="text-xs text-secondary/60">${t(
                  'productDescriptions.tvBaspaketPlus.travelChannelDescription'
                )}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Complete Channel Grid -->
      <div class="bg-secondary/5 p-6 rounded-xl">
        <h4 class="font-bold text-secondary mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
          ${t('productDescriptions.tvBaspaketPlus.allChannelsSubtitle')}
        </h4>
        
        <!-- Base Package Channels -->
        <div class="mb-6">
          <h5 class="font-semibold text-secondary mb-3 text-sm uppercase tracking-wide">${t(
            'productDescriptions.tvBaspaketPlus.basePackageChannelsLabel'
          )}</h5>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.svt1'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.svt2'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.svt24'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.svtBarn'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.tv3Hd'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.tv4'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.tv4Fakta'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.kanal5Hd'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.kanal612'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.tv1012Hd'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.animalPlanetHd'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.cnn'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.cartoonNetwork'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.discoveryHd'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.eurosportHd'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.kunskapskanalen'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.mtv'
              )}</span>
            </div>
            <div class="bg-primary p-2 rounded border border-divider">
              <span class="font-medium text-secondary text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.viaplaySport'
              )}</span>
            </div>
          </div>
        </div>

        <!-- Premium Channels -->
        <div class="mb-6">
          <h5 class="font-semibold text-accent mb-3 text-sm uppercase tracking-wide flex items-center">
            <span class="mr-2">✨</span>
            ${t('productDescriptions.tvBaspaketPlus.premiumChannelsLabel')}
          </h5>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
              <span class="font-bold text-accent text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.nationalGeographicHd'
              )}</span>
            </div>
            <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
              <span class="font-bold text-accent text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.eurosport2Hd'
              )}</span>
            </div>
            <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
              <span class="font-bold text-accent text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.travelChannel'
              )}</span>
            </div>
            <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
              <span class="font-bold text-accent text-xs">${t(
                'productDescriptions.tvBaspaketPlus.channels.atgLiveHd'
              )}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Value Proposition -->
      <div class="bg-gradient-to-r from-primary to-secondary/5 p-6 rounded-xl border border-divider">
        <h4 class="font-bold text-secondary mb-4">${t(
          'productDescriptions.tvBaspaketPlus.valuePropsSubtitle'
        )}</h4>
        <div class="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 class="font-semibold text-secondary mb-2 flex items-center">
              <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              ${t('productDescriptions.tvBaspaketPlus.fantasticValueTitle')}
            </h5>
            <p class="text-secondary/75">${t(
              'productDescriptions.tvBaspaketPlus.fantasticValueDescription'
            )}</p>
          </div>
          <div>
            <h5 class="font-semibold text-secondary mb-2 flex items-center">
              <svg class="w-5 h-5 mr-2 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              ${t('productDescriptions.tvBaspaketPlus.premiumContentFromStartTitle')}
            </h5>
            <p class="text-secondary/75">${t(
              'productDescriptions.tvBaspaketPlus.premiumContentFromStartDescription'
            )}</p>
          </div>
          <div>
            <h5 class="font-semibold text-secondary mb-2 flex items-center">
              <svg class="w-5 h-5 mr-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              ${t('productDescriptions.tvBaspaketPlus.somethingForFamilyTitle')}
            </h5>
            <p class="text-secondary/75">${t(
              'productDescriptions.tvBaspaketPlus.somethingForFamilyDescription'
            )}</p>
          </div>
          <div>
            <h5 class="font-semibold text-secondary mb-2 flex items-center">
              <svg class="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              ${t('productDescriptions.tvBaspaketPlus.easyCancelTitle')}
            </h5>
            <p class="text-secondary/75">${t(
              'productDescriptions.tvBaspaketPlus.easyCancelDescription'
            )}</p>
          </div>
        </div>
      </div>

      <!-- Comparison Banner -->
      <div class="bg-gradient-to-r from-success/10 to-info/10 p-6 rounded-xl border-2 border-success/20">
        <h4 class="font-bold text-secondary mb-4 text-center">💰 ${t(
          'productDescriptions.tvBaspaketPlus.compareTitle'
        )}</h4>
        <div class="grid md:grid-cols-2 gap-6 text-center">
          <div class="bg-primary p-4 rounded-lg">
            <h5 class="font-semibold text-secondary mb-2">${t(
              'productDescriptions.tvBaspaketPlus.buySeparateSubtitle'
            )}</h5>
            <p class="text-secondary/75 text-sm">${t(
              'productDescriptions.tvBaspaketPlus.buySeparateSubDescription'
            )}</p>
          </div>
          <div class="bg-gradient-to-r from-success/20 to-success/10 p-4 rounded-lg border-2 border-success/30">
            <h5 class="font-semibold text-success-dark mb-2">✨ ${t(
              'productDescriptions.tvBaspaketPlus.baspaketPlusSubtitle'
            )}</h5>
            <p class="text-success-dark text-sm font-semibold">${t(
              'productDescriptions.tvBaspaketPlus.baspaketPlusSubDescription'
            )}</p>
          </div>
        </div>
      </div>

      <!-- TV Box Compatibility Information -->
      <div class="bg-secondary/5 p-5 rounded-lg border border-divider">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0 mt-0.5">
            <div class="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-secondary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-medium text-secondary mb-2">${t(
              'productDescriptions.tvCompatibility.ownDeviceTitle'
            )}</h4>
            <p class="text-secondary/75 mb-4 text-sm leading-relaxed">${t.raw(
              'productDescriptions.tvCompatibility.ownDeviceDescription'
            )}</p>
            
            <div class="bg-primary p-4 rounded-lg border border-secondary/10 mb-4">
              <h5 class="text-sm font-medium text-secondary mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2 text-secondary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                ${t('productDescriptions.tvCompatibility.compatibleModelsTitle')}
              </h5>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP1113</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.refurbishedLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP1003</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.standardLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP1963</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.standardLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP1853</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.standardLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP2853</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.standardLabel'
                    )}</span>
                  </div>
                </div>
                <div class="bg-secondary/5 p-2 rounded border border-secondary/10">
                  <div class="text-center">
                    <span class="font-mono text-sm font-medium text-secondary block">VIP4302</span>
                    <span class="text-xs text-secondary/60 mt-0.5 block">${t(
                      'productDescriptions.tvCompatibility.premiumLabel'
                    )}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-warning-light/30 p-3 rounded border-l-3 border-warning-light">
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-2 mt-0.5">
                  <svg class="w-4 h-4 text-warning-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h6 class="font-medium text-warning-dark mb-1 text-sm">${t(
                    'productDescriptions.tvCompatibility.importantNoteTitle'
                  )}</h6>
                  <p class="text-xs text-secondary/70 leading-relaxed">${t.raw(
                    'productDescriptions.tvCompatibility.importantNoteDescription'
                  )}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center bg-accent/5 p-6 rounded-lg border border-accent/20">
        <h4 class="font-bold text-accent mb-3">${t(
          'productDescriptions.tvBaspaketPlus.ctaTitle'
        )}</h4>
        <p class="text-secondary/80 mb-4">${t.raw(
          'productDescriptions.tvBaspaketPlus.ctaDescription'
        )}</p>
        <div class="bg-gradient-to-r from-accent/20 to-accent/10 p-4 rounded-lg inline-block border border-accent/30">
          <div class="text-accent font-bold text-lg">🌟 ${t(
            'productDescriptions.tvBaspaketPlus.ctaUpgradeTitle'
          )}</div>
          <div class="text-secondary text-sm">${t(
            'productDescriptions.tvBaspaketPlus.ctaUpgradeDescription'
          )}</div>
        </div>
      </div>
    </div>
  `;
};

// TV service descriptions by package type
const getTvServiceDescription = (isBaspaketPlus = false, locale = 'sv', tDescription = null) => {
  // If translations are available, use them
  if (tDescription) {
    try {
      return isBaspaketPlus
        ? renderTvBaspaketPlusDescription(tDescription)
        : renderTvBaspaketDescription(tDescription);
    } catch (error) {
      console.warn('Translation-based description failed, falling back to legacy:', error);
    }
  }

  // Fallback to legacy hardcoded descriptions
  const baspaketDescription = {
    sv: `
      <div class="space-y-6">
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
          <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
            <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
            </svg>
            TV Baspaket - Din Kompletta TV-Upplevelse
          </h3>
          <p class="text-secondary/80 leading-relaxed">Njut av <strong class="text-accent">23 handplockade TV-kanaler</strong> som täcker allt från nyheter och sport till barnunderhållning och dokumentärer. Med vårt Baspaket får du <span class="font-semibold">perfekt balans mellan svenskt och internationellt innehåll</span> – allt levererat via ditt stadsnät med kristallklar digital kvalitet.</p>
        </div>

        <!-- Channel Count Banner -->
        <div class="bg-accent p-4 rounded-lg text-center border-2 border-accent">
          <div class="flex items-center justify-center">
            <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4"></path>
            </svg>
            <h4 class="text-lg font-bold text-primary">23 POPULÄRA KANALER INGÅR</h4>
          </div>
          <p class="text-sm text-primary/90 mt-1">Allt du behöver för vardagsunderhållning • Inga dolda avgifter</p>
        </div>

        <!-- Channel Categories Grid -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-success-light/50 p-5 rounded-lg border border-success/20">
            <h4 class="font-semibold text-success-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127480;&#127466;</span>
              Svenska Grundkanaler
            </h4>
            <div class="text-secondary/75 text-sm space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>SVT1, SVT2, SVT24</strong> - Public service & nyheter</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>TV4, TV4 Fakta</strong> - Nyheter & fakta</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Kunskapskanalen</strong> - Bildning & dokumentärer</span>
              </div>
            </div>
          </div>

          <div class="bg-info-light/50 p-5 rounded-lg border border-info/20">
            <h4 class="font-semibold text-info-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127916;</span>
              Underhållning & Nöje
            </h4>
            <div class="text-secondary/75 text-sm space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>TV3 HD, Kanal 5 HD</strong> - Film & serier</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Kanal 6-9, TV10-12 HD</strong> - Bred underhållning</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>MTV</strong> - Musik & ungdomskultur</span>
              </div>
            </div>
          </div>

          <div class="bg-warning-light/50 p-5 rounded-lg border border-warning/20">
            <h4 class="font-semibold text-warning-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127942;</span>
              Sport & Dokumentär
            </h4>
            <div class="text-secondary/75 text-sm space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Viaplay Sport</strong> - Sportkanalen</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Eurosport HD</strong> - Internationell sport</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Discovery HD, Animal Planet HD</strong> - Natur & vetenskap</span>
              </div>
            </div>
          </div>

          <div class="bg-accent/5 p-5 rounded-lg border border-accent/20">
            <h4 class="font-semibold text-accent mb-3 flex items-center">
              <span class="text-xl mr-2">&#128118;</span>
              Barn & Internationellt
            </h4>
            <div class="text-secondary/75 text-sm space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>SVT Barn/SVT24</strong> - Svensk barnkanal</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Cartoon Network</strong> - Tecknat för alla åldrar</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>CNN</strong> - Internationella nyheter</span>
              </div>
            </div>
          </div>
        </div>


        <!-- Why Choose This Package -->
        <div class="bg-gradient-to-r from-primary to-secondary/5 p-6 rounded-xl border border-divider">
          <h4 class="font-bold text-secondary mb-4">Varför Välja TV Baspaket?</h4>
          <div class="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Förmånligt Pris
              </h5>
              <p class="text-secondary/75">Allt du behöver för vardagsunderhållning till ett fast månadspris utan överraskningar. Perfekt balans mellan innehåll och kostnad.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
                Enkel Uppgradering
              </h5>
              <p class="text-secondary/75">Börja med baspaketet och lägg enkelt till sport-, film- eller barnpaket när du vill. Flexibelt system som växer med dina behov.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Perfekt för Familjen
              </h5>
              <p class="text-secondary/75">Något för alla - nyheter för föräldrarna, barnprogram för de små, sport för entusiasterna och underhållning för hela familjen.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                HD-Kvalitet
              </h5>
              <p class="text-secondary/75">Flera kanaler i HD-kvalitet för skarp bild och fantastisk ljudupplevelse. Levererat via ditt stadsnät för stabil och pålitlig mottagning.</p>
            </div>
          </div>
        </div>

        <!-- Egen Digitalbox Kompatibilitet -->
        <div class="bg-info-light/20 p-4 md:p-6 rounded-xl border-l-4 border-info">
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-4">
              <div class="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-secondary mb-3 text-lg">Har Du Redan en Digitalbox?</h4>
              <p class="text-secondary/80 mb-4 leading-relaxed">Om du redan har en digitalbox hemma kan den vara kompatibel med vår TV-tjänst. Här är vad du behöver veta:</p>
              
              <div class="bg-primary p-4 rounded-lg mb-4">
                <h5 class="font-semibold text-secondary mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Kompatibla Motorola/Arris Modeller
                </h5>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1113</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1003</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1963</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1853</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP2853</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP4302</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-warning-light/30 p-4 rounded-lg border-l-4 border-warning">
                <div class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h6 class="font-semibold text-warning-dark mb-1">Viktigt att Veta</h6>
                    <p class="text-sm text-secondary/75">TV-boxar som använts hos andra operatörer är sannolikt operatörslåsta eller konfigurerade på ett sätt som gör att de inte kan användas med vår tjänst.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center bg-accent/5 p-6 rounded-lg border border-accent/20">
          <h4 class="font-bold text-accent mb-3">Kom Igång Med TV Baspaket Idag</h4>
          <p class="text-secondary/80 mb-4">Få tillgång till <strong>23 populära TV-kanaler</strong> och njut av kvalitets-TV utan krångel. Perfekt för dig som vill ha en komplett TV-upplevelse till ett förmånligt pris.</p>
          <div class="bg-primary p-4 rounded-lg inline-block">
            <div class="text-secondary text-sm">Via ditt stadsnät • Ingen bindningstid • Uppgradera när du vill</div>
          </div>
        </div>
      </div>
    `,
    en: `
      <div class="space-y-6">
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
          <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
            <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
            </svg>
            TV Base Package - Your Complete TV Experience
          </h3>
          <p class="text-secondary/80 leading-relaxed">Enjoy <strong class="text-accent">23 carefully selected TV channels</strong> covering everything from news and sports to children's entertainment and documentaries. Our Base Package offers the <span class="font-semibold">perfect balance between Swedish and international content</span> – all delivered via your city network with crystal-clear digital quality.</p>
        </div>

        <!-- Channel Count Banner -->
        <div class="bg-accent p-4 rounded-lg text-center border-2 border-accent">
          <div class="flex items-center justify-center">
            <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4"></path>
            </svg>
            <h4 class="text-lg font-bold text-primary">23 POPULAR CHANNELS INCLUDED</h4>
          </div>
          <p class="text-sm text-primary/90 mt-1">Everything you need for everyday entertainment • No hidden fees</p>
        </div>

        <!-- Channel Categories Grid -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-success-light/50 p-5 rounded-lg border border-success/20">
            <h4 class="font-semibold text-success-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127480;&#127466;</span>
              Swedish Core Channels
            </h4>
            <div class="text-secondary/75 text-sm space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>SVT1, SVT2, SVT24</strong> - Public service & news</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>TV4, TV4 Fakta</strong> - News & factual</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Kunskapskanalen</strong> - Education & documentaries</span>
              </div>
            </div>
          </div>

          <div class="bg-info-light/50 p-5 rounded-lg border border-info/20">
            <h4 class="font-semibold text-info-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127916;</span>
              Entertainment & Fun
            </h4>
            <div class="text-secondary/75 text-sm space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>TV3 HD, Kanal 5 HD</strong> - Movies & series</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Channels 6-9, TV10-12 HD</strong> - Broad entertainment</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-info flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>MTV</strong> - Music & youth culture</span>
              </div>
            </div>
          </div>

          <div class="bg-warning-light/50 p-5 rounded-lg border border-warning/20">
            <h4 class="font-semibold text-warning-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127942;</span>
              Sports & Documentary
            </h4>
            <div class="text-secondary/75 text-sm space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Viaplay Sport</strong> - Sports channel</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Eurosport HD</strong> - International sports</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Discovery HD, Animal Planet HD</strong> - Nature & science</span>
              </div>
            </div>
          </div>

          <div class="bg-accent/5 p-5 rounded-lg border border-accent/20">
            <h4 class="font-semibold text-accent mb-3 flex items-center">
              <span class="text-xl mr-2">&#128118;</span>
              Kids & International
            </h4>
            <div class="text-secondary/75 text-sm space-y-1">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>SVT Barn/SVT24</strong> - Swedish kids channel</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>Cartoon Network</strong> - Cartoons for all ages</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span><strong>CNN</strong> - International news</span>
              </div>
            </div>
          </div>
        </div>


        <!-- Why Choose This Package -->
        <div class="bg-gradient-to-r from-primary to-secondary/5 p-6 rounded-xl border border-divider">
          <h4 class="font-bold text-secondary mb-4">Why Choose TV Base Package?</h4>
          <div class="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Great Value
              </h5>
              <p class="text-secondary/75">Everything you need for everyday entertainment at a fixed monthly price with no surprises. Perfect balance between content and cost.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
                Easy Upgrades
              </h5>
              <p class="text-secondary/75">Start with the base package and easily add sports, movie, or kids packages whenever you want. Flexible system that grows with your needs.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Perfect for Families
              </h5>
              <p class="text-secondary/75">Something for everyone - news for parents, kids shows for little ones, sports for enthusiasts, and entertainment for the whole family.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                HD Quality
              </h5>
              <p class="text-secondary/75">Multiple channels in HD quality for sharp picture and fantastic sound experience. Delivered via your city network for stable and reliable reception.</p>
            </div>
          </div>
        </div>

        <!-- Own TV Box Compatibility -->
        <div class="bg-info-light/20 p-4 md:p-6 rounded-xl border-l-4 border-info">
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-4">
              <div class="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-secondary mb-3 text-lg">Already Own a Digital Box?</h4>
              <p class="text-secondary/80 mb-4 leading-relaxed">If you already have a digital box at home, it might be compatible with our TV service. Here's what you need to know:</p>
              
              <div class="bg-primary p-4 rounded-lg mb-4">
                <h5 class="font-semibold text-secondary mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Compatible Motorola/Arris Models
                </h5>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1113</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1003</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1963</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1853</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP2853</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP4302</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-warning-light/30 p-4 rounded-lg border-l-4 border-warning">
                <div class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h6 class="font-semibold text-warning-dark mb-1">Important Note</h6>
                    <p class="text-sm text-secondary/75">TV boxes previously used with other operators are likely operator-locked or configured in a way that prevents them from working with our service.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center bg-accent/5 p-6 rounded-lg border border-accent/20">
          <h4 class="font-bold text-accent mb-3">Get Started With TV Base Package Today</h4>
          <p class="text-secondary/80 mb-4">Get access to <strong>23 popular TV channels</strong> and enjoy quality TV without hassle. Perfect for those who want a complete TV experience at a great price.</p>
          <div class="bg-primary p-4 rounded-lg inline-block">
            <div class="text-secondary text-sm">Via your city network • No binding period • Upgrade whenever you want</div>
          </div>
        </div>
      </div>
    `,
  };

  const baspaketPlusDescription = {
    sv: `
      <div class="space-y-6">
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
          <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
            <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            TV Baspaket Plus - Premium TV-Upplevelse för Kännare
          </h3>
          <p class="text-secondary/80 leading-relaxed">Upplev den <strong class="text-accent">kompletta TV-upplevelsen</strong> med alla 23 kanaler från Baspaketet PLUS 4 exklusiva premiumkanaler. Med <span class="font-semibold">utökad sportbevakning, naturdokumentärer i världsklass och internationellt innehåll</span> får du mer underhållning för pengarna än någonsin tidigare.</p>
        </div>

        <!-- Premium Upgrade Banner -->
        <div class="bg-gradient-to-r from-accent/20 to-accent/10 p-4 rounded-lg text-center border-2 border-accent">
          <div class="flex items-center justify-center mb-1">
            <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            <h4 class="text-lg font-bold text-accent">&#10024; PREMIUM UPPGRADERING</h4>
          </div>
          <p class="text-lg font-semibold text-secondary">Baspaket + 4 Exklusiva Premiumkanaler</p>
          <p class="text-sm text-secondary/80 mt-1">Bästa värdet för kräsna TV-tittare • Allt inkluderat</p>
        </div>

        <!-- What's Included Overview -->
        <div class="bg-success-light/30 p-6 rounded-xl border-2 border-success/30">
          <h4 class="font-bold text-success-dark mb-4 flex items-center text-lg">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Vad Ingår i TV Baspaket Plus
          </h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-success-light/50 p-4 rounded-lg">
              <h5 class="font-semibold text-success-dark mb-2">&#9989; Alla 23 Baskanaler</h5>
              <p class="text-secondary/75 text-sm">SVT1, SVT2, SVT24, TV3 HD, TV4, Kanal 5 HD, samt alla övriga från Baspaketet</p>
            </div>
            <div class="bg-success-light/50 p-4 rounded-lg">
              <h5 class="font-semibold text-success-dark mb-2">&#127775; + 4 Premiumkanaler</h5>
              <p class="text-secondary/75 text-sm">National Geographic HD, Eurosport 2 HD, Travel Channel, ATG Live HD</p>
            </div>
          </div>
        </div>

        <!-- Premium Channels Spotlight -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-warning-light/50 p-5 rounded-lg border border-warning/30">
            <h4 class="font-semibold text-warning-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127942;</span>
              Premium Sport
            </h4>
            <div class="text-secondary/75 text-sm space-y-2">
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 text-warning mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>Eurosport 2 HD</strong>
                  <p class="text-xs text-secondary/60">Utökad sportbevakning med olympiska grenar, vintersport och extremsport</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 text-warning mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>ATG Live HD</strong>
                  <p class="text-xs text-secondary/60">Live trav- och galoppränning från svenska och internationella banor</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-info-light/50 p-5 rounded-lg border border-info/30">
            <h4 class="font-semibold text-info-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127758;</span>
              Världsklass Dokumentärer
            </h4>
            <div class="text-secondary/75 text-sm space-y-2">
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>National Geographic HD</strong>
                  <p class="text-xs text-secondary/60">Prisbelönta naturdokumentärer, vetenskap och upptäckter i 4K-kvalitet</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>Travel Channel</strong>
                  <p class="text-xs text-secondary/60">Inspirerande reseprogram, kulinariska äventyr och kulturupptäckter</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Complete Channel Grid -->
        <div class="bg-secondary/5 p-6 rounded-xl">
          <h4 class="font-bold text-secondary mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
            Alla 27 Kanaler Som Ingår i Baspaket Plus
          </h4>
          
          <!-- Base Package Channels -->
          <div class="mb-6">
            <h5 class="font-semibold text-secondary mb-3 text-sm uppercase tracking-wide">Från Baspaketet (23 kanaler)</h5>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">SVT1</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">SVT2</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">SVT24</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">SVT Barn/SVT24</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">TV3 HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">TV4</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">TV4 Fakta</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Kanal 5 HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Kanal 6-12</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">TV10-12 HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Animal Planet HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">CNN</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Cartoon Network</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Discovery HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Eurosport HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Kunskapskanalen</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">MTV</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Viaplay Sport</span>
              </div>
            </div>
          </div>

          <!-- Premium Channels -->
          <div>
            <h5 class="font-semibold text-accent mb-3 text-sm uppercase tracking-wide flex items-center">
              <span class="mr-2">&#10024;</span>
              Premium Tilläggskanaler (4 kanaler)
            </h5>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
                <span class="font-bold text-accent text-xs">National Geographic HD</span>
              </div>
              <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
                <span class="font-bold text-accent text-xs">Eurosport 2 HD</span>
              </div>
              <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
                <span class="font-bold text-accent text-xs">Travel Channel</span>
              </div>
              <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
                <span class="font-bold text-accent text-xs">ATG Live HD</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Value Proposition -->
        <div class="bg-gradient-to-r from-primary to-secondary/5 p-6 rounded-xl border border-divider">
          <h4 class="font-bold text-secondary mb-4">Varför Baspaket Plus är Bästa Valet</h4>
          <div class="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Fantastiskt Värde
              </h5>
              <p class="text-secondary/75">Få 4 premiumkanaler för en bråkdel av vad det kostar att köpa dem separat. Mer underhållning för pengarna.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                Premiuminehåll från Start
              </h5>
              <p class="text-secondary/75">Ingen väntan - få direkt tillgång till världsklass dokumentärer, utökad sport och specialintresse-kanaler.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Något för Hela Familjen
              </h5>
              <p class="text-secondary/75">Från naturfilmer för nyfikna barn till specialsport för entusiaster - alla hittar sina favoritprogram.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Komplett från Dag Ett
              </h5>
              <p class="text-secondary/75">Inget behov av att tänka på vilka kanaler som saknas - du får en komplett och balanserad TV-upplevelse direkt.</p>
            </div>
          </div>
        </div>

        <!-- Comparison Banner -->
        <div class="bg-gradient-to-r from-success/10 to-info/10 p-6 rounded-xl border-2 border-success/20">
          <h4 class="font-bold text-secondary mb-4 text-center">&#128176; Jämför Värdena</h4>
          <div class="grid md:grid-cols-2 gap-6 text-center">
            <div class="bg-primary p-4 rounded-lg">
              <h5 class="font-semibold text-secondary mb-2">Köp Separat</h5>
              <p class="text-secondary/75 text-sm">Baspaket + 4 premiumkanaler individuellt = Betydligt dyrare</p>
            </div>
            <div class="bg-gradient-to-r from-success/20 to-success/10 p-4 rounded-lg border-2 border-success/30">
              <h5 class="font-semibold text-success-dark mb-2">&#10024; Baspaket Plus</h5>
              <p class="text-success-dark text-sm font-semibold">Allt inkluderat till ett förmånligt pris!</p>
            </div>
          </div>
        </div>

        <!-- Egen Digitalbox Kompatibilitet -->
        <div class="bg-info-light/20 p-4 md:p-6 rounded-xl border-l-4 border-info">
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-4">
              <div class="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-secondary mb-3 text-lg">Har Du Redan en Digitalbox?</h4>
              <p class="text-secondary/80 mb-4 leading-relaxed">Om du redan har en digitalbox hemma kan den vara kompatibel med vår premium TV-tjänst. Här är vad du behöver veta:</p>
              
              <div class="bg-primary p-4 rounded-lg mb-4">
                <h5 class="font-semibold text-secondary mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Kompatibla Motorola/Arris Modeller
                </h5>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1113</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1003</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1963</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1853</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP2853</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP4302</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-warning-light/30 p-4 rounded-lg border-l-4 border-warning">
                <div class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h6 class="font-semibold text-warning-dark mb-1">Viktigt att Veta</h6>
                    <p class="text-sm text-secondary/75">TV-boxar som använts hos andra operatörer är sannolikt operatörslåsta eller konfigurerade på ett sätt som gör att de inte kan användas med vår tjänst.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center bg-accent/5 p-6 rounded-lg border border-accent/20">
          <h4 class="font-bold text-accent mb-3">Uppgradera till Premium TV-Upplevelsen Idag</h4>
          <p class="text-secondary/80 mb-4">Få <strong>27 fantastiska kanaler</strong> inklusive 4 exklusiva premiumkanaler och njut av den kompletta TV-upplevelsen. Perfekt för kräsna tittare som vill ha det bästa från start.</p>
          <div class="bg-gradient-to-r from-accent/20 to-accent/10 p-4 rounded-lg inline-block border border-accent/30">
            <div class="text-accent font-bold text-lg">&#127775; Premium Uppgradering</div>
            <div class="text-secondary text-sm">Allt från Baspaket + 4 premiumkanaler • Bästa värdet</div>
          </div>
        </div>
      </div>
    `,
    en: `
      <div class="space-y-6">
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
          <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
            <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            TV Base Package Plus - Premium TV Experience for Connoisseurs
          </h3>
          <p class="text-secondary/80 leading-relaxed">Experience the <strong class="text-accent">complete TV experience</strong> with all 23 channels from the Base Package PLUS 4 exclusive premium channels. With <span class="font-semibold">extended sports coverage, world-class nature documentaries and international content</span>, you get more entertainment for your money than ever before.</p>
        </div>

        <!-- Premium Upgrade Banner -->
        <div class="bg-gradient-to-r from-accent/20 to-accent/10 p-4 rounded-lg text-center border-2 border-accent">
          <div class="flex items-center justify-center mb-1">
            <svg class="w-6 h-6 mr-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            <h4 class="text-lg font-bold text-accent">&#10024; PREMIUM UPGRADE</h4>
          </div>
          <p class="text-lg font-semibold text-secondary">Base Package + 4 Exclusive Premium Channels</p>
          <p class="text-sm text-secondary/80 mt-1">Best value for discerning TV viewers • Everything included</p>
        </div>

        <!-- What's Included Overview -->
        <div class="bg-success-light/30 p-6 rounded-xl border-2 border-success/30">
          <h4 class="font-bold text-success-dark mb-4 flex items-center text-lg">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            What's Included in TV Base Package Plus
          </h4>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-success-light/50 p-4 rounded-lg">
              <h5 class="font-semibold text-success-dark mb-2">&#9989; All 23 Base Channels</h5>
              <p class="text-secondary/75 text-sm">SVT1, SVT2, SVT24, TV3 HD, TV4, Channel 5 HD, plus all others from Base Package</p>
            </div>
            <div class="bg-success-light/50 p-4 rounded-lg">
              <h5 class="font-semibold text-success-dark mb-2">&#127775; + 4 Premium Channels</h5>
              <p class="text-secondary/75 text-sm">National Geographic HD, Eurosport 2 HD, Travel Channel, ATG Live HD</p>
            </div>
          </div>
        </div>

        <!-- Premium Channels Spotlight -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-warning-light/50 p-5 rounded-lg border border-warning/30">
            <h4 class="font-semibold text-warning-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127942;</span>
              Premium Sports
            </h4>
            <div class="text-secondary/75 text-sm space-y-2">
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 text-warning mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>Eurosport 2 HD</strong>
                  <p class="text-xs text-secondary/60">Extended sports coverage with Olympic sports, winter sports and extreme sports</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 text-warning mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>ATG Live HD</strong>
                  <p class="text-xs text-secondary/60">Live harness and gallop racing from Swedish and international tracks</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-info-light/50 p-5 rounded-lg border border-info/30">
            <h4 class="font-semibold text-info-dark mb-3 flex items-center">
              <span class="text-xl mr-2">&#127758;</span>
              World-Class Documentaries
            </h4>
            <div class="text-secondary/75 text-sm space-y-2">
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>National Geographic HD</strong>
                  <p class="text-xs text-secondary/60">Award-winning nature documentaries, science and discoveries in 4K quality</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg class="w-4 h-4 mr-2 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <strong>Travel Channel</strong>
                  <p class="text-xs text-secondary/60">Inspiring travel shows, culinary adventures and cultural discoveries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Complete Channel Grid -->
        <div class="bg-secondary/5 p-6 rounded-xl">
          <h4 class="font-bold text-secondary mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
            All 27 Channels Included in Base Package Plus
          </h4>
          
          <!-- Base Package Channels -->
          <div class="mb-6">
            <h5 class="font-semibold text-secondary mb-3 text-sm uppercase tracking-wide">From Base Package (23 channels)</h5>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">SVT1</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">SVT2</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">SVT24</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">SVT Barn/SVT24</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">TV3 HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">TV4</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">TV4 Fakta</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Channel 5 HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Channels 6-12</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">TV10-12 HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Animal Planet HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">CNN</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Cartoon Network</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Discovery HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Eurosport HD</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Kunskapskanalen</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">MTV</span>
              </div>
              <div class="bg-primary p-2 rounded border border-divider">
                <span class="font-medium text-secondary text-xs">Viaplay Sport</span>
              </div>
            </div>
          </div>

          <!-- Premium Channels -->
          <div>
            <h5 class="font-semibold text-accent mb-3 text-sm uppercase tracking-wide flex items-center">
              <span class="mr-2">&#10024;</span>
              Premium Add-On Channels (4 channels)
            </h5>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
                <span class="font-bold text-accent text-xs">National Geographic HD</span>
              </div>
              <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
                <span class="font-bold text-accent text-xs">Eurosport 2 HD</span>
              </div>
              <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
                <span class="font-bold text-accent text-xs">Travel Channel</span>
              </div>
              <div class="bg-gradient-to-r from-accent/10 to-accent/5 p-3 rounded-lg border-2 border-accent/30">
                <span class="font-bold text-accent text-xs">ATG Live HD</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Value Proposition -->
        <div class="bg-gradient-to-r from-primary to-secondary/5 p-6 rounded-xl border border-divider">
          <h4 class="font-bold text-secondary mb-4">Why Base Package Plus is the Best Choice</h4>
          <div class="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Fantastic Value
              </h5>
              <p class="text-secondary/75">Get 4 premium channels for a fraction of what it costs to buy them separately. More entertainment for your money.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                Premium Content From Start
              </h5>
              <p class="text-secondary/75">No waiting - get instant access to world-class documentaries, extended sports and specialty channels.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Something for the Whole Family
              </h5>
              <p class="text-secondary/75">From nature films for curious children to specialty sports for enthusiasts - everyone finds their favorite programs.</p>
            </div>
            <div>
              <h5 class="font-semibold text-secondary mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Complete From Day One
              </h5>
              <p class="text-secondary/75">No need to think about missing channels - you get a complete and balanced TV experience right away.</p>
            </div>
          </div>
        </div>

        <!-- Comparison Banner -->
        <div class="bg-gradient-to-r from-success/10 to-info/10 p-6 rounded-xl border-2 border-success/20">
          <h4 class="font-bold text-secondary mb-4 text-center">&#128176; Compare Values</h4>
          <div class="grid md:grid-cols-2 gap-6 text-center">
            <div class="bg-primary p-4 rounded-lg">
              <h5 class="font-semibold text-secondary mb-2">Buy Separately</h5>
              <p class="text-secondary/75 text-sm">Base Package + 4 premium channels individually = Much more expensive</p>
            </div>
            <div class="bg-gradient-to-r from-success/20 to-success/10 p-4 rounded-lg border-2 border-success/30">
              <h5 class="font-semibold text-success-dark mb-2">&#10024; Base Package Plus</h5>
              <p class="text-success-dark text-sm font-semibold">Everything included at a great price!</p>
            </div>
          </div>
        </div>

        <!-- Own TV Box Compatibility -->
        <div class="bg-info-light/20 p-4 md:p-6 rounded-xl border-l-4 border-info">
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-4">
              <div class="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-secondary mb-3 text-lg">Already Own a Digital Box?</h4>
              <p class="text-secondary/80 mb-4 leading-relaxed">If you already have a digital box at home, it might be compatible with our premium TV service. Here's what you need to know:</p>
              
              <div class="bg-primary p-4 rounded-lg mb-4">
                <h5 class="font-semibold text-secondary mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Compatible Motorola/Arris Models
                </h5>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1113</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1003</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1963</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP1853</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP2853</span>
                  </div>
                  <div class="bg-success-light/30 p-2 rounded text-center border border-success/30">
                    <span class="font-mono text-sm font-semibold text-success-dark">VIP4302</span>
                  </div>
                </div>
              </div>
              
              <div class="bg-warning-light/30 p-4 rounded-lg border-l-4 border-warning">
                <div class="flex items-start">
                  <svg class="w-5 h-5 mr-2 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h6 class="font-semibold text-warning-dark mb-1">Important Note</h6>
                    <p class="text-sm text-secondary/75">TV boxes previously used with other operators are likely operator-locked or configured in a way that prevents them from working with our service.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center bg-accent/5 p-6 rounded-lg border border-accent/20">
          <h4 class="font-bold text-accent mb-3">Upgrade to the Premium TV Experience Today</h4>
          <p class="text-secondary/80 mb-4">Get <strong>27 fantastic channels</strong> including 4 exclusive premium channels and enjoy the complete TV experience. Perfect for discerning viewers who want the best from the start.</p>
          <div class="bg-gradient-to-r from-accent/20 to-accent/10 p-4 rounded-lg inline-block border border-accent/30">
            <div class="text-accent font-bold text-lg">&#127775; Premium Upgrade</div>
            <div class="text-secondary text-sm">Everything from Base Package + 4 premium channels • Best value</div>
          </div>
        </div>
      </div>
    `,
  };

  // Return legacy descriptions as fallback
  return isBaspaketPlus ? baspaketPlusDescription[locale] : baspaketDescription[locale];
};

export default function UnifiedProductPageController({
  productSlugWithId,
  categorySlug,
  locale = 'sv',
}) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentLocale = useLocale() || locale;
  const t = useTranslations('productPage');
  const tImages = useTranslations('productImages');
  const tDescription = useTranslations(); // For product descriptions
  const tTelephony = useTranslations('telephony');
  const tCategories = useTranslations('categoriesPage.categories');
  const { addToCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  // Determine strategy type
  const strategyType = determineProductStrategy(categorySlug, productSlugWithId);

  // For broadband services, extract address ID and use broadband data hook
  const addressId =
    strategyType === 'broadband-service' ? extractProductIdFromSlug(productSlugWithId) : null;

  const broadbandData = useBroadbandData(strategyType === 'broadband-service' ? addressId : null);

  useEffect(() => {
    async function fetchProductData() {
      try {
        setIsLoading(true);
        setError(null);

        // Handle broadband service strategy (address-based)
        if (strategyType === 'broadband-service') {
          // For broadband services, we use the mock product data with locale-specific description
          // The actual service data comes from the broadband hook
          // SEO redirect logic is handled in a separate useEffect
          setProduct(
            createMockBroadbandProduct(currentLocale, t, tDescription, tImages, tCategories)
          );
          setIsLoading(false);
          return;
        }

        if (strategyType === 'tv-service') {
          // For TV services, create a mock product based on the URL slug
          // The actual product selection happens in TvServiceProductStrategy based on stadsnät
          const serviceType =
            productSlugWithId.includes('baspaket-plus') || productSlugWithId.includes('plus')
              ? 'baspaket-plus'
              : 'baspaket';
          const mockTvProduct = {
            id: 'tv-service', // Not a real product ID
            name:
              serviceType === 'baspaket-plus'
                ? currentLocale === 'sv'
                  ? 'TV Baspaket Plus'
                  : 'TV Base Package Plus'
                : currentLocale === 'sv'
                ? 'TV Baspaket'
                : 'TV Base Package',
            description: getTvServiceDescription(
              serviceType === 'baspaket-plus',
              currentLocale,
              tDescription
            ),
            category: categoryNames[categorySlug],
            category_name: categoryNames[categorySlug],
            categorySlug: categorySlug,
            m_price: '0', // Will be updated when stadsnät is selected
            images:
              serviceType === 'baspaket-plus'
                ? [
                    {
                      src: 'https://internetportcom.b-cdn.net/se/img/fotboll-pa-tv-fjarrkontroll-sportkanaler-hemma.jpg',
                      alt: tImages('tvPlus.footballSports'),
                    },
                    {
                      src: 'https://internetportcom.b-cdn.net/se/img/fjarrkontroll-smart-tv-vardagsrum-modern-underhallning.jpg',
                      alt: tImages('tvPlus.smartTvModern'),
                    },
                    {
                      src: 'https://internetportcom.b-cdn.net/se/img/barn-tittar-pa-barnprogram-tv-vardagsrum.jpg',
                      alt: tImages('tvPlus.kidsPrograms'),
                    },
                  ]
                : [
                    {
                      src: 'https://internetportcom.b-cdn.net/se/img/tva-personer-tittar-pa-tv-hemma-vardagsrum.jpg',
                      alt: tImages('tv.livingRoom'),
                    },
                    {
                      src: 'https://internetportcom.b-cdn.net/se/img/smart-tv-streaming-appar-netflix-youtube-hemunderhallning.jpg',
                      alt: tImages('tv.smartTv'),
                    },
                    {
                      src: 'https://internetportcom.b-cdn.net/se/img/familj-tittar-pa-film-med-popcorn-myskvall.jpg',
                      alt: tImages('tv.familyMovie'),
                    },
                  ],
            bullets: [],
            hasRealContent: true,
          };

          setProduct(mockTvProduct);
          setIsLoading(false);
          return;
        }

        if (strategyType === 'telephony') {
          // For telephony services, create a mock product for the service page
          // The actual product selection happens in TelephonyServiceProductStrategy based on user choices
          const mockTelephonyProduct = {
            id: 'telephony-service', // Not a real product ID
            name: currentLocale === 'sv' ? 'IP-Telefoni' : 'IP Telephony',
            description: '', // Empty - will be replaced by React component
            category: categoryNames[categorySlug],
            category_name: categoryNames[categorySlug],
            categorySlug: categorySlug,
            m_price: '0', // Will be updated when service type is selected
            images: [
              {
                src: 'https://internetportcom.b-cdn.net/se/img/ip-telefoni-kvinna-talar-utomhus-strand.jpg',
                alt: tTelephony('image_woman_outdoor_beach_alt'),
              },
              {
                src: 'https://internetportcom.b-cdn.net/se/img/ip-telefoni-man-talar-telefon-solglasogon.jpg',
                alt: tTelephony('image_man_sunglasses_phone_alt'),
              },
              {
                src: 'https://internetportcom.b-cdn.net/se/img/kvinna-haller-mobil-dekorativ-ring.jpg',
                alt: tTelephony('image_woman_mobile_ring_alt'),
              },
            ],
            bullets: [],
            hasRealContent: true,
          };

          setProduct(mockTelephonyProduct);
          setIsLoading(false);
          return;
        }

        // Handle TV product ID redirects before processing standard products
        if (categorySlug === 'tv') {
          const parts = productSlugWithId.split('-');
          const productId = parseInt(parts.pop());

          // Import TV config functions dynamically to avoid import issues
          const { getAllTvServiceProductIds, getServiceTypeFromProductId } = await import(
            '@/config/tvProducts'
          );
          const tvServiceProductIds = getAllTvServiceProductIds();

          if (tvServiceProductIds.includes(productId)) {
            // Determine service type based on product ID
            const serviceType = getServiceTypeFromProductId(productId);
            const serviceSlug =
              serviceType === 'baspaket-plus' ? 'tv-baspaket-plus' : 'tv-baspaket';

            // Redirect to clean service URL
            const cleanUrl = `/kategori/${categorySlug}/${serviceSlug}`;
            router.replace(cleanUrl);
            return; // Stop execution after redirect
          }
        }

        // Handle standard products (including router hardware and TV boxes)
        const parts = productSlugWithId.split('-');
        const productId = parts.pop();
        const slugFromUrl = parts.join('-');

        if (!productId || isNaN(parseInt(productId))) {
          throw new Error('Invalid product identifier in URL');
        }

        // Fetch product data from API with language support
        const languageId = locale === 'sv' ? 9 : 2;
        const response = await fetch(
          `/api/hostbill/get-product?id=${productId}&language_id=${languageId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }

        const productData = await response.json();
        if (!productData || !productData.product) {
          throw new Error('Product not found');
        }

        // Generate canonical slug and redirect if necessary
        const canonicalSlug = generateSlug(productData.product.name);
        if (slugFromUrl !== canonicalSlug) {
          const canonicalUrl = `/kategori/${categorySlug}/${canonicalSlug}-${productData.product.id}`;
          router.replace(canonicalUrl);
          return; // Stop execution after redirect
        }

        // The category validation logic has been simplified to handle two special cases:
        // 1. Broadband Routers: These appear under the 'bredband' category but have a different backend group ID.
        //    We identify them by the 'standard' strategy type within the 'bredband' category and skip the check.
        // 2. Säkerhet Category: This is a broad frontend category. We trust the URL and do not validate the group ID.
        const isBroadbandRouter = categorySlug === 'bredband' && strategyType === 'standard';
        const isSakerhetCategory = categorySlug === 'sakerhet';

        // Check if this is a telephony hardware product
        const currentProductId = parseInt(productData.product.id);
        const isTelephonyHardwareProduct = isTelephonyHardware(currentProductId);

        if (!isBroadbandRouter && !isSakerhetCategory && !isTelephonyHardwareProduct) {
          const expectedCategoryId = categoryIds[categorySlug];
          // Extract category ID from categorySlug (format: "category-21") or use gid field
          let actualCategoryId = parseInt(productData.product.gid);
          if (!actualCategoryId && productData.product.categorySlug) {
            const categoryMatch = productData.product.categorySlug.match(/category-(\d+)/);
            actualCategoryId = categoryMatch ? parseInt(categoryMatch[1]) : null;
          }

          if (!expectedCategoryId || actualCategoryId !== expectedCategoryId) {
            throw new Error(
              `Product category mismatch: expected ${expectedCategoryId}, got ${actualCategoryId} for product ${productData.product.id}`
            );
          }
        }

        // For telephony hardware products, ensure they're being accessed from the telefoni category
        if (isTelephonyHardwareProduct && categorySlug !== 'telefoni') {
          throw new Error(
            `Telephony hardware product ${currentProductId} must be accessed from the telefoni category`
          );
        }

        // Enrich product with category information while preserving all original fields
        const enrichedProduct = {
          ...productData.product,
          category: categoryNames[categorySlug],
          category_name: categoryNames[categorySlug],
          categorySlug: categorySlug,
        };

        // For TV services, add appropriate description based on product type
        if (strategyType === 'tv-service') {
          const isBaspaketPlus =
            enrichedProduct.name?.toLowerCase().includes('baspaket+') ||
            enrichedProduct.name?.toLowerCase().includes('plus');
          enrichedProduct.description = getTvServiceDescription(
            isBaspaketPlus,
            currentLocale,
            tDescription
          );
        }

        setProduct(enrichedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductData();
  }, [productSlugWithId, categorySlug, strategyType, currentLocale]);

  // Separate effect for broadband service SEO redirects
  useEffect(() => {
    if (
      strategyType === 'broadband-service' &&
      broadbandData.installationAddress &&
      !broadbandData.isLoading &&
      !broadbandData.error
    ) {
      const parts = productSlugWithId.split('-');
      const addressId = parts.pop();
      const slugFromUrl = parts.join('-');

      const address = broadbandData.installationAddress;

      // Generate SEO-friendly slug from complete address information
      const fullAddress = [
        address.streetName && address.streetNumber
          ? `${address.streetName} ${address.streetNumber}`
          : address.street || address.address,
        address.mduApartmentNumber
          ? `LGH ${address.mduApartmentNumber}`
          : address.apartment || address.lgh,
        address.postalCode || address.zipCode,
        address.city,
      ]
        .filter(Boolean)
        .join(' ');

      const addressSlug = generateSlug(fullAddress || 'address');

      // Redirect to SEO-friendly URL if current slug doesn't match
      if (
        slugFromUrl &&
        slugFromUrl !== addressSlug &&
        addressSlug !== 'address' &&
        addressSlug.length > 3
      ) {
        const canonicalUrl = `/kategori/${categorySlug}/${addressSlug}-${addressId}`;
        router.replace(canonicalUrl);
      }
    }
  }, [
    broadbandData.installationAddress,
    broadbandData.isLoading,
    broadbandData.error,
    strategyType,
    productSlugWithId,
    locale,
    categorySlug,
    router,
  ]);

  // Handle loading state
  if (isLoading || (strategyType === 'broadband-service' && broadbandData.isLoading)) {
    return <PageSkeleton variant="product" />;
  }

  // Handle error state
  if (error || (strategyType === 'broadband-service' && broadbandData.error)) {
    const displayError = error || broadbandData.error;
    return (
      <div className="bg-primary py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-4">{t('errorTitle')}</h1>
            <p className="text-secondary/70">{displayError}</p>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we have product data
  if (!product) {
    return (
      <div className="bg-primary py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-4">{t('errorTitle')}</h1>
            <p className="text-secondary/70">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle add to cart functionality
  const handleAddToCart = async (productId, options = {}) => {
    try {
      // For standard products, use the centralized pricing logic
      if (strategyType === 'standard') {
        const cartPricing = getCartPricingData(product);

        const cartItem = {
          id: product.id,
          name: product.name,
          category: categoryNames[categorySlug] || 'Product',
          categoryId: parseInt(product.category_id || product.gid) || categoryIds[categorySlug],
          price: cartPricing.price,
          setupPrice: cartPricing.setupPrice,
          quantity: options.quantity || 1,
          productUrl: pathname || `/kategori/${categorySlug}/${product.id}`,
          ...options,
        };

        addToCart(cartItem);
      } else {
        // For other strategies, pass through the options
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error; // Re-throw to let the button handle the error state
    }
  };

  // Prepare props for ProductPageClient
  const clientProps = {
    product,
    strategyType,
    onAdd: handleAddToCart,
    productSlugWithId,
    currentUrl: pathname,
  };

  // Add broadband-specific props if needed
  if (strategyType === 'broadband-service') {
    Object.assign(clientProps, {
      servicesPrivate: broadbandData.servicesPrivate,
      servicesCompany: broadbandData.servicesCompany,
      installationAddress: broadbandData.installationAddress,
    });
  }

  // Add telephony-specific props if needed
  if (strategyType === 'telephony') {
    Object.assign(clientProps, {
      descriptionComponent: (
        <Suspense
          fallback={
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-secondary/10 rounded w-3/4"></div>
              <div className="h-4 bg-secondary/10 rounded"></div>
              <div className="h-4 bg-secondary/10 rounded w-1/2"></div>
            </div>
          }
        >
          <TelephonyProductDescription />
        </Suspense>
      ),
    });
  }

  return (
    <ProductErrorBoundary context="product-page">
      <ProductPageClient {...clientProps} />
    </ProductErrorBoundary>
  );
}
