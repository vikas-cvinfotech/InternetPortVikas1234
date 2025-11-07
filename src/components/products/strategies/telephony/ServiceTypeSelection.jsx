'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PriceDisplay } from '@/components/tax/PriceDisplay';
import { telephonyServiceTypes } from '@/config/telephonyProducts';
import { getBillingPeriodSuffix } from '@/lib/utils/productPricing';

export default function ServiceTypeSelection({ 
  selectedServiceType, 
  onServiceTypeChange, 
  allServicePricing,
  isValid 
}) {
  const tCommon = useTranslations('common');
  const t = useTranslations('telephony.form');
  const locale = useLocale();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-secondary flex items-center">
        <span className="bg-accent text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
        {t('steps.step1.title')}
      </h3>
      
      <div className="space-y-3">
        {telephonyServiceTypes.map((serviceType) => {
          const pricingInfo = allServicePricing[serviceType.id];
          
          return (
            <div 
              key={serviceType.id}
              onClick={() => onServiceTypeChange(serviceType.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedServiceType === serviceType.id
                  ? 'border-accent bg-accent/5'
                  : 'border-divider hover:border-accent/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`service-${serviceType.id}`}
                    name="serviceType"
                    value={serviceType.id}
                    checked={selectedServiceType === serviceType.id}
                    onChange={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-accent border-2 border-divider focus:ring-accent accent-accent"
                  />
                  <label htmlFor={`service-${serviceType.id}`} className="cursor-pointer">
                    <div className="font-semibold text-secondary">{t(`steps.step1.serviceTypes.${serviceType.id}.name`)}</div>
                    <div className="text-sm text-secondary/70">{t(`steps.step1.serviceTypes.${serviceType.id}.description`)}</div>
                  </label>
                </div>
                {pricingInfo && (
                  <div className="text-right">
                    <div className="font-bold text-secondary">
                      <PriceDisplay basePrice={pricingInfo.primaryPrice} showTaxSuffix={true} locale={locale} />
                    </div>
                    <div className="text-sm text-secondary/70">
                      {getBillingPeriodSuffix(pricingInfo.billingPeriod, tCommon)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}