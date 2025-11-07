'use client';

import React, { lazy, Suspense, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/hooks/useCart';
import { roundedPrice } from '@/lib/utils/formatting';
import { getCampaignPricingDisplay } from '@/lib/utils/campaignPricing';
import { CartSkeleton } from '@/components/skeletons';

// Lazy load heavy cart components for better performance
const CartItemRenderer = lazy(() => import('@/components/cart/CartItemRenderer').then(module => ({ default: module.CartItemRenderer })));
const ShoppingBagIcon = lazy(() => import('@heroicons/react/20/solid').then(module => ({ default: module.ShoppingBagIcon })));
export default function CartPage() {
  const t = useTranslations('cart');
  const commonT = useTranslations('common');
  const {
    cartItems,
    taxRate,
    removeFromCart,
    updateQuantity,
    cartTotalMonthly,
    cartTotalSetup,
    monthlyPaymentBreakdown,
    isLoadingCart,
  } = useCart();

  // PERFORMANCE FIX: Preconnect to CDN for faster image loading
  useEffect(() => {
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://internetportcom.b-cdn.net';
    if (!document.head.querySelector('link[href="https://internetportcom.b-cdn.net"]')) {
      document.head.appendChild(preconnectLink);
    }
  }, []);


  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  // PERFORMANCE FIX: Reserve space for cart to prevent CLS during loading
  if (isLoadingCart) {
    return (
      <div className="bg-primary" style={{ minHeight: '80vh' }}>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
          <CartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
          {t('shoppingCartTitle')}
        </h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              {t('itemsInCartSr')}
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-12" style={{ minHeight: '400px' }}>
                <Suspense fallback={
                  <div className="mx-auto h-12 w-12 bg-secondary/10 rounded animate-pulse" />
                }>
                  <ShoppingBagIcon className="mx-auto h-12 w-12 text-secondary/50" />
                </Suspense>
                <h3 className="mt-2 text-lg font-medium text-secondary">{t('emptyCartTitle')}</h3>
                <p className="mt-1 text-sm text-secondary/80">{t('emptyCartSubtitle')}</p>
                <div className="mt-6">
                  <Link
                    href="/kategori"
                    className="inline-flex items-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium text-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    {t('continueShopping')}
                  </Link>
                </div>
              </div>
            ) : (
              <ul role="list" className="divide-y divide-divider border-b border-t border-divider">
                {cartItems
                  .filter(product => {
                    // Filter out TV addons - they will be displayed within their parent TV service
                    if (product.category === 'TV' && product.rawProductData?.parent) {
                      return false;
                    }
                    return true;
                  })
                  .map((product) => (
                  <li key={product.id} className="flex py-6 sm:py-8">
                    <Suspense fallback={
                      <div className="w-full animate-pulse" style={{ minHeight: '120px' }}>
                        <div className="flex items-start space-x-4">
                          <div className="h-16 w-16 bg-secondary/10 rounded-md flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-secondary/10 rounded w-3/4" />
                            <div className="h-4 bg-secondary/10 rounded w-1/2" />
                            <div className="h-4 bg-secondary/10 rounded w-1/4" />
                            <div className="h-4 bg-secondary/10 rounded w-2/3 mt-4" />
                          </div>
                          <div className="text-right space-y-2">
                            <div className="h-4 bg-secondary/10 rounded w-16" />
                            <div className="h-4 bg-secondary/10 rounded w-12" />
                          </div>
                        </div>
                      </div>
                    }>
                      <CartItemRenderer
                        product={product}
                        cartItems={cartItems}
                        taxRate={taxRate}
                        onQuantityChange={handleQuantityChange}
                        onRemove={removeFromCart}
                      />
                    </Suspense>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {cartItems.length > 0 && (
            <section
              aria-labelledby="summary-heading"
              className="mt-10 rounded-lg bg-secondary/5 px-4 py-6 sm:p-6 lg:p-8"
              style={{ minHeight: '280px' }}
            >
              <h2 id="summary-heading" className="text-lg font-medium text-secondary">
                {t('orderSummaryTitle')}
              </h2>
              <dl className="mt-6 space-y-4">
                {/* Clean, non-repetitive order summary */}
                {cartTotalSetup > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-base font-medium text-secondary">{t('totalOneTimeCosts')}</dt>
                    <dd className="text-base font-medium text-secondary">
                      {roundedPrice(cartTotalSetup)} {commonT('currency')} {commonT('tax.inclVat')}
                    </dd>
                  </div>
                )}

                {/* Simplified monthly pricing - no campaign display in order summary */}
                {cartTotalMonthly > 0 && (
                  <div className={`flex items-center justify-between ${cartTotalSetup > 0 ? 'pt-2' : ''}`}>
                    <dt className="text-base font-medium text-secondary">{t('totalMonthlyRecurring')}</dt>
                    <dd className="text-base font-medium text-secondary">
                      {roundedPrice(cartTotalMonthly)} {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-10">
                <Link
                  href="/kassa"
                  className="block w-full rounded-md border border-transparent bg-accent px-4 py-3 text-center text-base font-medium text-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
                >
                  {t('checkoutButton')}
                </Link>
              </div>
              <div className="mt-6 text-center text-sm">
                <p>
                  {t('orText')}{' '}
                  <Link href="/kategori" className="font-medium text-accent hover:text-accent/80">
                    {t('continueShopping')}
                    <span aria-hidden="true"> →</span>
                  </Link>
                </p>
              </div>
            </section>
          )}
        </form>
      </div>
    </div>
  );
}
