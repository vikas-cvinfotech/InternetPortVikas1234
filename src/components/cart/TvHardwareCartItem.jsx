'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { roundedPrice } from '@/lib/utils/formatting';
import { BaseCartItem } from './BaseCartItem';

export const TvHardwareCartItem = ({ product, taxRate, onQuantityChange, onRemove }) => {
  const t = useTranslations('cart');
  const commonT = useTranslations('common');

  // Use the same logic as RouterCartItem to determine pricing type
  // Check for paytype in product or rawProductData
  const paytype = product.paytype || product.rawProductData?.paytype || '';
  const isOneTimePurchaseByPaytype = paytype.toLowerCase() === 'once';
  const isRegularSubscription = paytype.toLowerCase() === 'regular';

  // Handle both HostBill format (m_price, s_price) and processed format (price, setupPrice)
  // Also check rawProductData for original pricing fields
  const monthlyPriceField = parseFloat(
    product.m_price ||
      product.price ||
      product.rawProductData?.price || // Main price from rawProductData
      product.rawProductData?.m_price ||
      product.rawProductData?.m ||
      0
  );
  const setupPriceField = parseFloat(
    product.s_price ||
      product.setupPrice ||
      product.rawProductData?.s_price ||
      product.rawProductData?.s ||
      product.rawProductData?.s_setup ||
      product.rawProductData?.m_setup ||
      0
  );

  // Check if it's an installment plan based on product name
  const isInstallmentByName =
    product.name?.toLowerCase().includes('avbetalning') ||
    product.name?.toLowerCase().includes('installment');

  // For installment plans, default to 12 months if no bound period is set
  const contractPeriod =
    product.bound || product.rawProductData?.bound || (isInstallmentByName ? 12 : 0);

  // Determine actual pricing based on paytype (like RouterCartItem)
  let actualPrice = 0;
  let actualSetupPrice = 0;
  let isInstallmentPlan = false;

  if (isOneTimePurchaseByPaytype) {
    // For one-time purchases, check if price is in setup field
    if (monthlyPriceField === 0 && setupPriceField > 0) {
      actualPrice = setupPriceField;
      actualSetupPrice = 0;
    } else {
      actualPrice = monthlyPriceField || setupPriceField;
      actualSetupPrice = 0;
    }
  } else if (isRegularSubscription || monthlyPriceField > 0) {
    // Regular subscription
    actualPrice = monthlyPriceField;
    actualSetupPrice = setupPriceField;
    isInstallmentPlan = contractPeriod > 0 || isInstallmentByName;
  } else if (monthlyPriceField === 0 && setupPriceField > 0 && !isInstallmentByName) {
    // One-time product with price only in setup field
    actualPrice = setupPriceField;
    actualSetupPrice = 0;
  } else {
    // Fallback for other cases
    actualPrice = monthlyPriceField;
    actualSetupPrice = setupPriceField;
  }

  // Calculate effective prices with tax
  const displayPrice = roundedPrice(actualPrice * taxRate);
  const displaySetupPrice = roundedPrice(actualSetupPrice * taxRate);

  return (
    <BaseCartItem
      product={product}
      taxRate={taxRate}
      onQuantityChange={onQuantityChange}
      onRemove={onRemove}
      showQuantityControls={true}
    >
      {/* Product Name and Details */}
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

          {/* Additional TV hardware information */}
          {product.friendlydescription && (
            <p className="mt-2 text-xs text-secondary/60 line-clamp-2">
              {product.friendlydescription}
            </p>
          )}

          {/* Contract terms and payment type info */}
          <div className="mt-1 text-xs text-secondary/70 space-y-1">
            {isInstallmentPlan && (
              <>
                <p>{`${contractPeriod || 12} ${t('router.monthsBound')}`}</p>
              </>
            )}
          </div>
        </div>

        {/* Pricing summary on the right for larger screens */}
        <div className="mt-1 text-left sm:text-right sm:mt-0">
          {isInstallmentPlan ? (
            <div>
              <p className="text-sm font-medium text-secondary">
                {displayPrice} {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
              </p>
              {displaySetupPrice > 0 && (
                <p className="text-xs text-secondary/80 mt-0.5">
                  + {displaySetupPrice} {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-secondary">
                {displayPrice} {commonT('currency')} {commonT('tax.inclVat')}
              </p>
            </div>
          )}
        </div>
      </div>
    </BaseCartItem>
  );
};
