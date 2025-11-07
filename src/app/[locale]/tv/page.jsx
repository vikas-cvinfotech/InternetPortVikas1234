'use client';

import { TvIcon, StarIcon, HandThumbUpIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export default function TvLandingPage() {
  const t = useTranslations('tvLandingPage');

  const benefits = [
    {
      name: t('benefits.entertainment.name'),
      description: t('benefits.entertainment.description'),
      icon: TvIcon,
    },
    {
      name: t('benefits.quality.name'),
      description: t('benefits.quality.description'),
      icon: StarIcon,
    },
    {
      name: t('benefits.flexibility.name'),
      description: t('benefits.flexibility.description'),
      icon: HandThumbUpIcon,
    },
  ];

  const basePackages = [
    {
      name: t('packages.base.name'),
      description: t('packages.base.description'),
      channels: t.raw('packages.base.channels'),
    },
    {
      name: t('packages.basePlus.name'),
      description: t('packages.basePlus.description'),
      channels: t.raw('packages.basePlus.channels'),
    },
  ];

  const addOnPackages = [
    { name: t('packages.addOns.bbc.name'), channels: t('packages.addOns.bbc.channels') },
    { name: t('packages.addOns.tv4.name'), channels: t('packages.addOns.tv4.channels') },
    {
      name: t('packages.addOns.discovery.name'),
      channels: t('packages.addOns.discovery.channels'),
    },
  ];

  const tvBoxes = [
    {
      name: t('hardware.vip4302.name'),
      description: t('hardware.vip4302.description'),
      badge: t('hardware.vip4302.badge'),
    },
    {
      name: t('hardware.vip1113.name'),
      description: t('hardware.vip1113.description'),
      badge: t('hardware.vip1113.badge'),
    },
    {
      name: t('hardware.ownBox.name'),
      description: t('hardware.ownBox.description'),
      badge: t('hardware.ownBox.badge'),
    },
  ];

  return (
    <div className="bg-primary text-secondary">
      {/* Hero Section */}
      <header
        className="relative py-24 px-4 text-center text-primary bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://internetportcom.b-cdn.net/se/img/modern-tv.webp?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/70" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold">{t('hero.title')}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-primary/90">
            {t('hero.subtitle')}
          </p>
          <a
            href="#benefits"
            className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            {t('hero.cta')}
          </a>
        </div>
      </header>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-10 sm:grid-cols-1 lg:grid-cols-3">
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

      {/* How it works Section */}
      <section id="how-it-works" className="bg-secondary/5 py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('howItWorks.title')}
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary/70">
              {t('howItWorks.subtitle')}
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent text-primary text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold">{t('howItWorks.step1.title')}</h3>
              <p className="mt-2 text-secondary/80">{t('howItWorks.step1.description')}</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent text-primary text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold">{t('howItWorks.step2.title')}</h3>
              <p className="mt-2 text-secondary/80">{t('howItWorks.step2.description')}</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent text-primary text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold">{t('howItWorks.step3.title')}</h3>
              <p className="mt-2 text-secondary/80">{t('howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
            {t('pricing.title')}
          </h2>
          <p className="mt-4 text-lg text-secondary/70">{t('pricing.subtitle')}</p>
          <div className="mt-8">
            <span className="text-lg text-secondary/80">{t('pricing.from')}</span>
            <span className="mx-2 text-5xl font-bold text-accent">{t('pricing.price')}</span>
            <span className="text-lg text-secondary/80">{t('pricing.perMonth')}</span>
          </div>
        </div>
      </section>

      {/* Package Showcase Section */}
      <section
        className="relative py-16 sm:py-24 px-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://internetportcom.b-cdn.net/se/img/tv-morkt-rum.webp')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/80" aria-hidden="true"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center text-primary">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('packages.title')}</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-primary/90">
              {t('packages.subtitle')}
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {basePackages.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-primary border border-divider rounded-xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-secondary">{pkg.name}</h3>
                <p className="mt-2 text-secondary/80">{pkg.description}</p>
                <ul className="mt-6 space-y-2 text-secondary/80">
                  {pkg.channels.map((channel) => (
                    <li key={channel} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-accent flex-shrink-0 mr-2 mt-1" />
                      <span>{channel}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {addOnPackages.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-primary border border-divider rounded-lg p-4 text-center shadow-lg"
              >
                <h3 className="text-lg font-semibold text-secondary">{pkg.name}</h3>
                <p className="mt-1 text-sm text-secondary/70">{pkg.channels}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Showcase Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('hardware.title')}
            </h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary/70">
              {t('hardware.subtitle')}
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {tvBoxes.map((box) => (
              <div
                key={box.name}
                className="relative bg-primary border border-divider rounded-xl shadow-lg p-8 text-center"
              >
                {box.badge && (
                  <div className="absolute top-4 right-4 bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {box.badge}
                  </div>
                )}
                {/* Increased margin-top here to create space below the badge */}
                <h3 className="text-xl font-semibold text-secondary mt-4">{box.name}</h3>
                <p className="mt-2 text-secondary/80">{box.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="relative py-24 px-4 text-center text-primary bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://internetportcom.b-cdn.net/se/img/tv-netflix.webp?q=80&w=1974&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/70" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('finalCta.title')}</h2>
          <p className="mt-4 text-lg text-primary/90">{t('finalCta.subtitle')}</p>
          <a
            href="/kategori/tv"
            className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            {t('finalCta.cta')}
          </a>
        </div>
      </section>
    </div>
  );
}
