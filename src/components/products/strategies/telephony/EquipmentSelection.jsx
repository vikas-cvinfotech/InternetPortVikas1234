'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PriceDisplay } from '@/components/tax/PriceDisplay';
import { parseProductPricing, getBillingPeriodSuffix } from '@/lib/utils/productPricing';

export default function EquipmentSelection({
  selectedServiceType,
  selectedEquipment,
  onEquipmentChange,
  hardwareProducts,
  isValid
}) {
  const tCommon = useTranslations('common');
  const t = useTranslations('telephony.form');
  const locale = useLocale();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-secondary flex items-center">
        <span className="bg-accent text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
        {selectedServiceType === 'standard' 
          ? t('steps.step3.titleRequired')
          : t('steps.step3.titleOptional')
        }
      </h3>
      
      <div className="space-y-3">
        {/* No equipment option for Retail only */}
        {selectedServiceType === 'retail' && (
          <div 
            onClick={() => onEquipmentChange('')}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedEquipment === ''
                ? 'border-accent bg-accent/5'
                : 'border-divider hover:border-accent/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="no-equipment"
                  name="equipment"
                  value=""
                  checked={selectedEquipment === ''}
                  onChange={(e) => e.stopPropagation()}
                  className="w-4 h-4 text-accent border-2 border-divider focus:ring-accent accent-accent"
                />
                <label htmlFor="no-equipment" className="cursor-pointer">
                  <div className="font-semibold text-secondary">{t('steps.step3.noEquipment.name')}</div>
                  <div className="text-sm text-secondary/70">{t('steps.step3.noEquipment.description')}</div>
                </label>
              </div>
              <div className="text-right">
                <div className="font-bold text-secondary">{t('steps.step3.pricing.free')}</div>
                <div className="text-sm text-secondary/70">-</div>
              </div>
            </div>
          </div>
        )}

        {/* Hardware options */}
        {hardwareProducts.map((hardware) => {
          const pricingInfo = hardware.productData ? parseProductPricing(hardware.productData) : null;
          
          return (
            <div 
              key={hardware.id}
              onClick={() => onEquipmentChange(hardware.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedEquipment === hardware.id
                  ? 'border-accent bg-accent/5'
                  : 'border-divider hover:border-accent/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3 flex-1 max-w-2xl">
                  <input
                    type="radio"
                    id={`equipment-${hardware.id}`}
                    name="equipment"
                    value={hardware.id}
                    checked={selectedEquipment === hardware.id}
                    onChange={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-accent border-2 border-divider focus:ring-accent accent-accent mt-1 flex-shrink-0"
                  />
                  <div className="flex items-start space-x-3 min-w-0">
                    <img 
                      src={t(`steps.step3.hardwareOptions.${hardware.id}.image`)}
                      alt={t(`steps.step3.hardwareOptions.${hardware.id}.name`)}
                      className="w-16 h-16 object-contain rounded border border-divider bg-primary flex-shrink-0"
                    />
                    <label htmlFor={`equipment-${hardware.id}`} className="cursor-pointer min-w-0">
                      <div className="font-semibold text-secondary">{t(`steps.step3.hardwareOptions.${hardware.id}.name`)}</div>
                      <div className="text-sm text-secondary/70 mt-1 leading-relaxed">{t(`steps.step3.hardwareOptions.${hardware.id}.description`)}</div>
                    </label>
                  </div>
                </div>
                {pricingInfo && (
                  <div className="text-right flex-shrink-0 min-w-[120px]">
                    <div className="font-bold text-secondary">
                      <PriceDisplay basePrice={pricingInfo.primaryPrice} showTaxSuffix={true} locale={locale} />
                    </div>
                    <div className="text-sm text-secondary/70 whitespace-nowrap">
                      {pricingInfo.isOneTime ? t('steps.step3.pricing.onceOnly') : getBillingPeriodSuffix(pricingInfo.billingPeriod, tCommon)}
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