'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder';
import { useCart } from '@/hooks/useCart';
import { useTranslations } from 'next-intl';
import {
  XCircleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@/i18n/routing';
import { formatAddressForDisplay, roundedPrice } from '@/lib/utils/formatting';
import { getCampaignPricingDisplay } from '@/lib/utils/campaignPricing';
import { sanitizeText } from '@/lib/utils/sanitization';
import { getNewNumberAddonId, getPortNumberAddonId } from '@/config/telephonyAddons';
import { isTelephonyMonthlyBoundHardware } from '@/config/telephonyProducts';

// Enhanced Loading Component
function EnhancedLoadingDisplay({ loadingT, apiProgress = 'started' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showEstimate, setShowEstimate] = useState(false);
  const [startTime] = useState(Date.now());

  const steps = [
    { key: 'verifying', icon: ShieldCheckIcon, minDuration: 800 },
    { key: 'processing', icon: CreditCardIcon, minDuration: 1200 },
    { key: 'creating', icon: DocumentCheckIcon, minDuration: 800 },
    { key: 'finalizing', icon: CheckCircleIcon, minDuration: 600 },
  ];

  useEffect(() => {
    // Show time estimate after 2 seconds (reduced from 3)
    const estimateTimer = setTimeout(() => setShowEstimate(true), 2000);

    return () => clearTimeout(estimateTimer);
  }, []);

  useEffect(() => {
    // Progress through steps with minimum duration but responsive to API
    const progressSteps = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      // Calculate which step we should be on based on elapsed time and API progress
      let targetStep = 0;

      if (apiProgress === 'completed') {
        // API is done, move to final steps quickly
        targetStep = steps.length - 1;
      } else {
        // Progress naturally based on time, but don't get ahead of a reasonable pace
        const timeBasedStep = Math.min(
          Math.floor(elapsedTime / 1000), // One step per second as baseline
          steps.length - 2 // Don't auto-complete the final step
        );
        targetStep = timeBasedStep;
      }

      if (targetStep > currentStepIndex) {
        // Complete current step and move to next
        setCompletedSteps((prev) => new Set([...prev, currentStepIndex]));
        setCurrentStepIndex(targetStep);
      }
    };

    const stepTimer = setInterval(progressSteps, 300); // Check every 300ms

    return () => clearInterval(stepTimer);
  }, [currentStepIndex, apiProgress, startTime, steps.length]);

  const currentStep = steps[currentStepIndex];
  const CurrentIcon = currentStep?.icon;

  return (
    <div className="text-center max-w-md mx-auto">
      {/* Main Loading Animation */}
      <div className="relative mb-8">
        {/* Background Circle */}
        <div className="w-24 h-24 mx-auto rounded-full bg-secondary/5 border-4 border-secondary/15 flex items-center justify-center relative overflow-hidden">
          {/* Rotating Border Animation */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-secondary/60 animate-spin motion-reduce:animate-none" />

          {/* Icon Container */}
          <div className="relative z-10">
            {CurrentIcon && (
              <CurrentIcon className="h-10 w-10 text-accent transition-all duration-300 animate-pulse motion-reduce:animate-none" />
            )}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.key}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-accent scale-110'
                    : isCurrent
                    ? 'bg-accent/70 animate-pulse motion-reduce:animate-none'
                    : 'bg-secondary/20'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Status Messages */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-secondary">{loadingT('title')}</h1>

        <div className="space-y-2">
          <p className="text-lg font-medium text-secondary/90 min-h-[1.75rem]">
            {currentStep && loadingT(`steps.${currentStep.key}.title`)}
          </p>

          <p className="text-sm text-secondary/70 min-h-[1.25rem]">
            {currentStep && loadingT(`steps.${currentStep.key}.description`)}
          </p>
        </div>

        {/* Time Estimate */}
        {showEstimate && (
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 opacity-0 animate-fade-in motion-reduce:opacity-100">
            <div className="w-1.5 h-1.5 rounded-full bg-accent mr-2 animate-pulse motion-reduce:animate-none" />
            <span className="text-xs text-secondary/60">{loadingT('estimatedTime')}</span>
          </div>
        )}

        {/* Security Reassurance */}
        <div className="flex items-center justify-center space-x-2 text-xs text-secondary/50 mt-6">
          <ShieldCheckIcon className="h-4 w-4" />
          <span>{loadingT('securityMessage')}</span>
        </div>

        {/* Progress Steps List (for screen readers) */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {currentStep && loadingT(`steps.${currentStep.key}.title`)} -{' '}
          {currentStep && loadingT(`steps.${currentStep.key}.description`)}
        </div>
      </div>

      {/* Custom animations with motion-reduce support */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out forwards;
        }

        /* Respect user motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-spin,
          .animate-pulse,
          .animate-fade-in {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function StatusDisplay({ status, onRetry, apiProgress }) {
  const t = useTranslations('confirmation');
  const loadingT = useTranslations('confirmation.loading');

  if (status === 'loading') {
    return <EnhancedLoadingDisplay loadingT={loadingT} apiProgress={apiProgress} />;
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <XCircleIcon className="mx-auto h-12 w-12 text-failure" />
        <h1 className="mt-4 text-2xl font-bold text-secondary">{t('errorTitle')}</h1>
        <p className="mt-2 text-secondary/70">{t('errorSubtitle')}</p>
        <p className="mt-4 text-sm text-secondary/70">{t('genericErrorText')}</p>
        <div className="mt-6">
          <button
            onClick={onRetry}
            className="inline-flex items-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium text-primary shadow-sm hover:opacity-90"
          >
            {t('retryButton')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { orderDetails, clearOrderDetails } = useOrder();
  const { clearCart } = useCart();
  const t = useTranslations('confirmation');
  const commonT = useTranslations('common');
  const categoryT = useTranslations('categoryIcons');

  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState(null);
  const [orderResponse, setOrderResponse] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [apiProgress, setApiProgress] = useState('started');
  const hasPlacedOrder = useRef(false);

  // Translate category display names (same logic as checkout page)
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
      case 'telefoni':
      case 'ip-telefoni':
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

  useEffect(() => {
    if (orderDetails && !hasPlacedOrder.current) {
      hasPlacedOrder.current = true;
      setConfirmedOrder(orderDetails);

      const placeOrder = async (orderPayload) => {
        setStatus('loading');
        setError(null);
        setApiProgress('started');

        try {
          // Get CSRF token from sessionStorage (already fetched at checkout)
          let csrfToken = sessionStorage.getItem('csrf-token');

          if (!csrfToken) {
            // Fallback: fetch new token if missing
            const csrfResponse = await fetch('/api/csrf');
            const csrfData = await csrfResponse.json();
            csrfToken = csrfData.token;
          }

          const response = await fetch('/api/internetport/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-csrf-token': csrfToken, // Include CSRF token in header
            },
            body: JSON.stringify(orderPayload),
          });

          // API call completed - signal to UI that we can finish up
          setApiProgress('completed');

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'An unknown error occurred.');
          }
          clearCart();

          setOrderResponse(data);

          // Small delay to let final step animation complete
          setTimeout(() => {
            setStatus('success');
          }, 800);
        } catch (err) {
          setError(err.message);
          setStatus('error');
        } finally {
          clearOrderDetails();
        }
      };
      placeOrder(orderDetails);
    } else if (status === 'initializing' && orderDetails === null) {
      router.replace('/kassa');
    }
  }, [orderDetails, clearOrderDetails, router, status, clearCart]);

  if (status !== 'success' || !confirmedOrder) {
    return (
      <div className="bg-primary text-secondary flex min-h-screen items-start justify-center px-4 pt-24">
        <StatusDisplay
          status={status}
          onRetry={() => window.location.reload()}
          apiProgress={apiProgress}
        />
      </div>
    );
  }

  const { customerDetails, paymentDetails, cart } = confirmedOrder;

  return (
    <div className="bg-primary">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="mt-4 text-base font-medium text-accent">{t('successHeading')}</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight text-secondary sm:text-5xl">
            {t('successTitle')}
          </p>
          <p className="mt-2 text-base text-secondary/80">
            {t('successSubtitle', { orderId: orderResponse?.orderId || 'N/A' })}
          </p>
        </div>

        <section className="mt-10 border-t border-divider">
          <h2 className="sr-only">{t('orderSummaryTitle')}</h2>
          <h3 className="sr-only">{t('itemsTitle')}</h3>
          {cart.items.map((product) => (
            <div key={product.id} className="flex space-x-4 border-b border-divider py-10">
              <div className="w-20 shrink-0">
                {product.imageSrc ? (
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt || product.name}
                    className="w-20 rounded-md"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-accent text-center sm:size-20">
                    <span className="px-1 py-2 text-[10px] sm:text-xs font-medium text-primary leading-tight">
                      {getCategoryDisplayName(product.category, product.categoryType)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-secondary">{product.name}</h4>
                      {product.quantity > 1 && (
                        <span className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                          {commonT('quantityWithValue', { quantity: product.quantity })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Broadband/Router category - with proper pricing logic */}
                  {product.category === 'Bredband' &&
                    (() => {
                      // Check if this is a router product
                      const isRouter =
                        product.categoryType === 'ROUTER' ||
                        product.name?.toLowerCase().includes('router') ||
                        product.rawProductData?.name?.toLowerCase().includes('router');

                      // Handle router pricing logic
                      if (isRouter) {
                        const paytype = product.paytype || product.rawProductData?.paytype || '';
                        const isOneTimePurchaseByPaytype = paytype.toLowerCase() === 'once';

                        // Check multiple fields for pricing data
                        const monthlyPriceField = parseFloat(
                          product.m_price ||
                            product.price ||
                            product.rawProductData?.price ||
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
                            product.rawProductData?.m_setup || // Router Wap Ax price is here
                            0
                        );

                        // Check if it's an installment plan
                        const isInstallmentByName =
                          product.name?.toLowerCase().includes('avbetalning') ||
                          product.name?.toLowerCase().includes('installment');

                        let actualPrice = 0;
                        let actualSetupPrice = 0;
                        let isInstallmentPlan = false;
                        const contractPeriod =
                          product.bound ||
                          product.rawProductData?.bound ||
                          (isInstallmentByName ? 12 : 0);

                        if (isOneTimePurchaseByPaytype) {
                          // For one-time purchases, check if price is in setup field
                          if (monthlyPriceField === 0 && setupPriceField > 0) {
                            actualPrice = setupPriceField;
                            actualSetupPrice = 0;
                          } else {
                            actualPrice = monthlyPriceField || setupPriceField;
                            actualSetupPrice = 0;
                          }
                        } else if (monthlyPriceField > 0) {
                          // Regular subscription or installment
                          actualPrice = monthlyPriceField;
                          actualSetupPrice = setupPriceField;
                          isInstallmentPlan = contractPeriod > 0 || isInstallmentByName;
                        } else if (
                          monthlyPriceField === 0 &&
                          setupPriceField > 0 &&
                          !isInstallmentByName
                        ) {
                          // One-time product with price only in setup field
                          actualPrice = setupPriceField;
                          actualSetupPrice = 0;
                        }

                        return (
                          <div className="mt-1 space-y-1">
                            {isOneTimePurchaseByPaytype ? (
                              /* One-time purchase pricing */
                              actualPrice > 0 && (
                                <div className="text-sm text-secondary/70">
                                  {roundedPrice(actualPrice * cart.taxRate)} {commonT('currency')}{' '}
                                  {commonT('tax.inclVat')}
                                </div>
                              )
                            ) : (
                              /* Regular subscription or installment pricing */
                              <>
                                {actualPrice > 0 && (
                                  <div className="text-sm text-secondary/70">
                                    {roundedPrice(actualPrice * cart.taxRate)}{' '}
                                    {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                  </div>
                                )}
                                {actualSetupPrice > 0 && (
                                  <div className="text-xs text-secondary/70">
                                    + {roundedPrice(actualSetupPrice * cart.taxRate)}{' '}
                                    {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                                  </div>
                                )}
                                {/* Display binding period for installment plans */}
                                {contractPeriod > 0 && (
                                  <div className="text-xs text-secondary/70">
                                    {commonT('bindingPeriod', { count: contractPeriod })}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      }

                      // Regular broadband product pricing
                      const monthlyPrice = parseFloat(
                        product.m_price || product.rawProductData?.m_price || 0
                      );
                      const setupFee = parseFloat(
                        product.s_price || product.rawProductData?.s_price || 0
                      );

                      return (
                        <div className="mt-1 space-y-1">
                          {monthlyPrice > 0 && (
                            <div className="text-sm text-secondary/70">
                              {roundedPrice(monthlyPrice * cart.taxRate)}{' '}
                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                            </div>
                          )}
                          {setupFee > 0 && (
                            <div className="text-xs text-secondary/70">
                              + {roundedPrice(setupFee * cart.taxRate)}{' '}
                              {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                            </div>
                          )}

                          {/* Address and subscription details */}
                          <div className="text-xs text-secondary/70">
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
                                <span className="font-medium">
                                  {commonT('deliveryAddressLabel')}{' '}
                                </span>
                                {formatAddressForDisplay(product.config)}
                              </div>
                            )}
                            {/* Show 1 month notice period for all non-installment products */}
                            {!product.name?.toLowerCase().includes('avbetalning') && (
                              <p>{commonT('noticePeriod', { count: 1 })}</p>
                            )}
                            {product.bound > 0 && (
                              <p>{commonT('bindingPeriod', { count: product.bound })}</p>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                  {/* TV category - with addon support and TV hardware installment support */}
                  {product.category === 'TV' &&
                    (() => {
                      // Check if this is TV hardware (like digitalbox-tv-avbetalning)
                      const isTvHardware =
                        product.categoryType === 'TV_HARDWARE' ||
                        product.name?.toLowerCase().includes('digitalbox') ||
                        product.name?.toLowerCase().includes('tv-') ||
                        (product.category === 'TV' &&
                          product.name?.toLowerCase().includes('avbetalning'));

                      // Handle TV Hardware with installment logic (same as checkout page)
                      if (isTvHardware) {
                        const paytype = product.paytype || product.rawProductData?.paytype || '';
                        const isOneTimePurchaseByPaytype = paytype.toLowerCase() === 'once';

                        // Check multiple fields for pricing data
                        const monthlyPriceField = parseFloat(
                          product.m_price ||
                            product.price ||
                            product.rawProductData?.price ||
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

                        let actualPrice = 0;
                        let actualSetupPrice = 0;
                        let isInstallmentPlan = false;
                        const contractPeriod =
                          product.bound ||
                          product.rawProductData?.bound ||
                          (isInstallmentByName ? 12 : 0);

                        if (isOneTimePurchaseByPaytype) {
                          // For one-time purchases
                          if (monthlyPriceField === 0 && setupPriceField > 0) {
                            actualPrice = setupPriceField;
                            actualSetupPrice = 0;
                          } else {
                            actualPrice = monthlyPriceField || setupPriceField;
                            actualSetupPrice = 0;
                          }
                        } else if (monthlyPriceField > 0) {
                          // Regular subscription or installment
                          actualPrice = monthlyPriceField;
                          actualSetupPrice = setupPriceField;
                          isInstallmentPlan = contractPeriod > 0 || isInstallmentByName;
                        } else if (
                          monthlyPriceField === 0 &&
                          setupPriceField > 0 &&
                          !isInstallmentByName
                        ) {
                          // One-time product with price only in setup field
                          actualPrice = setupPriceField;
                          actualSetupPrice = 0;
                        } else {
                          // Fallback
                          actualPrice = monthlyPriceField;
                          actualSetupPrice = setupPriceField;
                        }

                        return (
                          <div className="mt-1 space-y-1">
                            {isInstallmentPlan ? (
                              <>
                                {actualPrice > 0 && (
                                  <div className="text-sm text-secondary/70">
                                    {roundedPrice(actualPrice * cart.taxRate)}{' '}
                                    {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                  </div>
                                )}
                                {actualSetupPrice > 0 && (
                                  <div className="text-xs text-secondary/70">
                                    + {roundedPrice(actualSetupPrice * cart.taxRate)}{' '}
                                    {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                                  </div>
                                )}
                                {/* Display binding period for installment plans */}
                                {contractPeriod > 0 && (
                                  <div className="text-xs text-secondary/70">
                                    {commonT('bindingPeriod', { count: contractPeriod })}
                                  </div>
                                )}
                              </>
                            ) : (
                              actualPrice > 0 && (
                                <div className="text-sm text-secondary/70">
                                  {roundedPrice(actualPrice * cart.taxRate)} {commonT('currency')}{' '}
                                  {commonT('tax.inclVat')}
                                </div>
                              )
                            )}
                          </div>
                        );
                      }

                      // Regular TV service logic (from checkout page)
                      const baseMonthlyPrice = parseFloat(
                        product.m_price || product.rawProductData?.m_price || 0
                      );
                      const baseSetupPrice = parseFloat(
                        product.s_price || product.rawProductData?.s_price || 0
                      );

                      // Get addons directly from the product's addons array
                      const relatedAddons = product.addons || [];

                      return (
                        <div className="mt-1 space-y-1">
                          {/* Base pricing */}
                          {baseMonthlyPrice > 0 && (
                            <div className="text-sm text-secondary/70">
                              {roundedPrice(baseMonthlyPrice * cart.taxRate)}{' '}
                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                            </div>
                          )}
                          {baseSetupPrice > 0 && (
                            <div className="text-xs text-secondary/70">
                              + {roundedPrice(baseSetupPrice * cart.taxRate)}{' '}
                              {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                            </div>
                          )}

                          {/* TV service details */}
                          <div className="text-xs text-secondary/70">
                            {/* City network info */}
                            {(product.config?.stadsnat ||
                              product.config?.stadsnet ||
                              product.cityNet) && (
                              <div>
                                <span className="font-medium">
                                  {t('cityNetworkLabel') || 'Stadsnät'}:{' '}
                                </span>
                                {product.config?.stadsnat ||
                                  product.config?.stadsnet ||
                                  product.cityNet}
                              </div>
                            )}

                            {/* Service terms */}
                            {/* Show 1 month notice period for all non-installment products */}
                            {!product.name?.toLowerCase().includes('avbetalning') && (
                              <p>{commonT('noticePeriod', { count: 1 })}</p>
                            )}
                            {product.bound > 0 && (
                              <p>{commonT('bindingPeriod', { count: product.bound })}</p>
                            )}
                          </div>

                          {/* Addons section */}
                          {relatedAddons.length > 0 && (
                            <div className="text-xs text-secondary/70">
                              <div className="font-medium mb-1">
                                {t('addonsLabel') || 'Tillägg'}:
                              </div>
                              <div className="space-y-1">
                                {relatedAddons.map((addon) => (
                                  <div key={addon.id} className="text-xs text-secondary/90">
                                    {addon.qty} × {addon.name} -{' '}
                                    {roundedPrice(parseFloat(addon.m_price) * cart.taxRate)}{' '}
                                    {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                  {/* Telefoni category - with comprehensive addon support */}
                  {(product.category === 'Telefoni' || product.category === 'IP-telefoni') &&
                    (() => {
                      // Determine if this is a one-time purchase (hardware) using paytype
                      const paytype = product.paytype || product.rawProductData?.paytype || '';
                      const isOneTimePurchase = paytype.toLowerCase() === 'once';

                      // Check if it's monthly bound telephony hardware
                      const productId = parseInt(product.id) || parseInt(product.hb_product_id);
                      const isMonthlyBoundTelephony = isTelephonyMonthlyBoundHardware(productId);

                      // If it's monthly bound telephony hardware, show monthly pricing with contract terms
                      if (isMonthlyBoundTelephony) {
                        const monthlyPrice = parseFloat(
                          product.m_price || product.rawProductData?.m_price || 0
                        );
                        const setupPrice = parseFloat(
                          product.s_price || product.rawProductData?.s_price || 0
                        );

                        // For monthly bound telephony hardware, use default values if not set in API
                        const boundMonths = product.bound || product.rawProductData?.bound || 12;

                        return (
                          <div className="mt-1 text-xs text-secondary/70 space-y-1">
                            <div>
                              {roundedPrice(monthlyPrice * cart.taxRate)}{' '}
                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                            </div>
                            {setupPrice > 0 && (
                              <div>
                                + {roundedPrice(setupPrice * cart.taxRate)}{' '}
                                {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                              </div>
                            )}
                            {/* Only binding period for installment plans (no notice period) */}
                            <div className="text-xs text-secondary/70">
                              {commonT('bindingPeriod', { count: boundMonths })}
                            </div>
                          </div>
                        );
                      }

                      // If it's telephony hardware (one-time purchase), show one-time pricing
                      if (isOneTimePurchase) {
                        // Use same logic as StandardCartItem for one-time purchases
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

                        return (
                          <div className="mt-1 text-sm text-secondary/70">
                            {oneTimePrice > 0 && (
                              <div>
                                {roundedPrice(oneTimePrice * cart.taxRate)} {commonT('currency')}{' '}
                                {commonT('tax.inclVat')}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Telephony service rendering logic continues below
                      // Get configuration data
                      const serviceType = product.config?.serviceType || '';
                      const numberOption = product.config?.numberOption || '';
                      const phoneNumber = product.config?.phoneNumber || '';
                      const associatedOrgPersonNr = product.config?.associatedOrgPersonNr || '';
                      const hardwareType = product.config?.hardwareType || '';

                      // Get pricing
                      const baseMonthlyPrice =
                        parseFloat(product.m_price || product.rawProductData?.m_price) || 0;
                      const baseSetupPrice =
                        parseFloat(product.s_price || product.rawProductData?.s_price) || 0;

                      // Get addons from product.addons array
                      const relatedAddons = product.addons || [];

                      // Helper function to get addon name
                      const getAddonName = (addonId) => {
                        const id = parseInt(addonId);
                        if (id === getPortNumberAddonId()) {
                          return locale === 'sv'
                            ? 'Behåll befintligt nummer'
                            : 'Keep existing number';
                        } else if (id === getNewNumberAddonId()) {
                          return locale === 'sv' ? 'Nytt telefonnummer' : 'Get new number';
                        } else {
                          return `Addon ${addonId}`;
                        }
                      };

                      // Helper function to get addon pricing
                      const getAddonPricing = (addon) => {
                        const addonId = parseInt(addon.id);
                        const phoneOptions = product.rawProductData?.phoneOptions || [];

                        // Port Number addon - show pricing as it's a separate setup fee
                        if (addonId === getPortNumberAddonId()) {
                          const keepOption = phoneOptions.find(
                            (opt) => opt.value === 'keep_existing'
                          );
                          if (keepOption && keepOption.setupPrice) {
                            const basePrice = keepOption.setupPrice / cart.taxRate;
                            return `${roundedPrice(basePrice * cart.taxRate)} ${commonT(
                              'currency'
                            )} ${commonT('tax.inclVat')}`;
                          }
                          const fallbackPrice = 295 / cart.taxRate;
                          return `${roundedPrice(fallbackPrice * cart.taxRate)} ${commonT(
                            'currency'
                          )} ${commonT('tax.inclVat')}`;
                        }

                        // New Number addon
                        if (addonId === getNewNumberAddonId()) {
                          const newOption = phoneOptions.find((opt) => opt.value === 'new_number');
                          if (newOption && newOption.monthlyPrice) {
                            const basePrice = newOption.monthlyPrice / cart.taxRate;
                            return `${roundedPrice(basePrice * cart.taxRate)} ${commonT(
                              'currencyPerMonth'
                            )} ${commonT('tax.inclVat')}`;
                          }
                          const fallbackPrice = 29 / cart.taxRate;
                          return `${roundedPrice(fallbackPrice * cart.taxRate)} ${commonT(
                            'currencyPerMonth'
                          )} ${commonT('tax.inclVat')}`;
                        }

                        return locale === 'sv' ? 'Gratis' : 'Free';
                      };

                      // Helper function to get equipment pricing
                      const getEquipmentPricing = (hardwareType) => {
                        const equipmentPricing = {
                          grandstream: 520,
                          gigaset: 1000,
                          yealink: 400,
                          snom: 350,
                        };

                        const equipmentKey = hardwareType?.toLowerCase() || '';
                        const basePrice = equipmentPricing[equipmentKey] || 200;

                        return `${roundedPrice(basePrice * cart.taxRate)} ${commonT(
                          'currency'
                        )} ${commonT('tax.inclVat')}`;
                      };

                      // Helper function to get equipment name
                      const getEquipmentName = (hardwareType) => {
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
                        <div className="mt-1 space-y-1">
                          {/* Base service pricing */}
                          {baseMonthlyPrice > 0 && (
                            <div className="text-sm text-secondary/70">
                              {roundedPrice(baseMonthlyPrice * cart.taxRate)}{' '}
                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                            </div>
                          )}
                          {baseSetupPrice > 0 && (
                            <div className="text-xs text-secondary/70">
                              + {roundedPrice(baseSetupPrice * cart.taxRate)}{' '}
                              {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                            </div>
                          )}

                          {/* Phone number configuration */}
                          {phoneNumber && (
                            <div className="text-xs text-secondary/70">
                              <span className="font-medium">
                                {locale === 'sv' ? 'Telefonnummer' : 'Phone Number'}:{' '}
                              </span>
                              {phoneNumber}
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
                            <div className="text-xs text-secondary/70">
                              <span className="font-medium">
                                {locale === 'sv'
                                  ? 'Organisations-/personnummer'
                                  : 'Organization/Personal Number'}
                                :{' '}
                              </span>
                              {associatedOrgPersonNr}
                            </div>
                          )}

                          {/* Service terms for telephony services */}
                          <div className="text-xs text-secondary/70 mt-2">
                            <p>{commonT('noticePeriod', { count: 1 })}</p>
                            {product.bound > 0 && (
                              <p>{commonT('bindingPeriod', { count: product.bound })}</p>
                            )}
                          </div>

                          {/* Hardware/Equipment */}
                          {hardwareType && (
                            <div className="text-xs text-secondary/70 mt-2">
                              <span className="font-medium">
                                {locale === 'sv' ? 'Utrustning' : 'Equipment'}:
                              </span>
                              <div className="ml-2">
                                1 X {getEquipmentName(hardwareType)} -{' '}
                                {getEquipmentPricing(hardwareType)}
                              </div>
                            </div>
                          )}

                          {/* Addons */}
                          {relatedAddons.length > 0 && (
                            <div className="text-xs text-secondary/70 mt-2">
                              <span className="font-medium">
                                {locale === 'sv' ? 'Tillägg' : 'Addons'}:
                              </span>
                              <div className="ml-2 space-y-0.5">
                                {relatedAddons.map((addon) => (
                                  <div key={addon.id} className="text-xs text-secondary/70">
                                    {addon.qty} X {getAddonName(addon.id)} -{' '}
                                    {getAddonPricing(addon)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                  {/* Säkerhet (Security) category - with campaign pricing support */}
                  {product.category === 'Säkerhet' &&
                    (() => {
                      const campaignInfo = getCampaignPricingDisplay(
                        product.rawProductData,
                        locale
                      );
                      const paytype = product.paytype || product.rawProductData?.paytype || '';
                      const isOneTimePurchase = paytype.toLowerCase() === 'once';

                      if (campaignInfo) {
                        // Campaign pricing display
                        return (
                          <div className="mt-1 space-y-1">
                            <div className="inline-flex items-center px-2 py-1 rounded-full bg-accent/10 border border-accent/20">
                              <span className="text-xs font-semibold text-accent">
                                {campaignInfo.badgeText} {campaignInfo.campaignText}
                              </span>
                            </div>
                            <div className="text-sm text-accent font-medium">
                              {roundedPrice(campaignInfo.campaignPrice * cart.taxRate)}{' '}
                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                            </div>
                            <div className="text-xs line-through text-secondary/50">
                              {roundedPrice(campaignInfo.originalPrice * cart.taxRate)}{' '}
                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                            </div>
                          </div>
                        );
                      } else if (isOneTimePurchase) {
                        // One-time purchase pricing
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
                        const displayPrice = roundedPrice(oneTimePrice * cart.taxRate);

                        return (
                          displayPrice > 0 && (
                            <div className="mt-1 text-sm text-secondary/70">
                              {displayPrice} {commonT('currency')} {commonT('tax.inclVat')}
                            </div>
                          )
                        );
                      } else {
                        // Regular subscription pricing
                        const monthlyPrice = parseFloat(
                          product.m_price || product.rawProductData?.m_price || 0
                        );
                        const setupFee = parseFloat(
                          product.s_price || product.rawProductData?.s_price || 0
                        );

                        return (
                          <div className="mt-1 space-y-1">
                            {monthlyPrice > 0 && (
                              <div className="text-sm text-secondary/70">
                                {roundedPrice(monthlyPrice * cart.taxRate)}{' '}
                                {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                              </div>
                            )}
                            {setupFee > 0 && (
                              <div className="text-xs text-secondary/70">
                                + {roundedPrice(setupFee * cart.taxRate)}{' '}
                                {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                              </div>
                            )}
                          </div>
                        );
                      }
                    })()}

                  {/* Other categories - fallback for non-Broadband, non-TV, non-Telephony and non-Security items */}
                  {!['Bredband', 'TV', 'Telefoni', 'IP-telefoni', 'Säkerhet'].includes(
                    product.category
                  ) && (
                    <div className="mt-1 text-sm text-secondary/70">
                      {roundedPrice((parseFloat(product.m_price) || 0) * cart.taxRate)}{' '}
                      {commonT('currencyPerMonth')}
                      {parseFloat(product.s_price) > 0 &&
                        ` (+${roundedPrice(
                          (parseFloat(product.s_price) || 0) * cart.taxRate
                        )} ${commonT('currencySetupFee')})`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="sm:ml-28 sm:pl-6">
            <h3 className="sr-only">Your information</h3>
            <dl className="grid grid-cols-1 gap-x-6 py-10 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-secondary">{t('contactInfoTitle')}</dt>
                <dd className="mt-2 text-secondary/80">
                  <address className="not-italic">
                    <span className="block">
                      {sanitizeText(customerDetails.firstName)}{' '}
                      {sanitizeText(customerDetails.lastName)}
                    </span>
                    <span className="block">{sanitizeText(customerDetails.address)}</span>
                    <span className="block">
                      {sanitizeText(customerDetails.postalCode)}{' '}
                      {sanitizeText(customerDetails.city)}
                    </span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-secondary">{t('paymentMethodTitle')}</dt>
                <dd className="mt-2 text-secondary/80">
                  <p>
                    {paymentDetails.paymentMethod === 'email-invoice'
                      ? t('emailInvoice')
                      : t('paperInvoice')}
                  </p>
                  <p>{t('billingFrequencyLabel', { context: paymentDetails.billingFrequency })}</p>
                </dd>
              </div>
            </dl>
            <h3 className="sr-only">Summary</h3>
            <dl className="space-y-4 border-t border-divider pt-10">
              {cart.totalSetup > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-secondary">{t('oneTimeFeesLabel')}</dt>
                  <dd className="text-base font-medium text-secondary">
                    {roundedPrice(cart.totalSetup)} {commonT('currency')} {commonT('tax.inclVat')}
                  </dd>
                </div>
              )}
              {cart.totalMonthly > 0 && (
                <div
                  className={`flex items-center justify-between ${
                    cart.totalSetup > 0 ? 'pt-2' : ''
                  }`}
                >
                  <dt className="text-base font-medium text-secondary">
                    {t('subtotalMonthlyLabel')}
                  </dt>
                  <dd className="text-base font-medium text-secondary">
                    {roundedPrice(cart.totalMonthly)} {commonT('currencyPerMonth')}{' '}
                    {commonT('tax.inclVat')}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-10">
              <Link
                href="/"
                className="w-full text-center block rounded-md border border-transparent bg-accent px-4 py-3 text-base font-medium text-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
              >
                {t('continueShoppingButton')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
