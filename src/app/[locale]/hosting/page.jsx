'use client';

import { useTranslations } from 'next-intl';
import {
  ServerStackIcon,
  CloudIcon,
  GlobeAltIcon,
  ServerIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export default function HostingLandingPage() {
  const t = useTranslations('hostingPage');

  const hostingProducts = [
    {
      name: t('products.items.dedicatedServer.name'),
      description: t('products.items.dedicatedServer.description'),
      icon: ServerIcon,
    },
    {
      name: t('products.items.vps.name'),
      description: t('products.items.vps.description'),
      icon: CloudIcon,
    },
    {
      name: t('products.items.webHosting.name'),
      description: t('products.items.webHosting.description'),
      icon: GlobeAltIcon,
    },
    {
      name: t('products.items.colocation.name'),
      description: t('products.items.colocation.description'),
      icon: ServerStackIcon,
    },
  ];

  const coreBenefits = [
    {
      name: t('benefits.items.expertise.name'),
      description: t('benefits.items.expertise.description'),
      icon: WrenchScrewdriverIcon,
    },
    {
      name: t('benefits.items.partner.name'),
      description: t('benefits.items.partner.description'),
      icon: UserGroupIcon,
    },
    {
      name: t('benefits.items.security.name'),
      description: t('benefits.items.security.description'),
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <div className="bg-primary text-secondary">
      {/* Hero Section */}
      <header
        className="relative py-24 px-4 text-center text-primary bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://internetportcom.b-cdn.net/se/img/server-hall-hosting.webp')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/70" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold">{t('hero.title')}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-primary/90">
            {t('hero.subtitle')}
          </p>
          <a
            href="#products"
            className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            {t('hero.cta')}
          </a>
        </div>
      </header>

      {/* Products Section */}
      <section id="products" className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('products.title')}
            </h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary/70">
              {t('products.subtitle')}
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {hostingProducts.map((product) => (
              <div
                key={product.name}
                className="bg-primary border border-divider rounded-xl shadow-lg p-8 text-center flex flex-col"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary mx-auto">
                  <product.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-secondary">{product.name}</h3>
                <p className="mt-2 text-secondary/80 flex-grow">{product.description}</p>
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
              {t('benefits.title')}
            </h2>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-1 lg:grid-cols-3">
            {coreBenefits.map((benefit) => (
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

      {/* VPS vs Dedicated Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('comparison.title')}
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-secondary/70">
              {t('comparison.subtitle')}
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="bg-primary border border-divider rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-secondary">{t('comparison.vps.title')}</h3>
              <p className="mt-4 text-secondary/80">{t('comparison.vps.description')}</p>
              <p className="mt-4 font-semibold text-secondary">{t('comparison.vps.bestFor')}</p>
              <ul className="mt-2 list-disc list-inside text-secondary/80">
                {t.raw('comparison.vps.useCases').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-primary border border-divider rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-secondary">
                {t('comparison.dedicated.title')}
              </h3>
              <p className="mt-4 text-secondary/80">{t('comparison.dedicated.description')}</p>
              <p className="mt-4 font-semibold text-secondary">
                {t('comparison.dedicated.bestFor')}
              </p>
              <ul className="mt-2 list-disc list-inside text-secondary/80">
                {t.raw('comparison.dedicated.useCases').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="relative py-24 px-4 text-center text-primary bg-cover bg-center"
        style={{
          backgroundImage: "url('https://internetportcom.b-cdn.net/se/img/servrar-narbild.webp')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/70" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('finalCta.title')}</h2>
          <p className="mt-4 text-lg text-primary/90">{t('finalCta.subtitle')}</p>
          <a
            href="/kontakta-oss"
            className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            {t('finalCta.cta')}
          </a>
        </div>
      </section>
    </div>
  );
}
