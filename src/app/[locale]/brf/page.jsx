'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import {
  HeartIcon,
  UsersIcon,
  SparklesIcon,
  ShieldCheckIcon,
  WifiIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  TvIcon,
} from '@heroicons/react/24/solid';

import BrfHeroSection from '@/sections/brf-page/BrfHeroSection';
import BrfIntroAndBenefitsSection from '@/sections/brf-page/BrfIntroAndBenefitsSection';
import BrfServicesAndProofSection from '@/sections/brf-page/BrfServicesAndProofSection';
import BrfFinalCtaSection from '@/sections/brf-page/BrfFinalCtaSection';

export default function BrfPage() {
  const t = useTranslations('brfPage');

  useEffect(() => {
    const handleChatWidgetClick = (e) => {
      if (e.target.closest('a[href="#support-widget"]')) {
        e.preventDefault();
        const supportFab = document.getElementById('support-fab');
        if (supportFab) supportFab.click();
      }
    };
    document.addEventListener('click', handleChatWidgetClick);
    return () => document.removeEventListener('click', handleChatWidgetClick);
  }, []);

  const cdnBaseUrl = 'https://internetportcom.b-cdn.net/se/img/';

  // Shared data element, potentially used across multiple sections.
  const priceTaglineData = {
    prefix: t('shared.priceTagline.prefix'),
    price: t('shared.priceTagline.price'),
    suffix: t('shared.priceTagline.suffix'),
  };

  const heroData = {
    titlePart1: t('hero.titlePart1'),
    titlePart2: t('hero.titlePart2'),
    subtitle: t('hero.subtitle'),
    image: {
      src: `${cdnBaseUrl}brf-vy.webp`,
      alt: t('hero.imageAlt'),
    },
  };

  const primaryFeatureData = {
    name: t('introAndBenefits.primaryFeature.name'),
    descriptionParts: {
      beforePrice: t('introAndBenefits.primaryFeature.descriptionBeforePrice'),
      afterPrice: t('introAndBenefits.primaryFeature.descriptionAfterPrice'),
    },
    icon: HeartIcon,
    image: {
      src: `${cdnBaseUrl}lagenhetshus.webp`,
      alt: t('introAndBenefits.primaryFeature.imageAlt'),
      intrinsicWidth: 1920,
      intrinsicHeight: 1080,
    },
  };

  const secondaryFeatureData = {
    name: t('introAndBenefits.secondaryFeature.name'),
    description: t('introAndBenefits.secondaryFeature.description'),
    icon: UsersIcon,
    image: {
      src: `${cdnBaseUrl}kundtjanst-pratar.webp`,
      alt: t('introAndBenefits.secondaryFeature.imageAlt'),
      intrinsicWidth: 1920,
      intrinsicHeight: 1441,
    },
  };

  const tvFeatureData = {
    name: t('tv.title'),
    priceTagline: t('tv.priceTagline'),
    description: t('tv.description'),
    features: t.raw('tv.features'),
    disclaimer: t('tv.disclaimer'),
    icon: TvIcon,
    image: {
      src: `${cdnBaseUrl}brf-tv.webp`,
      alt: t('tv.imageAlt'),
      intrinsicWidth: 1920,
      intrinsicHeight: 1080,
    },
  };

  const statsSectionImageData = {
    image: {
      src: `${cdnBaseUrl}server-rack.webp`,
      alt: t('servicesAndProof.statsImageAlt'),
      intrinsicWidth: 1920,
      intrinsicHeight: 1441,
    },
  };

  const baseServiceFeatures = [
    { id: 'speed', icon: SparklesIcon },
    { id: 'network', icon: ShieldCheckIcon },
    { id: 'wifi', icon: WifiIcon },
    { id: 'support', icon: UsersIcon },
  ];

  const serviceFeaturesData = baseServiceFeatures.map((feature, index) => ({
    icon: feature.icon,
    name: t(`servicesAndProof.serviceFeatures.${index}.name`),
    description: t(`servicesAndProof.serviceFeatures.${index}.description`),
  }));

  const baseStats = [
    { id: 1, key: 'speed' },
    { id: 2, key: 'reliability' },
    { id: 3, key: 'clients' },
    { id: 4, key: 'monitoring' },
  ];

  const statsData = baseStats.map((stat, index) => ({
    id: stat.id,
    stat: t(`servicesAndProof.statsItems.${index}.stat`),
    emphasis: t(`servicesAndProof.statsItems.${index}.emphasis`),
    rest: t(`servicesAndProof.statsItems.${index}.rest`),
  }));

  const finalCtaData = {
    title: t('finalCta.title'),
    subtitle: t('finalCta.subtitle'),
    contactMethods: [
      {
        name: t('finalCta.contactMethods.0.name'),
        value: t('finalCta.contactMethods.0.value'),
        description: t('finalCta.contactMethods.0.description'),
        href: 'tel:0650402000',
        icon: PhoneIcon,
      },
      {
        name: t('finalCta.contactMethods.1.name'),
        value: t('finalCta.contactMethods.1.value'),
        description: t('finalCta.contactMethods.1.description'),
        href: '#support-widget',
        icon: ChatBubbleLeftRightIcon,
      },
      {
        name: t('finalCta.contactMethods.2.name'),
        value: t('finalCta.contactMethods.2.value'),
        description: t('finalCta.contactMethods.2.description'),
        href: 'mailto:support@internetport.se',
        icon: EnvelopeIcon,
      },
    ],
  };

  return (
    <div className="bg-primary text-secondary">
      <main>
        <BrfHeroSection heroData={heroData} priceTagline={priceTaglineData} />
        <BrfIntroAndBenefitsSection
          primaryFeatureData={primaryFeatureData}
          secondaryFeatureData={secondaryFeatureData}
          tvFeatureData={tvFeatureData}
          priceTagline={priceTaglineData}
        />
        <BrfServicesAndProofSection
          serviceFeaturesData={serviceFeaturesData}
          statsData={statsData}
          servicesTitle={t('servicesAndProof.servicesTitle')}
          servicesSubtitle={t('servicesAndProof.servicesSubtitle')}
          statsCatchyTitle={t('servicesAndProof.statsCatchyTitle')}
          statsTitle={t('servicesAndProof.statsTitle')}
          statsDescription={t('servicesAndProof.statsDescription')}
          statsImage={statsSectionImageData.image}
        />
        <BrfFinalCtaSection ctaData={finalCtaData} priceTagline={priceTaglineData} />
      </main>
    </div>
  );
}
