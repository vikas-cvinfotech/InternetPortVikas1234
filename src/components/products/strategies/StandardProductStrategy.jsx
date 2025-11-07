
import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PriceDisplay } from '@/components/tax/PriceDisplay';
import AddToCartButton from '../AddToCartButton';
import ProductStrategyErrorBoundary from '../ProductStrategyErrorBoundary';
import CartErrorBoundary from '../CartErrorBoundary';
import { getCampaignPricingDisplay } from '@/lib/utils/campaignPricing';
import { parseProductPricing, getBillingPeriodSuffix } from '@/lib/utils/productPricing';

export default function StandardProductStrategy({ 
  product, 
  onAdd
}) {
  const tCommon = useTranslations('common');
  const locale = useLocale();

  if (!product) return null;

  // Check for campaign pricing first
  const campaignInfo = getCampaignPricingDisplay(product, locale);
  
  // Use centralized pricing logic
  const pricingInfo = parseProductPricing(product);

  const handleAddToCart = () => {
    if (onAdd) {
      return onAdd(product.id, {
        quantity: 1,
        rawProductData: product,
      });
    }
  };



  return (
    <ProductStrategyErrorBoundary 
      productName={product?.name} 
      productType="standard"
    >
      <div className="space-y-6">
      {/* Pricing Section */}
      <div className="space-y-4">
        {campaignInfo ? (
          /* Campaign pricing display */
          <div className="space-y-3">
            {/* Campaign Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-sm font-semibold text-accent">
                {campaignInfo.badgeText} {campaignInfo.campaignText}
              </span>
            </div>
            
            {/* Campaign Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-accent">
                <PriceDisplay 
                  basePrice={campaignInfo.campaignPrice} 
                  showTaxSuffix={true}
                  locale={locale}
                />
              </span>
              <span className="text-lg text-secondary/70">
                {tCommon('currencyPerMonth')}
              </span>
            </div>
            
            {/* Original Price (crossed out) */}
            <div className="flex items-baseline space-x-2">
              <span className="text-xl line-through text-secondary/50">
                <PriceDisplay 
                  basePrice={campaignInfo.originalPrice} 
                  showTaxSuffix={true}
                  locale={locale}
                />
              </span>
              <span className="text-sm text-secondary/50">
                {tCommon('currencyPerMonth')}
              </span>
            </div>
          </div>
        ) : pricingInfo.isOneTime ? (
          /* One-time purchase - just show price cleanly */
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-secondary">
              <PriceDisplay 
                basePrice={pricingInfo.primaryPrice} 
                showTaxSuffix={true}
                locale={locale}
              />
            </span>
          </div>
        ) : (
          /* Regular subscription */
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-secondary">
              <PriceDisplay 
                basePrice={pricingInfo.primaryPrice} 
                showTaxSuffix={true}
                locale={locale}
              />
            </span>
            <span className="text-lg text-secondary/70">
              {getBillingPeriodSuffix(pricingInfo.billingPeriod, tCommon)}
            </span>
          </div>
        )}

        {/* Setup Fee (only show for subscriptions) */}
        {!pricingInfo.isOneTime && pricingInfo.setupPrice > 0 && (
          <div className="text-sm text-secondary/70">
            + <PriceDisplay basePrice={pricingInfo.setupPrice} showTaxSuffix={false} showCurrency={false} locale={locale} />{' '}
            {tCommon('currencySetupFee')} {tCommon('tax.inclVat')}
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <CartErrorBoundary>
        <div className="pt-4">
          <AddToCartButton
            onAdd={handleAddToCart}
          />
        </div>
      </CartErrorBoundary>
      </div>
    </ProductStrategyErrorBoundary>
  );
}
