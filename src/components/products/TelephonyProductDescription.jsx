'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import StandardLoadingSpinner from '@/components/StandardLoadingSpinner';

export default function TelephonyProductDescription() {
  const t = useTranslations('telephony');
  const locale = useLocale();
  const [showCountries, setShowCountries] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countriesData, setCountriesData] = useState([]);
  const [ratesLoading, setRatesLoading] = useState(true);

  // Fetch international rates from API
  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      try {
        const response = await fetch(`/api/mor/rates?locale=${locale}`);
        const data = await response.json();
        if (data.success) {
          setCountriesData(data.rates);
        } else {
          console.error('Failed to fetch rates:', data.error);
          setCountriesData([]);
        }
      } catch (error) {
        console.error('Error fetching international rates:', error);
        setCountriesData([]);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchRates();
  }, [locale]);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countriesData;
    return countriesData.filter(country =>
      country.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, countriesData]);

  const toggleCountryList = () => {
    setShowCountries(!showCountries);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-10">
      
      {/* Hero Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold tracking-tight text-secondary leading-tight">
          {t('hero.title')}
        </h2>
        <p className="text-lg text-secondary/80 leading-relaxed max-w-4xl">
          {t('hero.subtitle')}
        </p>
        <p className="text-base text-secondary/70">
          {t('hero.description')}
        </p>
      </div>

      {/* Key Benefits Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-secondary">
          {t('benefitsSection.title')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-primary/5 p-6 rounded-lg border border-secondary/10">
            <h4 className="font-semibold text-secondary mb-3">💎 {t('benefits.highQuality.name')}</h4>
            <p className="text-sm text-secondary/70">{t('benefits.highQuality.description')}</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg border border-secondary/10">
            <h4 className="font-semibold text-secondary mb-3">⚡ {t('benefits.easyInstall.name')}</h4>
            <p className="text-sm text-secondary/70">{t('benefits.easyInstall.description')}</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg border border-secondary/10">
            <h4 className="font-semibold text-secondary mb-3">🌐 {t('benefits.webControl.name')}</h4>
            <p className="text-sm text-secondary/70">{t('benefits.webControl.description')}</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg border border-secondary/10">
            <h4 className="font-semibold text-secondary mb-3">📧 {t('benefits.voicemail.name')}</h4>
            <p className="text-sm text-secondary/70">{t('benefits.voicemail.description')}</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg border border-secondary/10">
            <h4 className="font-semibold text-secondary mb-3">📱 {t('benefits.callForwarding.name')}</h4>
            <p className="text-sm text-secondary/70">{t('benefits.callForwarding.description')}</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg border border-secondary/10">
            <h4 className="font-semibold text-secondary mb-3">🔒 {t('benefits.hiddenNumber.name')}</h4>
            <p className="text-sm text-secondary/70">{t('benefits.hiddenNumber.description')}</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-secondary">
            {t('pricingSection.title')}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary rounded-lg">
              <div className="text-xs text-secondary/60 uppercase tracking-wide mb-2">{t('pricingSection.perCall')}</div>
              <div className="text-2xl font-bold text-accent">{t('pricingSection.openingFee')}</div>
              <div className="text-xs text-secondary/60 mt-1">{t('pricingSection.openingFeeLabel')}</div>
            </div>
            
            <div className="text-center p-4 bg-primary rounded-lg">
              <div className="text-xs text-secondary/60 uppercase tracking-wide mb-2">{t('pricingSection.swedenFixed')}</div>
              <div className="text-2xl font-bold text-accent">{t('pricingSection.swedenFixedPrice')}</div>
              <div className="text-xs text-secondary/60 mt-1">{t('pricingSection.swedenFixedLabel')}</div>
            </div>
            
            <div className="text-center p-4 bg-primary rounded-lg">
              <div className="text-xs text-secondary/60 uppercase tracking-wide mb-2">{t('pricingSection.swedenMobile')}</div>
              <div className="text-2xl font-bold text-secondary">{t('pricingSection.swedenMobilePrice')}</div>
              <div className="text-xs text-secondary/60 mt-1">{t('pricingSection.swedenMobileLabel')}</div>
            </div>
          </div>
          
          <div className="border-t border-accent/20 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <span className="text-secondary/70">{t('pricingSection.internationalText')}</span>
              <span className="font-semibold text-secondary">{t('pricingSection.internationalFrom')}</span>
            </div>

            <button 
              onClick={toggleCountryList}
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-all duration-200"
            >
              <span>{showCountries ? t('pricingSection.hideAllCountries') : t('pricingSection.showAllCountries')}</span>
              <svg 
                className={`w-4 h-4 transform transition-transform ${showCountries ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {showCountries && (
          <div className="mt-8 pt-6 border-t border-accent/20">
            <div className="mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t('pricingSection.searchPlaceholder')}
                className="w-full max-w-md px-4 py-2 border border-secondary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
              {searchTerm && (
                <p className="mt-2 text-sm text-secondary/60">
                  {t('pricingSection.showingCount', { count: filteredCountries.length, total: countriesData.length })}
                </p>
              )}
            </div>

            {ratesLoading ? (
              <StandardLoadingSpinner size="md" className="py-8" />
            ) : (
              <div className="max-h-80 overflow-y-auto bg-primary rounded-lg border border-secondary/10">
                <div className="divide-y divide-secondary/10">
                  {filteredCountries.map((country, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-secondary/5 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-secondary font-medium">{country.country}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-secondary/60 mb-1">{t('pricingSection.mobile')}</p>
                          {country.m_con_fee != null && (
                            <p className="text-xs text-secondary/60 mb-1">{country.m_con_fee.toFixed(2)} kr {t('pricingSection.connectionFee')}</p>
                          )}
                          <p className="font-semibold text-accent">
                            {country.m_price != null
                              ? `${country.m_price.toFixed(2)} kr/min`
                              : t('pricingSection.notAvailable')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-secondary/60 mb-1">{t('pricingSection.landline')}</p>
                          {country.f_con_fee != null && (
                            <p className="text-xs text-secondary/60 mb-1">{country.f_con_fee.toFixed(2)} kr {t('pricingSection.connectionFee')}</p>
                          )}
                          <p className="font-semibold text-accent">
                            {country.f_price != null
                              ? `${country.f_price.toFixed(2)} kr/min`
                              : t('pricingSection.notAvailable')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cost Example */}
      <div className="bg-primary border border-secondary/10 rounded-lg p-8">
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold text-secondary mb-3">{t('pricingSection.example.title')}</h4>
            <p className="text-secondary/70">
              {t('pricingSection.example.description')}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-secondary">{t('pricingSection.example.openingFees')}</span>
              <span className="font-semibold text-secondary">{t('pricingSection.example.openingFeesTotal')}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-secondary">{t('pricingSection.example.swedenCalls')}</span>
              <span className="font-semibold text-secondary">{t('pricingSection.example.swedenCallsTotal')}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-secondary">{t('pricingSection.example.mobileCalls')}</span>
              <span className="font-semibold text-secondary">{t('pricingSection.example.mobileCallsTotal')}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-secondary/10">
              <span className="text-lg font-semibold text-secondary">{t('pricingSection.example.total')}</span>
              <span className="text-2xl font-bold text-accent">{t('pricingSection.example.totalAmount')}</span>
            </div>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg">
            <p className="text-accent font-semibold text-center">
              {t('pricingSection.example.summaryText')}
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-accent py-12 px-8 rounded-lg text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-semibold text-primary">
            {t('finalCta.title')}
          </h3>
          <p className="text-lg text-primary/90">
            {t('finalCta.subtitle')}
          </p>
          <div className="pt-2">
            <p className="text-base text-primary/75 font-medium">
              {t('finalCta.description')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}