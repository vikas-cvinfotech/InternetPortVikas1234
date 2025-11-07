'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import AddToCartButton from '../AddToCartButton';

// Lazy load heavy components to improve Speed Index
const ServiceTypeSelection = lazy(() => import('./telephony/ServiceTypeSelection'));
const NumberConfiguration = lazy(() => import('./telephony/NumberConfiguration'));
const EquipmentSelection = lazy(() => import('./telephony/EquipmentSelection'));
import ProductStrategyErrorBoundary from '../ProductStrategyErrorBoundary';
import CartErrorBoundary from '../CartErrorBoundary';
import {
  telephonyServiceTypes,
  telephonyHardwareOptions,
  getTelephonyServiceId,
  getTelephonyHardwareId
} from '@/config/telephonyProducts';
import { getNewNumberAddonId, getPortNumberAddonId } from '@/config/telephonyAddons';
import { parseProductPricing, getBillingPeriodSuffix, getCartPricingData } from '@/lib/utils/productPricing';
import { useCart } from '@/hooks/useCart';
import useLoadingState from '@/hooks/useLoadingState';

export default function TelephonyServiceProductStrategy({ 
  product,
  productSlugWithId,
  currentUrl
}) {
  const t = useTranslations('telephony.form');
  const locale = useLocale();
  
  // Helper function to safely get area code translations
  const getAreaCodeLabel = (areaCode, fallback) => {
    try {
      const translationKey = `areaCodes.${areaCode}`;
      // Check if translation exists first to avoid errors
      const hasTranslation = t.has && t.has(translationKey);
      if (hasTranslation) {
        return t(translationKey);
      }
      return fallback;
    } catch {
      return fallback;
    }
  };
  const { addToCart, getItemsByCategory, removeFromCart } = useCart();

  // Form state
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedNumberOption, setSelectedNumberOption] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [portingOrgNumber, setPortingOrgNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [orgNumberError, setOrgNumberError] = useState('');
  const [selectedAreaCode, setSelectedAreaCode] = useState('');
  const [availableNumbers, setAvailableNumbers] = useState({});
  const [randomNumbers, setRandomNumbers] = useState({});
  const [availablePrefixes, setAvailablePrefixes] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const { isLoading: isLoadingNumbers, startLoading: startLoadingNumbers, stopLoading: stopLoadingNumbers } = useLoadingState(false);
  const [serviceProductData, setServiceProductData] = useState(null);
  const [hardwareProducts, setHardwareProducts] = useState([]);
  const [allServicePricing, setAllServicePricing] = useState({});
  const [allAddonPricing, setAllAddonPricing] = useState({});
  const { isLoading: isPricingLoading, startLoading: startPricingLoading, stopLoading: stopPricingLoading } = useLoadingState(true);
  const [showAlreadyAddedMessage, setShowAlreadyAddedMessage] = useState(false);
  
  // Form validation
  const isStep1Valid = selectedServiceType !== '';
  const isStep2Valid = selectedNumberOption !== '' && 
    (selectedNumberOption === 'new' 
      ? (selectedAreaCode !== '' && selectedPhoneNumber !== '') 
      : (phoneNumber !== '' && portingOrgNumber !== '' && phoneNumberError === '' && orgNumberError === ''));
  // Step 3 validation: Simple order flow - Standard ALWAYS requires equipment selection, Retail allows no equipment
  const isStep3Valid = selectedServiceType === 'retail' || 
    (selectedServiceType === 'standard' && selectedEquipment !== '');
  
  const isFormValid = isStep1Valid && isStep2Valid && isStep3Valid;

  // Validation functions - lenient approach inspired by backend validation
  const validatePhoneNumber = (number) => {
    if (!number.trim()) {
      return t('validation.phoneNumberRequired');
    }
    
    // Remove all non-digit characters for validation
    const numericPhone = number.replace(/\D/g, '');
    
    // Lenient phone validation: 8-15 digits (inspired by backend validation)
    if (numericPhone.length < 8 || numericPhone.length > 15) {
      return t('validation.phoneNumberInvalid');
    }
    
    return '';
  };

  const validateOrgNumber = (orgNumber) => {
    if (!orgNumber.trim()) {
      return t('validation.orgNumberRequired');
    }
    
    // Remove all non-alphanumeric characters for validation
    const cleanOrgNumber = orgNumber.replace(/\D/g, '');
    
    // Lenient validation: at least 5 characters (inspired by backend international validation)
    if (cleanOrgNumber.length < 5) {
      return t('validation.orgNumberTooShort');
    }
    
    // Optional: Check for common Swedish formats but don't enforce strictly
    if (cleanOrgNumber.length === 10 || cleanOrgNumber.length === 12) {
      // Likely Swedish format - no additional validation needed
      return '';
    }
    
    // For other lengths, just ensure it's reasonable
    if (cleanOrgNumber.length > 20) {
      return t('validation.orgNumberTooLong');
    }
    
    return '';
  };

  // Handle phone number change with validation
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    const error = validatePhoneNumber(value);
    setPhoneNumberError(error);
  };

  // Handle organization number change with validation
  const handleOrgNumberChange = (value) => {
    setPortingOrgNumber(value);
    const error = validateOrgNumber(value);
    setOrgNumberError(error);
  };

  // Fetch all service pricing and addon pricing on component mount
  useEffect(() => {
    const fetchAllPricing = async () => {
      const languageId = locale === 'sv' ? 9 : 2;
      const servicePricing = {};
      const addonPricing = {};

      const serviceIds = telephonyServiceTypes
        .map(serviceType => getTelephonyServiceId(serviceType.id))
        .filter(Boolean)
        .join(',');

      if (!serviceIds) {
        stopPricingLoading();
        return;
      }

      try {
        const servicesResponse = await fetch(
          `/api/hostbill/get-products-by-ids?ids=${serviceIds}&language_id=${languageId}&category=telefoni`
        );
        const servicesData = await servicesResponse.json();

        if (servicesData.success && servicesData.products) {
          const addonPromises = servicesData.products.map(async (product) => {
            const serviceType = telephonyServiceTypes.find(
              st => getTelephonyServiceId(st.id) === parseInt(product.id)
            );

            if (serviceType) {
              servicePricing[serviceType.id] = parseProductPricing(product);

              try {
                const addonResponse = await fetch(
                  `/api/hostbill/get-product-addons?id=${product.id}&language_id=${languageId}`
                );
                const addonData = await addonResponse.json();

                if (addonData.success && addonData.addons) {
                  const serviceAddons = {};
                  const newNumberAddonId = getNewNumberAddonId();
                  const portNumberAddonId = getPortNumberAddonId();

                  addonData.addons.forEach(addon => {
                    if (addon.id === newNumberAddonId || addon.id === portNumberAddonId) {
                      const price = parseFloat(addon.m_price || addon.m || addon.s_price || addon.s_setup || 0);
                      serviceAddons[addon.id] = {
                        price: price,
                        period: addon.id === portNumberAddonId ? 'once' : 'monthly'
                      };
                    }
                  });
                  addonPricing[serviceType.id] = serviceAddons;
                } else {
                  const newNumberAddonId = getNewNumberAddonId();
                  const portNumberAddonId = getPortNumberAddonId();
                  addonPricing[serviceType.id] = {
                    [portNumberAddonId]: { price: 0, period: 'once' },
                    [newNumberAddonId]: { price: 0, period: 'monthly' }
                  };
                }
              } catch (error) {
                console.error(`Error fetching addons for ${serviceType.id}:`, error);
              }
            }
          });

          await Promise.all(addonPromises);
        }
      } catch (error) {
        console.error('Error fetching telephony service pricing:', error);
      }

      setAllServicePricing(servicePricing);
      setAllAddonPricing(addonPricing);
      stopPricingLoading();
    };

    fetchAllPricing();
  }, [locale]);

  // Fetch service product data when service type is selected
  useEffect(() => {
    if (!selectedServiceType) {
      setServiceProductData(null);
      return;
    }

    const fetchServiceData = async () => {
      try {
        const productId = getTelephonyServiceId(selectedServiceType);
        if (!productId) return;

        const languageId = locale === 'sv' ? 9 : 2;
        
        // Fetch service product data
        const productResponse = await fetch(`/api/hostbill/get-product?id=${productId}&language_id=${languageId}`);
        const productData = await productResponse.json();
        
        if (productData.success !== false && productData.product) {
          setServiceProductData(productData.product);
        }
      } catch (error) {
        console.error('Error fetching telephony service data:', error);
      }
    };

    fetchServiceData();
  }, [selectedServiceType, locale]);

  // Fetch available phone numbers when "new" option is selected
  useEffect(() => {
    if (selectedNumberOption !== 'new') {
      setAvailableNumbers({});
      setRandomNumbers({});
      return;
    }

    const fetchPhoneNumbers = async () => {
      startLoadingNumbers();
      try {
        const response = await fetch('/api/hostbill/phone-numbers');
        const data = await response.json();
        
        if (data.success) {
          setAvailableNumbers(data.allNumbers || {});
          setRandomNumbers(data.randomNumbers || {});
          setAvailablePrefixes(data.prefixes || []);
        }
      } catch (error) {
        console.error('Error fetching phone numbers:', error);
      } finally {
        stopLoadingNumbers();
      }
    };

    fetchPhoneNumbers();
  }, [selectedNumberOption]);

  // Reset selected phone number when area code changes
  useEffect(() => {
    setSelectedPhoneNumber('');
  }, [selectedAreaCode]);

  // Fetch hardware product data when component loads
  useEffect(() => {
    const fetchHardwareData = async () => {
      try {
        const languageId = locale === 'sv' ? 9 : 2;

        const hardwareIds = telephonyHardwareOptions
          .map(hardware => getTelephonyHardwareId(hardware.id))
          .filter(Boolean)
          .join(',');

        if (!hardwareIds) return;

        const response = await fetch(
          `/api/hostbill/get-products-by-ids?ids=${hardwareIds}&language_id=${languageId}&category=telefoni`
        );
        const data = await response.json();

        if (data.success && data.products) {
          const hardwareData = data.products.map(product => {
            const hardware = telephonyHardwareOptions.find(
              hw => getTelephonyHardwareId(hw.id) === parseInt(product.id)
            );
            return hardware ? { ...hardware, productData: product } : null;
          }).filter(Boolean);

          setHardwareProducts(hardwareData);
        }
      } catch (error) {
        console.error('Error fetching telephony hardware data:', error);
      }
    };

    fetchHardwareData();
  }, [locale]);

  const handleAddToCart = () => {
    if (!isFormValid) return;

    // Simple validation: Standard service requires equipment selection (per order flow)
    if (selectedServiceType === 'standard' && !selectedEquipment) {
      console.error('Standard telephony service requires equipment selection');
      return;
    }

    // Check if there's already a telephony service in cart
    const existingTelephonyServices = getItemsByCategory('TELEPHONY');
    const existingTelephonyHardware = getItemsByCategory('TELEPHONY_HARDWARE');
    
    if (existingTelephonyServices.length > 0) {
      const existingService = existingTelephonyServices[0];
      
      // Build current configuration to compare with existing
      const currentPhoneNumber = selectedNumberOption === 'keep' ? phoneNumber : `${selectedAreaCode}-${selectedPhoneNumber}`;
      const currentAddons = [];
      if (selectedNumberOption === 'new') {
        currentAddons.push({ id: getNewNumberAddonId(), qty: 1 }); // New Number addon
      } else if (selectedNumberOption === 'keep') {
        currentAddons.push({ id: getPortNumberAddonId(), qty: 1 }); // Port Number addon
      }
      
      // Check if it's the exact same configuration (service, hardware, phone setup)
      const isSameService = existingService.hostBillProductId === parseInt(serviceProductData.id);
      const isSameServiceType = existingService.config?.serviceType === selectedServiceType;
      const isSameNumberOption = existingService.config?.numberOption === selectedNumberOption;
      const isSamePhoneNumber = existingService.config?.phoneNumber === currentPhoneNumber;
      const isSameHardware = existingService.config?.hardwareType === selectedEquipment;
      const isSamePortingOrg = (selectedNumberOption !== 'keep') || (existingService.config?.associatedOrgPersonNr === portingOrgNumber);
      
      // Check if addons are the same
      const existingAddons = existingService.addons || [];
      const isSameAddons = currentAddons.length === existingAddons.length && 
        currentAddons.every(addon => existingAddons.some(existing => existing.id === addon.id && existing.qty === addon.qty));
      
      // Only return already-in-cart if ALL configuration matches exactly
      if (isSameService && isSameServiceType && isSameNumberOption && isSamePhoneNumber && isSameHardware && isSamePortingOrg && isSameAddons) {
        return 'already-in-cart';
      }
      // Different configuration - the cart context will handle replacing it
    }

    const items = [];

    // Add telephony service to cart
    if (serviceProductData) {
      const serviceCartPricing = getCartPricingData(serviceProductData);
      
      // Build addons array based on number option
      const addonsForCart = [];
      if (selectedNumberOption === 'new') {
        addonsForCart.push({ id: getNewNumberAddonId(), qty: 1 }); // New Number addon
      } else if (selectedNumberOption === 'keep') {
        addonsForCart.push({ id: getPortNumberAddonId(), qty: 1 }); // Port Number addon
      }

      const serviceItem = {
        id: serviceProductData.id.toString(),
        hostBillProductId: parseInt(serviceProductData.id), // Required by ecommerce API
        hb_product_id: parseInt(serviceProductData.id), // Keep for backward compatibility
        name: serviceProductData.name,
        category: 'IP-telefoni',
        categoryId: parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_TELEPHONY, 10), // Environment-aware telephony category ID
        quantity: 1,
        addons: addonsForCart, // Correct structure: [{id: number, qty: number}]
        price: serviceCartPricing.price,
        setupPrice: serviceCartPricing.setupPrice,
        m_price: serviceProductData.m_price || serviceProductData.m,
        s_price: serviceProductData.s_price || serviceProductData.s_setup || '0',
        // Required telephony-specific fields for ecommerce API
        phoneNumber: selectedNumberOption === 'keep' ? phoneNumber : `${selectedAreaCode}-${selectedPhoneNumber}`,
        ...(selectedNumberOption === 'keep' && { associatedOrgPersonNr: portingOrgNumber }),
        config: {
          serviceType: selectedServiceType,
          numberOption: selectedNumberOption,
          phoneNumber: selectedNumberOption === 'keep' ? phoneNumber : `${selectedAreaCode}-${selectedPhoneNumber}`,
          hardwareType: selectedEquipment || '', // Track hardware selection in service config for comparison
          // Store complete hardware data to avoid API calls in cart
          hardwareData: selectedEquipment ? hardwareProducts.find(hw => hw.id === selectedEquipment) : null,
          ...(selectedNumberOption === 'keep' && { associatedOrgPersonNr: portingOrgNumber })
        },
        unique: `TELEPHONY-SERVICE`, // Unique key for exclusive category handling - only one telephony service per order
        rawProductData: serviceProductData,
        productUrl: currentUrl || `/kategori/telefoni/${productSlugWithId || serviceProductData.id}`
      };

      items.push(serviceItem);
    }

    // Note: Hardware is NOT added as a separate cart item for IP telephony services
    // Hardware selection is stored in the service config and handled as part of the service pricing
    // Users can still add hardware separately from individual hardware product pages

    // Simple approach: Remove all existing telephony hardware when updating telephony service
    // This follows the clean order flow where hardware is selected as part of the service configuration
    existingTelephonyHardware.forEach(hardware => {
      removeFromCart(hardware.id);
    });

    // Add items to cart
    items.forEach(item => addToCart(item));
  };

  if (!product) return null;

  // Show loading state while pricing is being fetched
  if (isPricingLoading) {
    return (
      <div className="space-y-8">
        {/* Service Type Selection Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-secondary/10 rounded w-1/3 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse bg-primary border border-divider rounded-lg p-4">
                <div className="h-5 bg-secondary/10 rounded w-2/3 mb-2" />
                <div className="h-4 bg-secondary/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Configuration Steps Skeleton */}
        <div className="space-y-6">
          <div className="h-32 bg-secondary/5 rounded-lg animate-pulse" />
          <div className="h-32 bg-secondary/5 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <ProductStrategyErrorBoundary 
      productName={product?.name} 
      productType="telephony"
    >
      <div className="space-y-8">
        {/* Step 1: Service Type Selection - lazy loaded to improve Speed Index */}
        <Suspense fallback={
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-secondary/10 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="border-2 border-divider rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-secondary/10 rounded-full" />
                        <div>
                          <div className="h-4 bg-secondary/10 rounded w-32 mb-2" />
                          <div className="h-3 bg-secondary/10 rounded w-48" />
                        </div>
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
          </div>
        }>
          <ServiceTypeSelection
            selectedServiceType={selectedServiceType}
            onServiceTypeChange={setSelectedServiceType}
            allServicePricing={allServicePricing}
            isValid={isStep1Valid}
          />
        </Suspense>

        {/* Step 2: Number Configuration - lazy loaded for better performance */}
        {isStep1Valid && (
          <Suspense fallback={
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-6 bg-secondary/10 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="border-2 border-divider rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-secondary/10 rounded-full" />
                          <div>
                            <div className="h-4 bg-secondary/10 rounded w-40 mb-2" />
                            <div className="h-3 bg-secondary/10 rounded w-56" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-secondary/10 rounded w-20 mb-1" />
                          <div className="h-3 bg-secondary/10 rounded w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <NumberConfiguration
              selectedServiceType={selectedServiceType}
              selectedNumberOption={selectedNumberOption}
              onNumberOptionChange={setSelectedNumberOption}
              phoneNumber={phoneNumber}
              onPhoneNumberChange={handlePhoneNumberChange}
              portingOrgNumber={portingOrgNumber}
              onOrgNumberChange={handleOrgNumberChange}
              phoneNumberError={phoneNumberError}
              orgNumberError={orgNumberError}
              selectedAreaCode={selectedAreaCode}
              onAreaCodeChange={setSelectedAreaCode}
              availableNumbers={availableNumbers}
              randomNumbers={randomNumbers}
              availablePrefixes={availablePrefixes}
              selectedPhoneNumber={selectedPhoneNumber}
              onSelectedPhoneNumberChange={setSelectedPhoneNumber}
              isLoadingNumbers={isLoadingNumbers}
              allAddonPricing={allAddonPricing}
              getAreaCodeLabel={getAreaCodeLabel}
              isValid={isStep2Valid}
            />
          </Suspense>
        )}

        {/* Step 3: Equipment Selection - lazy loaded for better performance */}
        {isStep1Valid && isStep2Valid && (
          <Suspense fallback={
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-6 bg-secondary/10 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-2 border-divider rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-secondary/10 rounded-full" />
                          <div>
                            <div className="h-4 bg-secondary/10 rounded w-36 mb-2" />
                            <div className="h-3 bg-secondary/10 rounded w-52" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-secondary/10 rounded w-18 mb-1" />
                          <div className="h-3 bg-secondary/10 rounded w-14" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }>
            <EquipmentSelection
              selectedServiceType={selectedServiceType}
              selectedEquipment={selectedEquipment}
              onEquipmentChange={setSelectedEquipment}
              hardwareProducts={hardwareProducts}
              isValid={isStep3Valid}
            />
          </Suspense>
        )}

        {/* Add to Cart Button */}
        <CartErrorBoundary>
          <div className="mt-8">
            <AddToCartButton
              onAdd={handleAddToCart}
              disabled={!isFormValid}
              className={`w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              showAlreadyAddedMessage={showAlreadyAddedMessage}
              onAlreadyAddedMessageChange={setShowAlreadyAddedMessage}
            >
              {t('addToCart')}
            </AddToCartButton>
          </div>
        </CartErrorBoundary>

        {/* Form validation feedback */}
        {!isFormValid && (
          <div className="text-sm text-secondary/70 text-center">
            {!isStep1Valid && t('validation.step1Missing')}
            {isStep1Valid && !isStep2Valid && (
              selectedNumberOption === ''
                ? t('validation.step2OptionMissing')
                : selectedNumberOption === 'new' 
                  ? t('validation.step2NewNumberMissing')
                  : t('validation.step2PortingMissing')
            )}
            {isStep1Valid && isStep2Valid && !isStep3Valid && (
              selectedServiceType === 'standard'
                ? t('validation.step3StandardMissing')
                : t('validation.step3RetailMissing')
            )}
          </div>
        )}
      </div>
    </ProductStrategyErrorBoundary>
  );
}