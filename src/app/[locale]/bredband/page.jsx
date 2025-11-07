'use client';

import { useState } from 'react';
import { ChevronDownIcon, GlobeAltIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

// --- Custom Headset Icon Component (Updated) ---
function HeadsetIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 361 361" {...props}>
      <path
        fill="currentColor"
        d="M331.035,126.94H318.01c-3.563,0-3.682-2.333-3.805-3.494C307.375,59.094,252.77,8.791,186.637,8.791h-12.26    c-65.644,0-119.929,49.56-127.409,113.229c-0.191,1.631-0.291,4.92-3.291,4.92H29.978C20.987,126.94,0,136.401,0,184.18v25.075    c0,35.436,20.987,43.609,29.978,43.609h43.584c8.991,0,16.347-7.356,16.347-16.347v-93.23c0-8.991-7.356-16.347-16.347-16.347    c0,0-2.052-0.18-1.529-3.835c7.192-50.319,50.129-89.313,102.344-89.313h12.26c51.86,0,94.912,38.418,102.2,88.288    c0.235,1.608,1.111,4.86-1.385,4.86c-8.991,0-16.347,7.356-16.347,16.347v93.23c0,8.991,7.356,16.347,16.347,16.347h8.184    c2.25,0,1.868,1.798,1.667,2.704c-6.667,30.104-21.637,64.256-55.238,64.256h-24.889c-2.54,0-3.167-1.861-3.65-2.743    c-4.032-7.367-11.851-12.364-20.841-12.364h-22.933c-13.118,0-23.753,10.634-23.753,23.753c0,13.119,10.635,23.752,23.753,23.752    h22.933c9.112,0,17.023-5.132,21.005-12.662c0.348-0.658,0.633-2.026,3.321-2.026h25.054c22.823,0,53.365-11.341,69.259-65.373    c1.694-5.758,3.068-11.496,4.187-17.026c0.154-0.761,0.25-2.27,2.625-2.27h12.9c8.991,0,29.978-8.174,29.978-43.609v-25.075    C361.013,137.082,340.026,126.94,331.035,126.94z"
      />
    </svg>
  );
}

// --- Reusable FAQ Accordion Component ---
function FaqAccordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-divider">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold text-secondary"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-base text-secondary/80">{children}</div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function BroadbandLandingPage() {
  const t = useTranslations('broadbandInfo');

  const plans = [
    {
      speed: t('plans.100.speed'),
      title: t('plans.100.title'),
      description: t('plans.100.description'),
    },
    {
      speed: t('plans.250.speed'),
      title: t('plans.250.title'),
      description: t('plans.250.description'),
    },
    {
      speed: t('plans.500.speed'),
      title: t('plans.500.title'),
      description: t('plans.500.description'),
    },
    {
      speed: t('plans.1000.speed'),
      title: t('plans.1000.title'),
      description: t('plans.1000.description'),
    },
  ];

  const benefits = [
    {
      name: t('benefits.flexible.name'),
      description: t('benefits.flexible.description'),
      icon: DocumentTextIcon,
    },
    {
      name: t('benefits.reliable.name'),
      description: t('benefits.reliable.description'),
      icon: GlobeAltIcon,
    },
    {
      name: t('benefits.localSupport.name'),
      description: t('benefits.localSupport.description'),
      icon: HeadsetIcon,
    },
  ];

  return (
    <div className="bg-primary text-secondary">
      {/* Hero Section */}
      <header
        className="relative py-24 px-4 text-center text-primary bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://internetportcom.b-cdn.net/se/img/kvinna-lyssnar-pa-musik.webp')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/60" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold">{t('hero.title')}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-primary/90">
            {t('hero.subtitle')}
          </p>
          <a
            href="#planer"
            className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            {t('hero.cta')}
          </a>
        </div>
      </header>

      {/* Plans Section */}
      <section id="planer" className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('plansSection.title')}
            </h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary/70">
              {t('plansSection.subtitle')}
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.speed}
                className="bg-primary border border-divider rounded-xl shadow-lg p-8 flex flex-col"
              >
                <h3 className="text-2xl font-bold text-accent">{plan.speed}</h3>
                <h4 className="text-lg font-semibold text-secondary mt-2">{plan.title}</h4>
                <p className="mt-4 text-secondary/80 flex-grow">{plan.description}</p>
                <a
                  href="/address-sok-bredband"
                  className="mt-8 block w-full text-center bg-accent text-primary font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
                >
                  {t('plansSection.orderButton')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary/5 py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('benefitsSection.title')}
            </h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary/70">
              {t('benefitsSection.subtitle')}
            </p>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-1 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary mx-auto">
                  <benefit.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-secondary">{benefit.name}</h3>
                <p className="mt-2 text-base text-secondary/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('faqSection.title')}
            </h2>
          </div>
          <div className="space-y-4">
            <FaqAccordion title={t('faqs.speed.question')}>
              <p dangerouslySetInnerHTML={{ __html: t.raw('faqs.speed.answer') }} />
            </FaqAccordion>
            <FaqAccordion title={t('faqs.broadbandType.question')}>
              <p dangerouslySetInnerHTML={{ __html: t.raw('faqs.broadbandType.answer') }} />
            </FaqAccordion>
            <FaqAccordion title={t('faqs.security.question')}>
              <p
                className="space-y-2"
                dangerouslySetInnerHTML={{ __html: t.raw('faqs.security.answer') }}
              />
            </FaqAccordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="relative py-24 px-4 text-center text-primary bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://internetportcom.b-cdn.net/se/img/kille-anvander-bredband.webp')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/70" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('finalCta.title')}
          </h2>
          <p className="mt-4 text-lg text-primary/90">{t('finalCta.subtitle')}</p>
          <a
            href="/address-sok-bredband"
            className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            {t('finalCta.cta')}
          </a>
        </div>
      </section>
    </div>
  );
}