'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductLayout from '@/components/products/ProductLayout';
import BroadbandProductStrategy from '@/components/products/strategies/BroadbandProductStrategy';
import { useBroadbandData } from '@/hooks/useBroadbandData';

// Broadband service description with rich HTML styling
const broadbandDescriptions = {
  en: `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
        <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
          <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Lightning-Fast Fiber Broadband
        </h3>
        <p class="text-secondary/80 leading-relaxed">Experience the power of <strong class="text-accent">true fiber connectivity</strong> with speeds from <span class="font-semibold">100 Mbps to 1000 Mbps</span>. Perfect for streaming 4K content, gaming, video calls, and powering your smart home – all without lag or interruption.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-success-light/50 p-5 rounded-lg border border-success/20">
          <h4 class="font-semibold text-success-dark mb-2 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            No Binding Contracts
          </h4>
          <p class="text-secondary/75 text-sm">Complete flexibility with no long-term commitments. Upgrade, downgrade, or cancel anytime to match your changing needs.</p>
        </div>

        <div class="bg-info-light/50 p-5 rounded-lg border border-info/20">
          <h4 class="font-semibold text-info-dark mb-2 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            Transparent Pricing
          </h4>
          <p class="text-secondary/75 text-sm">No hidden fees or surprise charges. What you see is what you pay, with special campaign pricing available for new customers.</p>
        </div>
      </div>

      <div class="bg-secondary/5 p-6 rounded-xl">
        <h4 class="font-bold text-secondary mb-4">Perfect for Every Lifestyle</h4>
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">🏠</div>
            <strong class="block text-secondary mb-1">Home Users</strong>
            <span class="text-secondary/70">Streaming, browsing, smart devices</span>
          </div>
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">💼</div>
            <strong class="block text-secondary mb-1">Remote Workers</strong>
            <span class="text-secondary/70">Video calls, file sharing, productivity</span>
          </div>
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">🎮</div>
            <strong class="block text-secondary mb-1">Gamers & Creators</strong>
            <span class="text-secondary/70">Low latency gaming, 4K streaming</span>
          </div>
        </div>
      </div>

      <div class="text-center bg-accent/5 p-4 rounded-lg border border-accent/20">
        <p class="text-secondary/80"><strong class="text-accent">Ready to upgrade your internet experience?</strong> Enter your address above to see available speeds and pricing tailored to your location.</p>
      </div>
    </div>
  `,
  sv: `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-accent/5 to-secondary/5 p-6 rounded-xl border-l-4 border-accent">
        <h3 class="text-xl font-bold text-secondary mb-3 flex items-center">
          <svg class="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Blixtsnabbt Fiberbredband
        </h3>
        <p class="text-secondary/80 leading-relaxed">Upplev kraften av <strong class="text-accent">äkta fiberanslutning</strong> med hastigheter från <span class="font-semibold">100 Mbps till 1000 Mbps</span>. Perfekt för 4K-streaming, gaming, videosamtal och smarta hem-enheter – allt utan fördröjning eller avbrott.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-success-light/50 p-5 rounded-lg border border-success/20">
          <h4 class="font-semibold text-success-dark mb-2 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Ingen Bindningstid
          </h4>
          <p class="text-secondary/75 text-sm">Total flexibilitet utan långa avtal. Uppgradera, nedgradera eller säg upp när som helst för att matcha dina behov.</p>
        </div>

        <div class="bg-info-light/50 p-5 rounded-lg border border-info/20">
          <h4 class="font-semibold text-info-dark mb-2 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            Transparent Prissättning
          </h4>
          <p class="text-secondary/75 text-sm">Inga dolda avgifter eller överraskningar. Vad du ser är vad du betalar, med särskilda kampanjpriser för nya kunder.</p>
        </div>
      </div>

      <div class="bg-secondary/5 p-6 rounded-xl">
        <h4 class="font-bold text-secondary mb-4">Perfekt för Varje Livsstil</h4>
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">🏠</div>
            <strong class="block text-secondary mb-1">Hemanvändare</strong>
            <span class="text-secondary/70">Streaming, surfning, smarta enheter</span>
          </div>
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">💼</div>
            <strong class="block text-secondary mb-1">Distansarbetare</strong>
            <span class="text-secondary/70">Videosamtal, fildelning, produktivitet</span>
          </div>
          <div class="text-center p-4 bg-primary rounded-lg border border-divider">
            <div class="text-2xl mb-2">🎮</div>
            <strong class="block text-secondary mb-1">Spelare & Skapare</strong>
            <span class="text-secondary/70">Låg latens gaming, 4K-streaming</span>
          </div>
        </div>
      </div>

      <div class="text-center bg-accent/5 p-4 rounded-lg border border-accent/20">
        <p class="text-secondary/80"><strong class="text-accent">Redo att uppgradera din internetupplevelse?</strong> Ange din adress ovan för att se tillgängliga hastigheter och priser anpassade för din plats.</p>
      </div>
    </div>
  `
};

// Mock product object for broadband services
const mockBroadbandProduct = {
  name: 'Bredband',
  images: [
    {
      id: 1,
      src: '/images/broadband-default.jpg',
      alt: 'Bredband service',
    }
  ]
};

export default function BroadbandProductPage({ productSlugWithId }) {
  const parts = productSlugWithId.split('-');
  const addressId = parts.pop();
  const locale = useLocale();
  const t = useTranslations('productPage');
  
  const { isLoading, error, installationAddress, servicesPrivate, servicesCompany } = useBroadbandData(addressId);
  
  // Get the appropriate description based on locale
  const currentDescription = broadbandDescriptions[locale] || broadbandDescriptions.en;

  if (isLoading) {
    return (
      <div className="bg-primary py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-secondary mb-4">{t('loadingTitle')}</h1>
            <p className="text-secondary/70">{t('loadingText')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-4">{t('errorTitle')}</h1>
            <p className="text-secondary/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProductLayout product={mockBroadbandProduct} description={currentDescription}>
      <BroadbandProductStrategy 
        servicesPrivate={servicesPrivate} 
        servicesCompany={servicesCompany} 
        installationAddress={installationAddress} 
        product={mockBroadbandProduct} 
      />
    </ProductLayout>
  );
}
