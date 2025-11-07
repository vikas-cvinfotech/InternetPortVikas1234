'use client';

import { useTranslations } from 'next-intl';
import VpnHeroSection from '@/sections/vpn-page/VpnHeroSection';
import VpnExplainerSection from '@/sections/vpn-page/VpnExplainerSection';
import VpnFaqSection from '@/sections/vpn-page/VpnFaqSection';

export default function VpnPage() {
  const t = useTranslations('vpnPage');
  const handleHeroCtaClick = () => {
    const ctaSection = document.querySelector('#cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroData = {
    subtitle: t('hero.subtitle'),
    description: t('hero.description'),
    ctaText: t('hero.ctaText'),
    videoId: t('hero.videoId'),
  };

  const explainerData = {
    title: t('explainer.title'),
    subtitle: t('explainer.subtitle'),
    features: [
      {
        name: t('explainer.features.0.name'),
        description: t('explainer.features.0.description'),
      },
      {
        name: t('explainer.features.1.name'),
        description: t('explainer.features.1.description'),
      },
      {
        name: t('explainer.features.2.name'),
        description: t('explainer.features.2.description'),
      },
      {
        name: t('explainer.features.3.name'),
        description: t('explainer.features.3.description'),
      },
    ],
    whyVpn: {
      title: t('explainer.whyVpn.title'),
      description: t('explainer.whyVpn.description'),
      benefits: [
        t('explainer.whyVpn.benefits.0'),
        t('explainer.whyVpn.benefits.1'),
        t('explainer.whyVpn.benefits.2'),
      ],
    },
  };

  const faqData = {
    title: t('faq.title'),
    subtitle: t('faq.subtitle'),
    faqs: Array.from({ length: 7 }, (_, i) => ({
      question: t(`faq.faqs.${i}.question`),
      answer: t(`faq.faqs.${i}.answer`),
    })),
  };

  return (
    <div className="bg-primary text-secondary">
      <main>
        <VpnHeroSection
          subtitle={heroData.subtitle}
          description={heroData.description}
          ctaText={heroData.ctaText}
          videoId={heroData.videoId}
          onCtaClick={handleHeroCtaClick}
        />

        <VpnExplainerSection
          title={explainerData.title}
          subtitle={explainerData.subtitle}
          features={explainerData.features}
          whyVpn={explainerData.whyVpn}
        />

        <div id="faq-section">
          <VpnFaqSection title={faqData.title} subtitle={faqData.subtitle} faqs={faqData.faqs} />
        </div>

        <div id="cta-section">
          <section
            className="relative py-24 px-4 text-center text-primary bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://internetportcom.b-cdn.net/se/img/nordvpn-mobil.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-secondary/70" aria-hidden="true"></div>
            <div className="relative max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('finalCta.title')}
              </h2>
              <p className="mt-4 text-lg text-primary/90">{t('finalCta.subtitle')}</p>
              <a
                href="/kategori/sakerhet"
                className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
              >
                {t('finalCta.cta')}
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
