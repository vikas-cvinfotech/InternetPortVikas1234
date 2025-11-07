/**
 * Reusable Price Display Components
 *
 * These components provide consistent price display with tax information
 * across the application. They automatically handle customer type and
 * display appropriate tax-inclusive or tax-exclusive prices.
 *
 * Components:
 * - PriceDisplay: Basic price with optional tax suffix
 * - PriceBreakdown: Detailed price breakdown with tax information
 * - PricingPeriodDisplay: Price with period information (monthly/quarterly)
 */

import React from 'react';
import { formatPriceWithDefaultTax } from '@/lib/utils/tax';

/**
 * Basic price display with tax handling
 * @param {number} basePrice - Base price excluding tax
 * @param {boolean} showTaxSuffix - Whether to show tax suffix (inkl./exkl. moms)
 * @param {string} className - Additional CSS classes
 * @param {string} locale - Locale for formatting
 */
export const PriceDisplay = ({
  basePrice,
  showTaxSuffix = true,
  className = '',
  locale = 'sv-SE',
}) => {
  // Extract language code from locale (sv-SE -> sv, en-US -> en)
  const langCode = locale.split('-')[0];
  const priceInfo = formatPriceWithDefaultTax(basePrice, langCode);

  return (
    <span className={className}>
      {priceInfo.inclusivePrice} kr
      {showTaxSuffix && (
        <span className="text-xs text-secondary/70 ml-1">{priceInfo.displaySuffix}</span>
      )}
    </span>
  );
};

/**
 * Detailed price breakdown showing base price, tax, and total
 * @param {number} basePrice - Base price excluding tax
 * @param {string} className - Additional CSS classes
 * @param {boolean} showTotal - Whether to show total line (default: true)
 */
export const PriceBreakdown = ({ basePrice, className = '', showTotal = true, locale = 'sv-SE' }) => {
  const langCode = locale.split('-')[0];
  const priceInfo = formatPriceWithDefaultTax(basePrice, langCode);
  const isPrivateCustomer = true;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-sm">
        <span>Grundpris:</span>
        <span>{priceInfo.basePrice} kr</span>
      </div>

      {isPrivateCustomer && priceInfo.taxAmount > 0 && (
        <div className="flex justify-between text-sm text-secondary/70">
          <span>Moms ({priceInfo.vatPercentage}%):</span>
          <span>{priceInfo.taxAmount} kr</span>
        </div>
      )}

      {showTotal && (
        <div className="flex justify-between font-medium text-base border-t border-divider pt-1">
          <span>Totalt:</span>
          <span>{priceInfo.inclusivePrice} kr</span>
        </div>
      )}
    </div>
  );
};

/**
 * Price display with period information
 * @param {number} monthlyPrice - Monthly base price
 * @param {number} setupPrice - Setup base price
 * @param {string} period - Period ('monthly' or 'quarterly')
 * @param {boolean} showQuarterlyNotice - Whether to show quarterly pricing notice
 * @param {string} className - Additional CSS classes
 */
export const PricingPeriodDisplay = ({
  monthlyPrice,
  setupPrice = 0,
  period = 'monthly',
  showQuarterlyNotice = true,
  className = '',
  locale = 'sv-SE',
}) => {
  const langCode = locale.split('-')[0];
  const monthlyInfo = formatPriceWithDefaultTax(monthlyPrice, langCode);
  const setupInfo = formatPriceWithDefaultTax(setupPrice, langCode);

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="text-2xl font-bold text-secondary">
        {monthlyPrice > 0 && `${monthlyInfo.inclusivePrice} kr/mån`}
        {monthlyPrice > 0 && setupPrice > 0 && ' + '}
        {setupPrice > 0 && `${setupInfo.inclusivePrice} kr setup`}
      </div>

      {showQuarterlyNotice && monthlyPrice > 0 && (
        <div className="text-sm text-secondary/70">
          eller {monthlyInfo.inclusivePrice * 3} kr/kvartal
        </div>
      )}

      {monthlyInfo.isPrivateCustomer && (
        <div className="text-xs text-secondary/50">{monthlyInfo.displaySuffix}</div>
      )}
    </div>
  );
};

/**
 * Campaign pricing display with original and campaign prices
 * @param {number} originalPrice - Original monthly price
 * @param {number} campaignPrice - Campaign monthly price
 * @param {number} campaignLength - Campaign length in months
 * @param {number} setupPrice - Setup price
 * @param {string} className - Additional CSS classes
 */
export const CampaignPriceDisplay = ({
  originalPrice,
  campaignPrice,
  campaignLength,
  setupPrice = 0,
  className = '',
  locale = 'sv-SE',
}) => {
  const langCode = locale.split('-')[0];
  const originalInfo = formatPriceWithDefaultTax(originalPrice, langCode);
  const campaignInfo = formatPriceWithDefaultTax(campaignPrice, langCode);
  const setupInfo = formatPriceWithDefaultTax(setupPrice, langCode);

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="text-2xl text-accent font-bold">
        {campaignInfo.inclusivePrice} kr/mån i {campaignLength} månader
      </div>

      <div className="text-xl text-secondary/70">Sedan {originalInfo.inclusivePrice} kr/mån</div>

      {setupPrice > 0 && (
        <div className="text-xl text-secondary/70">+ {setupInfo.inclusivePrice} kr setup</div>
      )}

      {campaignInfo.isPrivateCustomer && (
        <div className="text-xs text-secondary/50">{campaignInfo.displaySuffix}</div>
      )}
    </div>
  );
};

/**
 * Zero pricing display
 * @param {string} className - Additional CSS classes
 */
export const ZeroPriceDisplay = ({ className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="text-2xl font-bold text-secondary">0 kr</div>
    </div>
  );
};

/**
 * Utility component for consistent price formatting
 * @param {number} price - Price to format
 * @param {string} suffix - Optional suffix (e.g., '/mån', '/kvartal')
 * @param {string} className - Additional CSS classes
 */
export const FormattedPrice = ({ price, suffix = '', className = '' }) => {
  const formattedPrice = Math.round(price || 0);

  return (
    <span className={className}>
      {formattedPrice} kr{suffix}
    </span>
  );
};
