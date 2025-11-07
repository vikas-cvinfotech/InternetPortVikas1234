'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { roundedPrice } from '@/lib/utils/formatting';
import { BaseCartItem } from './BaseCartItem';
import useLoadingState from '@/hooks/useLoadingState';
import { sanitizeText } from '@/lib/utils/sanitization';
import { getNewNumberAddonId, getPortNumberAddonId } from '@/config/telephonyAddons';

export const TelephonyCartItem = ({ product, cartItems, taxRate, onQuantityChange, onRemove }) => {
  const commonT = useTranslations('common');
  const cartT = useTranslations('cart');
  const telephonyT = useTranslations('telephony.form');
  const locale = useLocale();
  // Get addons directly from the product's addons array (already stored in cart)
  const relatedAddons = product.addons || [];

  // Calculate base service pricing (excluding addons)
  const baseMonthlyPrice = parseFloat(product.m_price || product.rawProductData?.m_price) || 0;
  const baseSetupPrice = parseFloat(product.s_price || product.rawProductData?.s_price) || 0;

  // Get service type and number option details from config
  const serviceType = product.config?.serviceType || '';
  const numberOption = product.config?.numberOption || '';
  const phoneNumber = product.config?.phoneNumber || '';
  const associatedOrgPersonNr = product.config?.associatedOrgPersonNr || '';
  const hardwareType = product.config?.hardwareType || '';

  // Helper function to get addon name based on ID
  const getAddonName = (addonId) => {
    const id = parseInt(addonId);
    if (id === getPortNumberAddonId()) {
      return cartT('telephony.phoneOptions.keep.label');
    } else if (id === getNewNumberAddonId()) {
      return cartT('telephony.phoneOptions.new.label');
    } else {
      return `Addon ${addonId}`;
    }
  };

  // Helper function to get addon pricing display
  const getAddonPricing = (addon) => {
    // For telephony addons, use the pricing from rawProductData phoneOptions
    const addonId = parseInt(addon.id);
    const phoneOptions = product.rawProductData?.phoneOptions || [];

    // Port Number addon - "Keep existing number"
    if (addonId === getPortNumberAddonId()) {
      const keepOption = phoneOptions.find((opt) => opt.value === 'keep_existing');
      if (keepOption && keepOption.setupPrice) {
        const basePrice = keepOption.setupPrice / taxRate; // Convert from incl VAT to excl VAT
        return `${roundedPrice(basePrice * taxRate)} ${commonT('currency')} ${commonT(
          'tax.inclVat'
        )}`;
      }
      // Fallback price from product page
      const fallbackPrice = 295 / taxRate; // 295kr incl VAT
      return `${roundedPrice(fallbackPrice * taxRate)} ${commonT('currency')} ${commonT(
        'tax.inclVat'
      )}`;
    }

    // New Number addon - "Get new number"
    if (addonId === getNewNumberAddonId()) {
      const newOption = phoneOptions.find((opt) => opt.value === 'new_number');
      if (newOption && newOption.monthlyPrice) {
        const basePrice = newOption.monthlyPrice / taxRate; // Convert from incl VAT to excl VAT
        return `${roundedPrice(basePrice * taxRate)} ${commonT('currencyPerMonth')} ${commonT(
          'tax.inclVat'
        )}`;
      }
      // Fallback price from product page
      const fallbackPrice = 29 / taxRate; // 29kr incl VAT
      return `${roundedPrice(fallbackPrice * taxRate)} ${commonT('currencyPerMonth')} ${commonT(
        'tax.inclVat'
      )}`;
    }

    // Fallback for any other addons
    return locale === 'sv' ? 'Gratis' : 'Free';
  };

  // Get the full hardware data by fetching it from the API or finding it in cart items
  const getHardwareData = async (hardwareType) => {
    if (!hardwareType) return null;

    // First check if there's a separate hardware cart item for this hardware type
    const hardwareCartItems = cartItems.filter(
      (item) =>
        item.category === 'IP-telefoni' &&
        item.categoryType === 'TELEPHONY_HARDWARE' &&
        item.config?.hardwareType === hardwareType
    );

    if (hardwareCartItems.length > 0) {
      return hardwareCartItems[0];
    }

    // If no separate cart item, we need to fetch the hardware data from the API
    // This is the same logic as in TelephonyServiceProductStrategy
    try {
      const languageId = locale === 'sv' ? 9 : 2;

      // Import the telephony config to get hardware product IDs
      const { telephonyHardwareOptions, getTelephonyHardwareId } = await import(
        '@/config/telephonyProducts'
      );

      const hardware = telephonyHardwareOptions.find((hw) => hw.id === hardwareType);
      if (!hardware) return null;

      const productId = getTelephonyHardwareId(hardware.id);
      if (!productId) return null;

      const response = await fetch(
        `/api/hostbill/get-product?id=${productId}&language_id=${languageId}`
      );
      const data = await response.json();

      if (data.success !== false && data.product) {
        return {
          ...hardware,
          productData: data.product,
          name: data.product.name,
          price:
            data.product.m_price || data.product.m || data.product.s_price || data.product.s_setup,
        };
      }
    } catch (error) {
      // Handle error silently
    }

    return null;
  };

  // State for hardware data
  const [hardwareData, setHardwareData] = useState(null);

  // Use stored hardware data or fallback to API fetch for backwards compatibility
  useEffect(() => {
    if (!hardwareType) {
      setHardwareData(null);
      return;
    }

    // First, try to use stored hardware data (new cart items will have this)
    const storedHardwareData = product.config?.hardwareData;
    if (storedHardwareData) {
      setHardwareData(storedHardwareData);
      return;
    }

    // Fallback: fetch hardware data for existing cart items that don't have stored data
    const fetchHardwareData = async () => {
      const data = await getHardwareData(hardwareType);
      setHardwareData(data);
    };

    fetchHardwareData();
  }, [hardwareType, cartItems, locale, product.config?.hardwareData]);

  // Helper function to get equipment pricing display
  const getEquipmentPricing = (hardwareInfo) => {
    if (hardwareInfo) {
      // Try to get price from the hardware product data
      const price =
        hardwareInfo.productData?.m_price ||
        hardwareInfo.productData?.m ||
        hardwareInfo.productData?.s_price ||
        hardwareInfo.productData?.s_setup ||
        hardwareInfo.price;

      if (price) {
        const basePrice = parseFloat(price);
        return `${roundedPrice(basePrice * taxRate)} ${commonT('currency')} ${commonT(
          'tax.inclVat'
        )}`;
      }
    }

    // Fallback pricing based on known hardware types
    const equipmentPricing = {
      grandstream: 520, // 650kr including VAT / 1.25 = 520kr base
      gigaset: 1000, // 1250kr including VAT / 1.25 = 1000kr base
      yealink: 400,
      snom: 350,
    };

    const equipmentKey = hardwareType?.toLowerCase() || '';
    const basePrice = equipmentPricing[equipmentKey] || 200;

    return `${roundedPrice(basePrice * taxRate)} ${commonT('currency')} ${commonT('tax.inclVat')}`;
  };

  // Helper function to get equipment name using the same translation keys as product page
  const getEquipmentName = (hardwareInfo) => {
    // Use the same translation approach as the product page EquipmentSelection component
    // The product page uses: t(`steps.step3.hardwareOptions.${hardware.id}.name`)
    if (hardwareType) {
      try {
        const translationKey = `steps.step3.hardwareOptions.${hardwareType}.name`;
        const translatedName = telephonyT(translationKey);

        // Check if we got a valid translation (not the key itself)
        if (translatedName && translatedName !== translationKey) {
          return translatedName;
        }
      } catch (error) {
        // Translation not found, continue to fallback
      }
    }

    // Fallback to API data if translation not found
    if (hardwareInfo) {
      const productCode =
        hardwareInfo.productData?.code ||
        hardwareInfo.productData?.product_code ||
        hardwareInfo.code;
      if (productCode) {
        return productCode;
      }

      // Fallback to name if no product code
      return hardwareInfo.productData?.name || hardwareInfo.name || 'Unknown Equipment';
    }

    // Final fallback names
    const equipmentNames = {
      grandstream: 'Grandstream HT801 ATA-box',
      gigaset: 'Gigaset A690 IP',
      yealink: 'Yealink T46S',
      snom: 'Snom D717',
    };

    const equipmentKey = hardwareType?.toLowerCase() || '';
    return equipmentNames[equipmentKey] || hardwareType || 'Unknown Equipment';
  };

  return (
    <BaseCartItem
      product={product}
      taxRate={taxRate}
      onQuantityChange={onQuantityChange}
      onRemove={onRemove}
      showQuantityControls={false} // Telephony services don't support quantity changes
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

          {/* Telephony service details */}
          <div className="mt-1 space-y-1 text-xs text-secondary/70">
            {/* Phone number configuration */}
            {phoneNumber && (
              <div>
                <span className="font-medium">
                  {locale === 'sv' ? 'Telefonnummer' : 'Phone Number'}:{' '}
                </span>
                {sanitizeText(phoneNumber)}
                {numberOption === 'keep' && (
                  <span className="ml-1 text-secondary/60">
                    ({locale === 'sv' ? 'Portering' : 'Porting'})
                  </span>
                )}
                {numberOption === 'new' && (
                  <span className="ml-1 text-secondary/60">
                    ({locale === 'sv' ? 'Nytt nummer' : 'New number'})
                  </span>
                )}
              </div>
            )}

            {/* Associated org number for porting */}
            {associatedOrgPersonNr && (
              <div>
                <span className="font-medium">
                  {locale === 'sv' ? 'Organisations-/personnummer' : 'Organization/Personal Number'}
                  :{' '}
                </span>
                {associatedOrgPersonNr}
              </div>
            )}

            {/* Service terms */}
            {/* Always show 1 month notice period for recurring telephony services */}
            <p>{commonT('noticePeriod', { count: 1 })}</p>
            {product.bound > 0 && <p>{commonT('bindingPeriod', { count: product.bound })}</p>}

            {/* Hardware section */}
            {hardwareType && (
              <div className="mt-3">
                <p className="font-medium text-secondary/80 mb-1">
                  {locale === 'sv' ? 'Utrustning' : 'Equipment'}:
                </p>
                <div className="space-y-1">
                  <div className="text-xs text-secondary/90">
                    1 X {getEquipmentName(hardwareData)} - {getEquipmentPricing(hardwareData)}
                  </div>
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
                      {addon.qty} X {getAddonName(addon.id)} - {getAddonPricing(addon)}
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
