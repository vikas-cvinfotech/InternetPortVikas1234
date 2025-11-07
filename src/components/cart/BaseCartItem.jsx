'use client';

import React from 'react';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/20/solid';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export const BaseCartItem = ({
  product,
  taxRate,
  onQuantityChange,
  onRemove,
  children,
  showQuantityControls = true,
}) => {
  const t = useTranslations('cart');
  const categoryT = useTranslations('categoryIcons');
  const params = useParams();
  const locale = params?.locale || 'sv';

  // Helper function to get the category slug for URL
  const getCategorySlug = (product) => {
    const category = product.category?.toLowerCase();
    const categoryType = product.categoryType?.toLowerCase();

    // Map categories to their URL slugs
    const categoryMapping = {
      bredband: 'bredband',
      broadband: 'bredband',
      tv: 'tv',
      tv_hardware: 'tv',
      'ip-telefoni': 'telefoni',
      telephony: 'telefoni',
      telephony_hardware: 'telefoni',
      router: 'bredband', // Routers are under broadband category
      hosting: 'hosting',
      vpn: 'vpn',
      säkerhet: 'sakerhet',
      security: 'sakerhet',
    };

    // Check categoryType first, then category
    const key = categoryType || category || '';
    return categoryMapping[key] || 'produkter';
  };

  // Generate product URL
  const getProductUrl = (product) => {
    // Use the saved productUrl if it exists
    if (product.productUrl) {
      return product.productUrl;
    }

    // Fallback: generate URL if not saved
    // Special handling for broadband services - they use a different URL pattern
    if (product.category === 'Bredband' && product.config?.id) {
      return `/bredband?id=${encodeURIComponent(product.config.id)}`;
    }

    const categorySlug = getCategorySlug(product);
    const productId = product.id || product.hb_product_id;

    if (!productId) return null;

    return `/kategori/${categorySlug}/${productId}`;
  };

  // Determine if quantity controls should be shown for this product
  const shouldShowQuantityControls = (product) => {
    const categoryType = product.categoryType?.toUpperCase();

    // Special products that should NOT allow quantity changes:
    // - BROADBAND services
    // - TV services (base packages and add-ons, but not hardware)
    // - TELEPHONY services (IP-telefoni services, but not hardware)
    const noQuantityCategories = ['BROADBAND', 'TV', 'TELEPHONY'];

    if (noQuantityCategories.includes(categoryType)) {
      return false;
    }

    // Also check by product name patterns for extra safety
    const productName = product.name?.toLowerCase() || '';
    const noQuantityPatterns = [
      'bredband',
      'broadband',
      'tv-baspaket',
      'tv baspaket',
      'ip-telefoni',
      'ip telefoni',
      'telefoni abonnemang',
      'telephony subscription',
    ];

    return !noQuantityPatterns.some((pattern) => productName.includes(pattern));
  };

  // Translate category display names
  const getCategoryDisplayName = (category, categoryType) => {
    // Use categoryType first if available (more specific), fallback to category
    const key = categoryType?.toLowerCase() || category?.toLowerCase();

    switch (key) {
      case 'router':
        // Routers are part of broadband category
        return categoryT('broadband') || 'Broadband';
      case 'broadband':
      case 'bredband':
        return categoryT('broadband') || 'Bredband';
      case 'tv':
      case 'tv_hardware':
        return categoryT('tv') || 'TV';
      case 'telephony':
      case 'telephony_hardware':
      case 'telefoni': // Add Swedish category name
        return categoryT('telephony') || 'Telefoni';
      case 'säkerhet':
      case 'security':
        return categoryT('security') || 'Säkerhet';
      case 'hosting':
        return categoryT('hosting') || 'Hosting';
      case 'standard':
        // Check if this is actually a telephony product based on category name
        if (category === 'Telefoni') {
          return categoryT('telephony') || 'Telefoni';
        }
        // Check if this is actually a security product based on category name
        if (category === 'Säkerhet') {
          return categoryT('security') || 'Säkerhet';
        }
        return category || 'Produkt';
      default:
        return category || 'Produkt';
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = product.quantity + change;
    if (newQuantity <= 0) {
      onRemove(product.id);
    } else {
      onQuantityChange(product.id, product.quantity, change);
    }
  };

  return (
    <>
      {/* Product Image */}
      <div className="shrink-0">
        {product.imageSrc ? (
          <Image
            alt={product.imageAlt || product.name}
            src={product.imageSrc}
            width={128}
            height={128}
            sizes="(max-width: 640px) 96px, 128px"
            className="size-24 rounded-md object-cover object-center sm:size-32"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-accent text-center sm:size-20">
            <span className="px-1 py-2 text-[10px] sm:text-xs font-medium text-primary leading-tight">
              {getCategoryDisplayName(product.category, product.categoryType)}
            </span>
          </div>
        )}
      </div>

      {/* Product Details - delegated to category-specific component */}
      <div className="ml-4 flex flex-1 flex-col sm:ml-6">
        {children}

        {/* Quantity Controls and Remove Button */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          {/* Quantity controls for applicable products */}
          {showQuantityControls &&
            shouldShowQuantityControls(product) &&
            product.quantity !== undefined && (
              <div className="w-full sm:w-auto">
                <div className="flex max-w-min items-center rounded-md border border-divider">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="rounded-l-md p-1.5 text-secondary hover:text-accent disabled:opacity-50"
                    disabled={product.quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                    <span className="sr-only">Decrease quantity</span>
                  </button>
                  <span className="border-x border-divider px-2 text-sm text-secondary">
                    {product.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="rounded-r-md p-1.5 text-secondary hover:text-accent"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span className="sr-only">Increase quantity</span>
                  </button>
                </div>
              </div>
            )}

          {/* Remove button */}
          <div className="mt-4 sm:ml-auto sm:mt-0">
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="flex items-center text-sm font-medium text-accent hover:text-accent/80"
            >
              <XMarkIcon className="mr-1 h-5 w-5 sm:hidden" />
              <span>{t('removeButton')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
