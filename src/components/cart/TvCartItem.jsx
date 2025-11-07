'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { roundedPrice } from '@/lib/utils/formatting';
import { BaseCartItem } from './BaseCartItem';
import useLoadingState from '@/hooks/useLoadingState';

export const TvCartItem = ({ product, cartItems, taxRate, onQuantityChange, onRemove }) => {
  const commonT = useTranslations('common');
  const cartT = useTranslations('cart');
  const locale = useLocale();
  // Get addons directly from the product's addons array (already stored in cart)
  const relatedAddons = product.addons || [];

  // Calculate total monthly price including addons
  const baseMonthlyPrice = parseFloat(product.m_price) || 0;
  const addonsMonthlyPrice = relatedAddons.reduce((total, addon) => {
    return total + parseFloat(addon.m_price) * addon.qty;
  }, 0);
  const totalMonthlyPrice = (baseMonthlyPrice + addonsMonthlyPrice) * taxRate;

  // Calculate setup prices
  const baseSetupPrice = parseFloat(product.s_price) || 0;
  const addonsSetupPrice = relatedAddons.reduce((total, addon) => {
    return total + parseFloat(addon.s_price) * addon.qty;
  }, 0);
  const totalSetupPrice = (baseSetupPrice + addonsSetupPrice) * taxRate;

  return (
    <BaseCartItem
      product={product}
      taxRate={taxRate}
      onQuantityChange={onQuantityChange}
      onRemove={onRemove}
      showQuantityControls={false} // TV services don't support quantity changes
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

          {/* TV service details */}
          <div className="mt-1 space-y-1 text-xs text-secondary/70">
            {/* City network info */}
            {(product.config?.stadsnat || product.config?.stadsnet || product.cityNet) && (
              <div>
                <span className="font-medium">{locale === 'sv' ? 'Stadsnät' : 'Citynet'}: </span>
                {product.config?.stadsnat || product.config?.stadsnet || product.cityNet}
              </div>
            )}

            {/* Service terms */}
            {/* Always show 1 month notice period for recurring TV services */}
            <p>{commonT('noticePeriod', { count: 1 })}</p>
            {product.bound > 0 && <p>{commonT('bindingPeriod', { count: product.bound })}</p>}

            {/* Base service channels */}
            {product.rawProductData?.meta?.channels && (
              <div className="mt-2">
                <p className="font-medium text-secondary/80 mb-1">
                  {cartT('tv.baseChannels', { count: product.rawProductData.meta.channels.length })}
                  :
                </p>
                <div className="flex flex-wrap gap-1">
                  {product.rawProductData.meta.channels.slice(0, 8).map((channel) => (
                    <img
                      key={channel.name}
                      src={channel.src}
                      alt={channel.name}
                      className="w-6 h-auto object-contain"
                      title={channel.name}
                    />
                  ))}
                  {product.rawProductData.meta.channels.length > 8 && (
                    <span className="text-xs text-secondary/60 flex items-center ml-1">
                      +{product.rawProductData.meta.channels.length - 8} {cartT('tv.moreChannels')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Addons section */}
            {relatedAddons.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-secondary/80 mb-1">
                  {locale === 'sv' ? 'Tillägg' : 'Addons'}:
                </p>
                <div className="space-y-1">
                  {relatedAddons.map((addon) => (
                    <div key={addon.id} className="text-xs text-secondary/90">
                      {addon.qty} X {addon.name} -{' '}
                      {roundedPrice(parseFloat(addon.m_price) * taxRate)}{' '}
                      {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing display - Base service only */}
        <div className="mt-1 text-left sm:text-right sm:mt-0">
          <div>
            <p className="text-sm font-medium text-secondary">
              {roundedPrice(baseMonthlyPrice * taxRate)} {commonT('currencyPerMonth')}{' '}
              {commonT('tax.inclVat')}
            </p>
          </div>
          {baseSetupPrice > 0 && (
            <p className="text-xs text-secondary/80 mt-0.5">
              + {roundedPrice(baseSetupPrice * taxRate)} {commonT('currencySetupFee')}{' '}
              {commonT('tax.inclVat')}
            </p>
          )}
        </div>
      </div>
    </BaseCartItem>
  );
};
