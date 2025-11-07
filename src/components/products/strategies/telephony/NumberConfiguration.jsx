'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PriceDisplay } from '@/components/tax/PriceDisplay';
import { phoneNumberOptions } from '@/config/telephonyProducts';
import { getNewNumberAddonId, getPortNumberAddonId } from '@/config/telephonyAddons';

export default function NumberConfiguration({
  selectedServiceType,
  selectedNumberOption,
  onNumberOptionChange,
  phoneNumber,
  onPhoneNumberChange,
  portingOrgNumber,
  onOrgNumberChange,
  phoneNumberError,
  orgNumberError,
  selectedAreaCode,
  onAreaCodeChange,
  availableNumbers,
  randomNumbers,
  availablePrefixes,
  selectedPhoneNumber,
  onSelectedPhoneNumberChange,
  isLoadingNumbers,
  allAddonPricing,
  getAreaCodeLabel,
  isValid
}) {
  const t = useTranslations('telephony.form');
  const commonT = useTranslations('common');
  const locale = useLocale();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-secondary flex items-center">
        <span className="bg-accent text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
        {t('steps.step2.title')}
      </h3>
      
      <div className="space-y-3">
        {phoneNumberOptions.map((option) => {
          // Get addon pricing for the option from pre-fetched data
          let addonPrice = null;
          let addonPeriod = null;

          if (selectedServiceType && allAddonPricing[selectedServiceType]) {
            const addonId = option.id === 'new' ? getNewNumberAddonId() : getPortNumberAddonId();
            const addonInfo = allAddonPricing[selectedServiceType][addonId];
            if (addonInfo) {
              addonPrice = addonInfo.price;
              addonPeriod = addonInfo.period;
            }
          }
          
          return (
            <div 
              key={option.id}
              onClick={() => onNumberOptionChange(option.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedNumberOption === option.id
                  ? 'border-accent bg-accent/5'
                  : 'border-divider hover:border-accent/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`number-${option.id}`}
                    name="numberOption"
                    value={option.id}
                    checked={selectedNumberOption === option.id}
                    onChange={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-accent border-2 border-divider focus:ring-accent accent-accent"
                  />
                  <label htmlFor={`number-${option.id}`} className="cursor-pointer">
                    <div className="font-semibold text-secondary">{t(`steps.step2.phoneNumberOptions.${option.id}.label`)}</div>
                  </label>
                </div>
                {addonPrice !== null && (
                  <div className="text-right">
                    <div className="font-bold text-secondary">
                      {addonPrice > 0 ? (
                        <PriceDisplay basePrice={addonPrice} showTaxSuffix={true} locale={locale} />
                      ) : (
                        t('steps.step2.pricing.free')
                      )}
                    </div>
                    {addonPrice > 0 && (
                      <div className="text-sm text-secondary/70">
                        {addonPeriod === 'once' 
                          ? t('steps.step2.pricing.onceOnly') 
                          : t('steps.step2.pricing.perMonth')
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phone Number Porting Form */}
      {selectedNumberOption === 'keep' && (
        <div className="mt-4 space-y-4 bg-secondary/5 p-4 rounded-lg">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-secondary mb-2">
              {t('steps.step2.portingForm.phoneNumberLabel')}
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              placeholder={t('steps.step2.portingForm.phoneNumberPlaceholder')}
              className={`w-full px-3 py-2 border ${phoneNumberError ? 'border-failure' : 'border-divider'} rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent`}
            />
            {phoneNumberError && (
              <p className="mt-1 text-sm text-failure">{phoneNumberError}</p>
            )}
          </div>

          <div>
            <label htmlFor="orgNumber" className="block text-sm font-medium text-secondary mb-2">
              {t('steps.step2.portingForm.orgNumberLabel')}
            </label>
            <input
              type="text"
              id="orgNumber"
              value={portingOrgNumber}
              onChange={(e) => onOrgNumberChange(e.target.value)}
              placeholder={t('steps.step2.portingForm.orgNumberPlaceholder')}
              className={`w-full px-3 py-2 border ${orgNumberError ? 'border-failure' : 'border-divider'} rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent`}
            />
            {orgNumberError && (
              <p className="mt-1 text-sm text-failure">{orgNumberError}</p>
            )}
          </div>

          <div className="text-sm text-secondary/70 bg-info-light p-3 rounded-lg">
            {t('steps.step2.portingForm.orgNumberNote')}
          </div>
        </div>
      )}

      {/* New Number Selection Form */}
      {selectedNumberOption === 'new' && (
        <>
          {/* Area Code Selection */}
          <div className="mt-4">
            <label htmlFor="areaCode" className="block text-sm font-medium text-secondary mb-2">
              {t('steps.step2.newNumberForm.areaCodeLabel')}
            </label>
            <select
              id="areaCode"
              value={selectedAreaCode}
              onChange={(e) => onAreaCodeChange(e.target.value)}
              className="w-full px-3 py-2 border border-divider rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              disabled={isLoadingNumbers}
            >
              <option value="">{t('steps.step2.newNumberForm.areaCodePlaceholder')}</option>
              {availablePrefixes.length > 0 ? (
                availablePrefixes
                  .filter(prefix => availableNumbers[prefix.value] && availableNumbers[prefix.value].length > 0)
                  .map((prefix) => (
                    <option key={prefix.value} value={prefix.value}>
                      {getAreaCodeLabel(prefix.value, prefix.text)}
                    </option>
                  ))
              ) : (
                Object.keys(availableNumbers).map((areaCode) => {
                  return (
                    <option key={areaCode} value={areaCode}>
                      {getAreaCodeLabel(areaCode, `${areaCode} - Available`)}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          {/* Phone Number Selection */}
          {selectedAreaCode && randomNumbers[selectedAreaCode] && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-secondary mb-2">
                {t('steps.step2.newNumberForm.phoneNumberLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {randomNumbers[selectedAreaCode].map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => onSelectedPhoneNumberChange(number)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                      selectedPhoneNumber === number
                        ? 'border-accent bg-accent text-primary'
                        : 'border-divider hover:border-accent/50 text-secondary'
                    }`}
                  >
                    {selectedAreaCode}-{number}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoadingNumbers && (
            <div className="mt-4 text-sm text-secondary/70">
              {commonT('loading')}...
            </div>
          )}
        </>
      )}
    </div>
  );
}