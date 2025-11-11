'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { PriceDisplay } from '@/components/tax/PriceDisplay';
import ProductStrategyErrorBoundary from '../ProductStrategyErrorBoundary';
import CartErrorBoundary from '../CartErrorBoundary';
import { availableStadsnat, ovrigaStadsnat, getTvProductId, getTvServiceType } from '@/config/tvProducts';
import { parseProductPricing, getBillingPeriodSuffix, getCartPricingData } from '@/lib/utils/productPricing';
import { useCart } from '@/hooks/useCart';
import useLoadingState from '@/hooks/useLoadingState';
import { CardSkeleton } from '../../skeletons';

// PERFORMANCE FIX: Lazy load AddToCartButton to reduce initial bundle size
const AddToCartButton = lazy(() => import('../AddToCartButton'));

export default function TvServiceProductStrategy({ 
  product, 
  onAdd,
  installationAddress,
  productSlugWithId, // Add this prop to get the URL slug
  currentUrl
}) {
  const tCommon = useTranslations('common');
  const tTvService = useTranslations('tvService');
  const locale = useLocale();
  const { addToCart, cartItems, hasCategory } = useCart();
  const [selectedStadsnat, setSelectedStadsnat] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productAddons, setProductAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({});
  const { isLoading: isLoadingAddons, startLoading: startLoadingAddons, stopLoading: stopLoadingAddons } = useLoadingState(false);
  const [currentProductData, setCurrentProductData] = useState(product);
  const { isLoading: isLoadingProductData, startLoading: startLoadingProductData, stopLoading: stopLoadingProductData } = useLoadingState(false);
  const [showOvrigaStadsnat, setShowOvrigaStadsnat] = useState(false);
  const [showAlreadyAddedMessage, setShowAlreadyAddedMessage] = useState(false);

  // Abort controller for cleanup
  const abortControllerRef = useState(() => new AbortController())[0];

  // Determine current stadsnät from installation address or selection
  const currentStadsnat = installationAddress?.stadsnat || selectedStadsnat;

  // Determine service type from URL slug instead of product name
  const serviceType = getTvServiceType(productSlugWithId || product?.name || '');
  const isBaspaketPlus = serviceType === 'baspaket-plus';

  // Pre-fetch all TV products for current service type on mount to warm up cache
  useEffect(() => {
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = window.location.origin;
    document.head.appendChild(preconnectLink);

    const prefetchTvProducts = async () => {
      try {
        const languageId = locale === 'sv' ? 9 : 2;

        // Get product IDs from env variables based on service type
        const productIdsStr = serviceType === 'baspaket-plus'
          ? process.env.NEXT_PUBLIC_TV_BASPAKET_PLUS_SERVICE_IDS || ''
          : process.env.NEXT_PUBLIC_TV_BASPAKET_SERVICE_IDS || '';

        if (!productIdsStr) return;

        // Batch fetch all products for this service type
        const productsResponse = await fetch(
          `/api/hostbill/get-products-by-ids?ids=${productIdsStr}&language_id=${languageId}&category=tv`,
          { signal: abortControllerRef.signal }
        );
        const productsData = await productsResponse.json();

        // Pre-fetch addons for each product in parallel
        if (productsData.success && productsData.products) {
          const addonPromises = productsData.products.map(product =>
            fetch(`/api/hostbill/get-product-addons?id=${product.id}&language_id=${languageId}`, {
              signal: abortControllerRef.signal
            }).catch(err => console.error(`Error prefetching addons for product ${product.id}:`, err))
          );
          await Promise.all(addonPromises);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error prefetching TV products:', error);
        }
      }
    };

    prefetchTvProducts();

    return () => {
      if (document.head.contains(preconnectLink)) {
        document.head.removeChild(preconnectLink);
      }
    };
  }, [serviceType, locale, abortControllerRef.signal]);

  // Get the correct HostBill product ID for current stadsnät
  const getCurrentProductId = () => {
    if (!currentStadsnat) return null;
    return getTvProductId(serviceType, currentStadsnat);
  };

  // Fetch product data and addons when stadsnät is selected
  useEffect(() => {
    const productId = getCurrentProductId();
    if (!productId) {
      setProductAddons([]);
      return;
    }

    const fetchProductDataAndAddons = async () => {
      startLoadingProductData();
      startLoadingAddons();
      
      try {
        const languageId = locale === 'sv' ? 9 : 2;
        
        // PERFORMANCE FIX: Parallelize API calls instead of sequential (7s → ~1.5s)
        const [productResponse, addonsResponse] = await Promise.all([
          fetch(`/api/hostbill/get-product?id=${productId}&language_id=${languageId}`, {
            signal: abortControllerRef.signal
          }),
          fetch(`/api/hostbill/get-product-addons?id=${productId}&language_id=${languageId}`, {
            signal: abortControllerRef.signal
          })
        ]);
        
        // Process product data
        const productData = await productResponse.json();
        if (productData.success !== false && productData.product) {
          setCurrentProductData({
            ...productData.product,
            // Preserve original product's display name and description
            name: product.name,
            description: product.description
          });
        }
        
        // Process addons data
        const addonsData = await addonsResponse.json();
        if (addonsData.success) {
          setProductAddons(addonsData.addons);
        }
      } catch (error) {
        // Don't set error state if request was aborted
        if (error.name === 'AbortError') {
          return;
        }
        console.error('Error fetching product data and addons:', error);
      } finally {
        stopLoadingProductData();
        stopLoadingAddons();
      }
    };

    fetchProductDataAndAddons();
  }, [currentStadsnat, serviceType, locale, abortControllerRef.signal]);

  const handleStadsnatSelect = (stadsnat) => {
    setSelectedStadsnat(stadsnat);
    setIsModalVisible(false);
    // Reset selected addons when changing stadsnät
    setSelectedAddons({});
  };

  const handleAddonToggle = (addonId, isSelected) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: isSelected
    }));
  };

  const handleAddToCart = () => {
    const productId = getCurrentProductId();
    if (!productId) {
      setIsModalVisible(true);
      return;
    }

    // Check if this exact TV service (with same product ID and addons) is already in cart
    const addonsForCart = Object.entries(selectedAddons)
      .filter(([_, isSelected]) => isSelected)
      .map(([addonId, _]) => {
        const addon = productAddons.find(a => a.id.toString() === addonId);
        return {
          id: parseInt(addonId),
          qty: 1,
          name: addon?.name || `Addon ${addonId}`,
          m_price: addon?.m_price || addon?.m || '0',
          s_price: addon?.s_price || addon?.s || '0'
        };
      });

    const existingTvItem = cartItems.find(item => 
      item.category === 'TV' && 
      item.id === productId.toString() &&
      item.cityNet === currentStadsnat
    );

    // Check if same item with same addons
    if (existingTvItem) {
      const existingAddons = existingTvItem.addons || [];
      const existingAddonIds = existingAddons.map(addon => addon.id).sort();
      const newAddonIds = addonsForCart.map(addon => addon.id).sort();
      
      if (JSON.stringify(existingAddonIds) === JSON.stringify(newAddonIds)) {
        // Same service with same addons is already in cart
        return 'already-in-cart';
      }
    }

    const cartPricing = getCartPricingData(currentProductData);
    
    // Structure cart item according to API requirements
    const cartItem = {
      id: productId.toString(),
      hb_product_id: productId,
      name: currentProductData.name || product.name,
      category: 'TV',
      categoryId: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TV, 10), // Environment-aware TV category ID
      quantity: 1, // Must be 1 for TV base packages
      cityNet: currentStadsnat,
      addons: addonsForCart,
      price: cartPricing.price,
      setupPrice: cartPricing.setupPrice,
      m_price: currentProductData.m_price || currentProductData.m,
      s_price: currentProductData.s_price || currentProductData.s_setup || '0',
      config: {
        cityNet: currentStadsnat,
        stadsnet: currentStadsnat
      },
      unique: `TV-${currentStadsnat}`, // Unique key for exclusive category handling
      rawProductData: currentProductData,
      productUrl: currentUrl || `/kategori/tv/${productSlugWithId || productId}`
    };
    
    // Add to cart using context
    addToCart(cartItem);
  };

  if (!product) return null;

  return (
    <ProductStrategyErrorBoundary 
      productName={product?.name} 
      productType="tv-service"
    >
      <div className="space-y-8">
      {/* Step 1: Stadsnät Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-secondary flex items-center">
          <span className="bg-accent text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
          {tTvService('steps.selectNetwork')}
        </h3>
        
        {!currentStadsnat ? (
          <div className="bg-primary border-2 border-divider rounded-lg p-6">
            <div className="text-center">
              <p className="text-secondary/70 mb-6">
                {tTvService('networkSelection.description')}
              </p>
              <button
                onClick={() => setIsModalVisible(true)}
                className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                {tTvService('networkSelection.selectButton')}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-secondary/70">
                  {tTvService('networkSelection.selectedNetwork')}
                </span>
                <div className="font-semibold text-secondary">{currentStadsnat}</div>
              </div>
              <button
                onClick={() => setIsModalVisible(true)}
                className="text-sm text-accent hover:underline"
              >
                {tTvService('networkSelection.changeNetwork')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Product Card (only show if stadsnät selected) */}
      {currentStadsnat && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-secondary flex items-center">
            <span className="bg-accent text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
            {isBaspaketPlus ? tTvService('productNames.baspaketPlus') : tTvService('productNames.baspaket')}
          </h3>
          
          <div className="bg-primary border-2 border-divider rounded-lg overflow-hidden">
            <div className="p-6">
              {isLoadingProductData ? (
                <div className="py-8">
                  <CardSkeleton variant="product" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    // Use centralized pricing logic
                    const pricingInfo = parseProductPricing(currentProductData);

                    return (
                      <>
                        {pricingInfo.isOneTime ? (
                          /* One-time purchase */
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-secondary">
                              <PriceDisplay basePrice={pricingInfo.primaryPrice} showTaxSuffix={true} locale={locale} />
                            </span>
                          </div>
                        ) : (
                          /* Regular subscription */
                          <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-secondary">
                              <PriceDisplay basePrice={pricingInfo.primaryPrice} showTaxSuffix={true} locale={locale} />
                            </span>
                            <span className="text-lg text-secondary/70">
                              {getBillingPeriodSuffix(pricingInfo.billingPeriod, tCommon)}
                            </span>
                          </div>
                        )}

                        {/* Setup Fee (only show for subscriptions) */}
                        {!pricingInfo.isOneTime && pricingInfo.setupPrice > 0 && (
                          <div className="text-sm text-secondary/70">
                            Setup fee: <PriceDisplay basePrice={pricingInfo.setupPrice} showTaxSuffix={true} locale={locale} />
                          </div>
                        )}

                        {/* Channel list for Baspaket (only show for basic package, not plus) */}
                        {!isBaspaketPlus && (
                          <div className="mt-4 p-4 bg-secondary/5 rounded-lg">
                            <p className="font-semibold text-secondary mb-2">
                              {tTvService('baspaketChannelsIncluded')}
                            </p>
                            <p className="text-sm text-secondary/80 leading-relaxed">
                              {tTvService('channelsList')}
                            </p>
                          </div>
                        )}

                        {/* Channel list for Baspaket+ (27 channels) */}
                        {isBaspaketPlus && (
                          <div className="mt-4 p-4 bg-secondary/5 rounded-lg">
                            <p className="font-semibold text-secondary mb-2">
                              {locale === 'sv' ? 'Baspaket Plus inkluderar 27 kanaler' : 'Base Package Plus includes 27 channels'}
                            </p>
                            <p className="text-sm text-secondary/80">
                              {locale === 'sv' 
                                ? 'SVT, TV3 HD, TV4, Kanal 5-12, Animal Planet HD, CNN, Discovery HD, Eurosport HD, National Geographic HD och fler...'
                                : 'SVT, TV3 HD, TV4, Channels 5-12, Animal Planet HD, CNN, Discovery HD, Eurosport HD, National Geographic HD and more...'
                              }
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Channel Addons (only show if stadsnät selected) - lazy loaded */}
      {currentStadsnat && productAddons.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-secondary flex items-center">
            <span className="bg-accent text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
            {tTvService('steps.extraChannels')}
          </h3>
          
          {isLoadingAddons ? (
            <div className="py-4">
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-primary border border-divider rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-secondary/10 rounded" />
                        <div className="h-4 bg-secondary/10 rounded w-32" />
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-secondary/10 rounded w-16 mb-1" />
                        <div className="h-3 bg-secondary/10 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {productAddons.map((addon) => (
                <div 
                  key={addon.id}
                  onClick={() => handleAddonToggle(addon.id, !selectedAddons[addon.id])}
                  className="bg-primary border border-divider rounded-lg p-4 hover:border-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`addon-${addon.id}`}
                          checked={selectedAddons[addon.id] || false}
                          onChange={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-accent border-2 border-divider rounded focus:ring-accent accent-accent"
                        />
                        <label 
                          htmlFor={`addon-${addon.id}`}
                          className="font-semibold text-secondary cursor-pointer select-none"
                        >
                          {addon.name}
                        </label>
                      </div>
                      {addon.description && (
                        <p className="text-sm text-secondary/70 mt-1 ml-7">
                          {addon.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-secondary">
                        <PriceDisplay basePrice={parseFloat(addon.m_price || addon.m) || 0} locale={locale} />
                      </div>
                      <div className="text-sm text-secondary/70">{tTvService('addons.perMonth')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add to Cart Button (show after stadsnät selected) */}
      {currentStadsnat && !isLoadingProductData && (
        <CartErrorBoundary>
          <div className="mt-8">
            <Suspense fallback={
              <button className="w-full bg-accent text-primary px-4 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed">
                {tTvService('cart.addToCart')}
              </button>
            }>
              <AddToCartButton
                onAdd={handleAddToCart}
                className="w-full"
                showAlreadyAddedMessage={showAlreadyAddedMessage}
                onAlreadyAddedMessageChange={setShowAlreadyAddedMessage}
              >
                {tTvService('cart.addToCart')}
              </AddToCartButton>
            </Suspense>
          </div>
        </CartErrorBoundary>
      )}

      {/* Stadsnät Selection Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-darkblack bg-opacity-50">
          <div className="bg-primary rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary">
                  {tTvService('networkSelection.modalTitle')}
                </h2>
                <button
                  onClick={() => setIsModalVisible(false)}
                  className="text-secondary/50 hover:text-secondary text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                {availableStadsnat.map((option) => {
                  if (option.value === 'Default') {
                    return (
                      <div key={option.value} className="space-y-2">
                        <button
                          onClick={() => setShowOvrigaStadsnat(!showOvrigaStadsnat)}
                          className="w-full p-4 border border-divider rounded-lg flex justify-between items-center hover:border-accent transition-colors bg-primary text-secondary"
                        >
                          <span className="font-medium">
                            {option.value === 'Default' ? tTvService('networkTypes.ovrigaNat') : option.label}
                          </span>
                          <span className="text-accent">
                            {showOvrigaStadsnat ? '−' : '+'}
                          </span>
                        </button>
                        {showOvrigaStadsnat && (
                          <div className="ml-4 space-y-2 border-l-2 border-divider pl-4">
                            {ovrigaStadsnat.map((subOption) => (
                              <button
                                key={subOption.value}
                                onClick={() => handleStadsnatSelect(subOption.value)}
                                className="w-full p-3 border border-divider rounded-lg flex justify-between items-center hover:border-accent transition-colors bg-primary text-secondary text-sm"
                              >
                                <span className="font-medium">{subOption.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleStadsnatSelect(option.value)}
                      className="w-full p-4 border border-divider rounded-lg flex justify-between items-center hover:border-accent transition-colors bg-primary text-secondary"
                    >
                      <span className="font-medium">
                        {option.value === 'Default' ? tTvService('networkTypes.ovrigaNat') : option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProductStrategyErrorBoundary>
  );
}