'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { roundedPrice, formatAddressForDisplay } from '@/lib/utils/formatting';
import { BaseCartItem } from './BaseCartItem';
import { getCampaignPricingDisplay } from '@/lib/utils/campaignPricing';

export const StandardCartItem = ({ product, taxRate, onQuantityChange, onRemove }) => {
  const commonT = useTranslations('common');
  const locale = useLocale();

  // Check for campaign pricing (HostBill products like NordVPN)
  const campaignInfo = getCampaignPricingDisplay(product.rawProductData, locale);

  // Determine if this is a one-time purchase
  const paytype = product.paytype || product.rawProductData?.paytype || '';
  const isOneTimePurchase = paytype.toLowerCase() === 'once';

  // Calculate prices with tax, handling one-time purchases
  let displayPrice = 0;
  let displayMonthlyPrice = 0;
  let displaySetupFee = 0;

  if (isOneTimePurchase) {
    // For one-time purchases, check multiple possible price fields
    const oneTimePrice = parseFloat(
      product.m_price ||
        product.price ||
        product.rawProductData?.price ||
        product.rawProductData?.m_price ||
        product.rawProductData?.m ||
        product.rawProductData?.m_setup ||
        product.s_price ||
        product.setupPrice ||
        product.rawProductData?.s_price ||
        product.rawProductData?.s ||
        0
    );

    // Apply same tax calculation as CartContext for consistency
    displayPrice = roundedPrice(oneTimePrice * taxRate);
  } else {
    // Regular subscription pricing
    const itemMonthlyPrice =
      product.m_campaign_price && product.m_campaign_length > 0
        ? parseFloat(product.m_campaign_price)
        : parseFloat(product.m_price || product.rawProductData?.m_price);
    displayMonthlyPrice = roundedPrice((itemMonthlyPrice || 0) * taxRate);
    const itemSetupFee =
      product.s_campaign_price !== null && product.s_campaign_price !== undefined
        ? parseFloat(product.s_campaign_price)
        : parseFloat(product.s_price || product.rawProductData?.s_price) || 0;
    displaySetupFee = roundedPrice(itemSetupFee * taxRate);
  }

  return (
    <BaseCartItem
      product={product}
      taxRate={taxRate}
      onQuantityChange={onQuantityChange}
      onRemove={onRemove}
      showQuantityControls={product.category !== 'Bredband'}
    >
      {/* Product Name and Details - preserving existing logic */}
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="pr-0 sm:pr-6">
          <h3 className="text-sm font-medium text-secondary">
            {product.productUrl ? (
              <Link href={product.productUrl} className="hover:text-accent transition-colors">
                {product.name}
              </Link>
            ) : (
              <span className="cursor-default">{product.name}</span>
            )}
          </h3>

          {/* Broadband-specific address display */}
          {product.category === 'Bredband' && (
            <div className="mt-1 space-y-1 text-xs text-secondary/70">
              {product.config?.customerType && (
                <div>
                  <span className="font-medium">{commonT('customerTypeLabel')} </span>
                  {product.config.customerType === 'private'
                    ? commonT('privateCustomer')
                    : commonT('companyCustomer')}
                </div>
              )}
              {product.config?.streetName && (
                <div>
                  <span className="font-medium">{commonT('deliveryAddressLabel')} </span>
                  {formatAddressForDisplay(product.config)}
                </div>
              )}
              {/* Only show notice period for non-installment products */}
              {product.notice > 0 && !product.name?.toLowerCase().includes('avbetalning') && (
                <p>{commonT('noticePeriod', { count: product.notice })}</p>
              )}
              {product.bound > 0 && <p>{commonT('bindingPeriod', { count: product.bound })}</p>}
            </div>
          )}
        </div>

        {/* Pricing display */}
        <div className="mt-1 text-left sm:text-right sm:mt-0">
          {campaignInfo ? (
            /* Campaign pricing display (HostBill products like NordVPN) */
            <div className="space-y-1">
              {/* Campaign Badge */}
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-accent/10 border border-accent/20 mb-1">
                <span className="text-xs font-semibold text-accent">
                  {campaignInfo.badgeText} {campaignInfo.campaignText}
                </span>
              </div>

              {/* Campaign Price */}
              <p className="text-sm font-medium text-accent">
                {roundedPrice(campaignInfo.campaignPrice * taxRate)} {commonT('currencyPerMonth')}{' '}
                {commonT('tax.inclVat')}
              </p>

              {/* Original Price (crossed out) */}
              <p className="text-xs line-through text-secondary/50">
                {roundedPrice(campaignInfo.originalPrice * taxRate)} {commonT('currencyPerMonth')}{' '}
                {commonT('tax.inclVat')}
              </p>
            </div>
          ) : isOneTimePurchase ? (
            /* One-time purchase pricing */
            displayPrice > 0 && (
              <p className="text-sm font-medium text-secondary">
                {displayPrice} {commonT('currency')} {commonT('tax.inclVat')}
              </p>
            )
          ) : (
            /* Regular subscription pricing */
            <>
              {displayMonthlyPrice > 0 && (
                <p className="text-sm font-medium text-secondary">
                  {displayMonthlyPrice} {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                </p>
              )}
              {displaySetupFee > 0 && (
                <p
                  className={`text-xs text-secondary/80 ${
                    displayMonthlyPrice > 0 ? 'mt-0.5' : 'text-sm font-medium text-secondary'
                  }`}
                >
                  {displayMonthlyPrice > 0 ? '+ ' : ''}
                  {displaySetupFee} {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </BaseCartItem>
  );
};
