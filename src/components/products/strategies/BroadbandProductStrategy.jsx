'use client';

import React, { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PencilSquareIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/hooks/useCart';
import { roundedPrice, formatAddressForDisplay } from '@/lib/utils/formatting';
import AddToCartButton from '../AddToCartButton';
import ProductStrategyErrorBoundary from '../ProductStrategyErrorBoundary';
import CartErrorBoundary from '../CartErrorBoundary';

const BroadbandProductStrategy = ({
  servicesPrivate,
  servicesCompany,
  installationAddress,
  currentUrl,
}) => {
  const t = useTranslations('broadbandServices');
  const commonT = useTranslations('common');
  const {
    addToCart,
    getBroadbandItemByUniqueAddress,
    removeBroadbandItemByUniqueAddress,
    cartItems,
  } = useCart();
  const [customerType, setCustomerType] = useState('private');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [showBound, setShowBound] = useState('unbound'); // 'all', 'bound', 'unbound'
  const [showAlreadyAddedMessage, setShowAlreadyAddedMessage] = useState(false);

  // Auto-switch to company if no private services available, or vice versa
  React.useEffect(() => {
    if (servicesPrivate.length === 0 && servicesCompany.length > 0 && customerType === 'private') {
      setCustomerType('company');
    } else if (servicesCompany.length === 0 && servicesPrivate.length > 0 && customerType === 'company') {
      setCustomerType('private');
    }
  }, [servicesPrivate.length, servicesCompany.length, customerType]);

  const services = useMemo(
    () => (customerType === 'private' ? servicesPrivate : servicesCompany),
    [customerType, servicesPrivate, servicesCompany]
  );

  const servicesToDisplay = useMemo(() => {
    if (showBound === 'all') return services;
    return services.filter((s) => (showBound === 'bound' ? s.bound > 0 : s.bound === 0));
  }, [services, showBound]);

  const handleServiceChange = (event) => {
    setSelectedServiceId(event.target.value);
    setShowAlreadyAddedMessage(false); // Clear "already in cart" message when service changes
  };

  const selectedService = useMemo(() => {
    return servicesToDisplay.find((service) => service.serviceId.toString() === selectedServiceId);
  }, [servicesToDisplay, selectedServiceId]);

  const handleAddToCart = () => {
    if (!selectedService || !installationAddress?.accessId || !installationAddress?.stadsnat) {
      return;
    }

    const broadbandCategoryId = parseInt(process.env.NEXT_PUBLIC_CATEGORY_ID_BROADBAND, 10);
    if (isNaN(broadbandCategoryId)) {
      console.error('Config Error: NEXT_PUBLIC_CATEGORY_ID_BROADBAND is not valid.');
      return;
    }

    const cartItemPayload = {
      id: selectedService.hb_product_id,
      name: selectedService.friendlyname,
      category: 'Bredband',
      serviceId: selectedService.serviceId,
      categoryId: broadbandCategoryId,
      m_price: selectedService.m_price,
      s_price: selectedService.s_price,
      m_campaign_price: selectedService.m_campaign_price,
      s_campaign_price: selectedService.s_campaign_price,
      m_campaign_length: selectedService.m_campaign_length,
      notice: selectedService.notice,
      bound: selectedService.bound,
      config: {
        ...installationAddress,
        cityNet: installationAddress.stadsnat,
        activationDate: new Date().toISOString(),
        id: selectedService.serviceId,
        customerType: customerType, // Add customer type for cart display
      },
      unique: `${installationAddress.stadsnat}${installationAddress.accessId}-service${
        selectedService.serviceId
      }-${customerType}-bound${selectedService.bound}`,
      c_type: selectedService.c_type,
      productUrl: currentUrl || `/bredband?id=${encodeURIComponent(selectedService.serviceId)}`,
    };

    const currentCartItem = getBroadbandItemByUniqueAddress(cartItemPayload.unique);
    if (currentCartItem) {
      // Same exact service variant, return signal that item is already in cart
      return 'already-in-cart';
    }

    // Remove any existing broadband service from cart (only one broadband service allowed per order)
    // Use categoryType instead of category to avoid removing routers which share the same category
    const existingBroadbandItems = cartItems.filter((item) => item.categoryType === 'BROADBAND');

    // Remove all existing broadband services
    existingBroadbandItems.forEach((item) => {
      removeBroadbandItemByUniqueAddress(item.unique);
    });

    addToCart(cartItemPayload);
  };

  const handleCustomerTypeChange = (event) => {
    const newCustomerType = event.target.value;
    if (installationAddress?.accessId && installationAddress?.stadsnat) {
      const uniqueKey = `${installationAddress.stadsnat}${installationAddress.accessId}`;
      if (getBroadbandItemByUniqueAddress(uniqueKey)) {
        removeBroadbandItemByUniqueAddress(uniqueKey);
      }
    }
    setCustomerType(newCustomerType);
    setShowAlreadyAddedMessage(false); // Clear "already in cart" message when customer type changes
  };

  const formattedAddressForLink = formatAddressForDisplay(installationAddress);

  return (
    <ProductStrategyErrorBoundary productName="Broadband Service" productType="broadband">
      <div className="space-y-4">
        <div className="bg-secondary/5 p-3 rounded-lg">
          <p className="text-center text-sm text-secondary px-1 sm:px-2">
            {t('showingServicesFor')}{' '}
            <Link
              href={`/address-sok-bredband?q=${encodeURIComponent(formattedAddressForLink)}`}
              className="inline-flex items-center gap-x-1.5 font-semibold text-accent hover:underline"
              title={commonT('changeAddress')}
            >
              <span className="break-words">{formattedAddressForLink}</span>
              <PencilSquareIcon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            </Link>
          </p>
        </div>

        {/* Show message when no services are available */}
        {servicesPrivate.length === 0 && servicesCompany.length === 0 ? (
          <div className="bg-warning-light border border-warning/20 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-secondary mb-3">{t('noServicesTitle')}</h3>
            <p className="text-secondary/80 mb-4">{t('noServicesMessage')}</p>
            <div className="space-y-3">
              <p className="text-sm text-secondary/70">{t('contactUsFor')}:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:0650402000"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-primary rounded-md transition-colors"
                >
                  <PhoneIcon className="w-4 h-4" />
                  0650-402000
                </a>
                <a
                  href="mailto:support@internetport.se"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-primary rounded-md transition-colors"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  support@internetport.se
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="customerType"
                  className="block text-sm font-medium text-secondary mb-1"
                >
                  {commonT('customerType')}
                </label>
                <select
                  id="customerType"
                  value={customerType}
                  onChange={handleCustomerTypeChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-divider focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
                >
                  {servicesPrivate.length > 0 && (
                    <option value="private">
                      {t('showPrivateServices', { count: servicesPrivate.length })}
                    </option>
                  )}
                  {servicesCompany.length > 0 && (
                    <option value="company">
                      {t('showCompanyServices', { count: servicesCompany.length })}
                    </option>
                  )}
                </select>
              </div>
              <div>
                <label
                  htmlFor="bindingPeriod"
                  className="block text-sm font-medium text-secondary mb-1"
                >
                  {t('bindingPeriodFilter')}
                </label>
                <select
                  id="bindingPeriod"
                  value={showBound}
                  onChange={(e) => {
                    setShowBound(e.target.value);
                    setShowAlreadyAddedMessage(false); // Clear "already in cart" message when binding changes
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-divider focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
                >
                  <option value="unbound">{t('withoutBinding')}</option>
                  <option value="bound">{t('withBinding')}</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="speed-select"
                className="block text-sm font-medium text-secondary mb-1"
              >
                {t('selectBroadbandService')}
              </label>
              <select
                id="speed-select"
                value={selectedServiceId}
                onChange={handleServiceChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-divider focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
              >
                <option value="">{t('selectASpeed')}</option>
                {servicesToDisplay.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.friendlyname}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-secondary/60">{t('selectSpeedInfo')}</p>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out ${
                selectedService ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
              }`}
            >
              <div className="border border-divider rounded-lg p-4 bg-secondary/5 relative">
                {(selectedService?.m_campaign_length > 0 ||
                  selectedService?.friendlyname === '100 Mbit/s') && (
                  <span className="absolute slide-in-top bg-accent text-primary px-4 py-1 rounded-bl-lg right-0 top-0 text-xs font-semibold">
                    {selectedService?.m_campaign_length > 0 ? t('campaign') : t('mostPopular')}
                  </span>
                )}
                <h3 className="text-lg font-bold text-secondary">
                  {selectedService?.friendlyname}
                </h3>
                <p className="mt-2 text-secondary">
                  {selectedService?.m_campaign_price && selectedService?.m_campaign_length > 0 ? (
                    <>
                      <span className="line-through text-secondary/50">
                        {roundedPrice(parseFloat(selectedService?.m_price) * 1.25)}{' '}
                        {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                      </span>
                      <br />
                      <span className="text-accent">
                        {roundedPrice(parseFloat(selectedService?.m_campaign_price) * 1.25)}{' '}
                        {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                      </span>
                    </>
                  ) : (
                    <span>
                      {roundedPrice(parseFloat(selectedService?.m_price) * 1.25)}{' '}
                      {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                    </span>
                  )}
                </p>
                {parseFloat(selectedService?.s_price) > 0 && (
                  <p className="text-sm text-secondary/80">
                    + {roundedPrice(parseFloat(selectedService?.s_price) * 1.25)}{' '}
                    {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                  </p>
                )}
                <div className="mt-4 text-sm text-secondary/80">
                  <p>
                    {selectedService?.notice === 0
                      ? commonT('noNoticePeriod')
                      : t('noticePeriod', { count: selectedService?.notice })}
                  </p>
                  <p>
                    {selectedService?.bound === 0
                      ? commonT('noBindingPeriod')
                      : t('bindingPeriod', { count: selectedService?.bound })}
                  </p>
                </div>
              </div>
              <CartErrorBoundary>
                <div className="mt-4">
                  <AddToCartButton
                    onAdd={handleAddToCart}
                    disabled={!selectedService}
                    showAlreadyAddedMessage={showAlreadyAddedMessage}
                    onAlreadyAddedMessageChange={setShowAlreadyAddedMessage}
                  />
                </div>
              </CartErrorBoundary>
            </div>
          </>
        )}
      </div>
    </ProductStrategyErrorBoundary>
  );
};

export default BroadbandProductStrategy;
