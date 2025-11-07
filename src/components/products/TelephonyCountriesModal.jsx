'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import countriesData from '@/data/telephony-countries.json';

export default function TelephonyCountriesModal() {
  const t = useTranslations('telephony');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countriesData;
    return countriesData.filter(country => 
      t(`countries.${country.key}`).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, t]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
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
      
      <div className="max-h-80 overflow-y-auto bg-primary rounded-lg border border-secondary/10">
        <div className="divide-y divide-secondary/10">
          {filteredCountries.map((country, index) => (
            <div key={index} className="flex justify-between items-center px-4 py-3 hover:bg-secondary/5 transition-colors">
              <span className="text-secondary font-medium">{t(`countries.${country.key}`)}</span>
              <div className="text-right">
                <span className="font-semibold text-accent">{country.f_price}/{country.m_price} kr</span>
                <p className="text-xs text-secondary/60">{t('pricingSection.fixedMobile')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}