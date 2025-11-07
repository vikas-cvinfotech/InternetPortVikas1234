'use client';

import { useState, useEffect } from 'react';
import {
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import StandardLoadingSpinner from '@/components/StandardLoadingSpinner';

function InternationalRatesTable({ rates }) {
  const t = useTranslations('telephony.internationalRatesTable');
  const [query, setQuery] = useState('');
  const [filteredRates, setFilteredRates] = useState(rates);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredRates(rates);
    } else {
      const searchLower = query.toLowerCase();
      setFilteredRates(rates.filter((rate) => rate.country.toLowerCase().includes(searchLower)));
    }
  }, [query, rates]);

  const ratesToShow = showAll ? filteredRates : filteredRates.slice(0, 5);

  return (
    <div className="w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full p-3 mb-4 border rounded-lg bg-primary border-divider text-secondary placeholder-secondary/50 focus:ring-2 focus:ring-accent focus:outline-none"
      />
      <div className="overflow-x-auto rounded-lg border border-divider">
        <table className="min-w-full divide-y divide-divider">
          <thead className="bg-secondary/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                {t('country')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                {t('mobileConnectionFee')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                {t('mobilePrice')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                {t('landlineConnectionFee')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                {t('landlinePrice')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-primary divide-y divide-divider">
            {ratesToShow.length > 0 ? (
              ratesToShow.map((rate) => (
                <tr key={rate.country}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">
                    {rate.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary/80">
                    {rate.m_con_fee != null ? `${rate.m_con_fee.toFixed(2)} kr` : t('internationalRatesTable.notAvailable')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary/80">
                    {rate.m_price != null ? `${rate.m_price.toFixed(2)} kr/min` : t('internationalRatesTable.notAvailable')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary/80">
                    {rate.f_con_fee != null ? `${rate.f_con_fee.toFixed(2)} kr` : t('internationalRatesTable.notAvailable')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary/80">
                    {rate.f_price != null ? `${rate.f_price.toFixed(2)} kr/min` : t('internationalRatesTable.notAvailable')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-secondary/70">
                  {t('noCountryFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredRates.length > 5 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-accent text-primary font-semibold py-2 px-6 rounded-lg hover:bg-accent/90 transition-colors"
          >
            {showAll ? t('showLess') : t('showAll')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function IpTelephonyPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');
  const [internationalRates, setInternationalRates] = useState([]);
  const [ratesLoading, setRatesLoading] = useState(true);
  const benefitsData = t.raw('benefits');

  // Fetch international rates from API
  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      try {
        const response = await fetch(`/api/mor/rates?locale=${locale}`);
        const data = await response.json();
        if (data.success) {
          setInternationalRates(data.rates);
        } else {
          console.error('Failed to fetch rates:', data.error);
          setInternationalRates([]);
        }
      } catch (error) {
        console.error('Error fetching international rates:', error);
        setInternationalRates([]);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchRates();
  }, [locale]);
  const benefits = [
    {
      ...benefitsData.highQuality,
      icon: PhoneIcon,
    },
    {
      ...benefitsData.easyInstall,
      icon: WifiIcon,
    },
    {
      ...benefitsData.webControl,
      icon: GlobeAltIcon,
    },
    {
      ...benefitsData.voicemail,
      icon: EnvelopeIcon,
    },
    {
      ...benefitsData.callForwarding,
      icon: DevicePhoneMobileIcon,
    },
    {
      ...benefitsData.hiddenNumber,
      icon: EyeSlashIcon,
    },
  ];

  return (
    <div className="bg-primary text-secondary">
      {/* Hero Section */}
      <header
        className="relative py-24 px-4 text-center text-primary bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://internetportcom.b-cdn.net/se/img/kvinna-anvander-ip-telefoni.webp')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/70" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold">{t('hero.title')}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-primary/90">
            {t('hero.subtitle')}
          </p>
          <a
            href="#priser"
            className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90"
          >
            {t('hero.cta')}
          </a>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('benefitsSection.title')}
            </h2>
            <p className="mt-4 text-lg text-secondary/70">{t('benefitsSection.subtitle')}</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
                    <benefit.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary">{benefit.name}</h3>
                  <p className="mt-1 text-base text-secondary/70">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="priser" className="bg-secondary/5 py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('pricingSection.title')}
            </h2>
            <p className="mt-4 text-lg text-secondary/70">{t('pricingSection.subtitle')}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="bg-primary p-8 rounded-xl border border-divider shadow-lg">
              <h3 className="text-2xl font-semibold text-secondary mb-6">
                {t('pricingSection.callCosts.title')}
              </h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-baseline">
                  <span className="text-secondary/80">
                    {t('pricingSection.callCosts.openingFee')}
                  </span>
                  <span className="font-bold text-accent text-lg">0,63 kr</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <span className="text-secondary/80">
                    {t('pricingSection.callCosts.swedenCall')}
                  </span>
                  <span className="font-bold text-accent text-lg">0,15 kr</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <span className="text-secondary/80">
                    {t('pricingSection.callCosts.mobileCall')}
                  </span>
                  <span className="font-bold text-accent text-lg">0,75 kr</span>
                </li>
              </ul>
            </div>
            <div className="bg-primary p-8 rounded-xl border border-divider shadow-lg">
              <h3 className="text-2xl font-semibold text-secondary mb-6">
                {t('pricingSection.example.title')}
              </h3>
              <p className="text-sm text-secondary/70 mb-4">
                {t('pricingSection.example.description')}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between border-b border-divider py-2">
                  <span>{t('pricingSection.example.openingFees')}</span>
                  <span>31,50 kr</span>
                </li>
                <li className="flex justify-between border-b border-divider py-2">
                  <span>{t('pricingSection.example.swedenCalls')}</span>
                  <span>11,25 kr</span>
                </li>
                <li className="flex justify-between border-b border-divider py-2">
                  <span>{t('pricingSection.example.mobileCalls')}</span>
                  <span>56,25 kr</span>
                </li>
                <li className="flex justify-between font-bold pt-4">
                  <span>{t('pricingSection.example.total')}</span>
                  <span className="text-accent">99,00 kr</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* International Rates Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('internationalRatesSection.title')}
            </h2>
            <p className="mt-4 text-lg text-secondary/70">
              {t('internationalRatesSection.subtitle')}
            </p>
          </div>
          {ratesLoading ? (
            <StandardLoadingSpinner size="lg" className="py-12" />
          ) : (
            <InternationalRatesTable rates={internationalRates} />
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="relative py-16 sm:py-24 px-4 text-center text-primary bg-cover bg-center md:bg-[center_18%]"
        style={{
          backgroundImage:
            "url('https://internetportcom.b-cdn.net/se/img/ip-telefoni-man-pratar.webp')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/70" aria-hidden="true"></div>
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('finalCta.title')}</h2>
          <p className="mt-4 text-lg text-primary/90">{t('finalCta.subtitle')}</p>
          <a
            href="/kategori/telefoni"
            className="mt-8 inline-block bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
          >
            {t('finalCta.cta')}
          </a>
        </div>
      </section>
    </div>
  );
}
