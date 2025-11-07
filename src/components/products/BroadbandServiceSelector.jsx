'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/hooks/useCart';
import { useBroadbandData } from '@/hooks/useBroadbandData';
import { formatAddressForDisplay } from '@/lib/utils/formatting';
import BroadbandProductStrategy from './strategies/BroadbandProductStrategy';
import ServiceCardSkeleton from '@/components/skeletons/ServiceCardSkeleton';

const LoadingState = ({ t }) => (
  <div className="bg-primary min-h-screen text-secondary py-10">
    <section className="max-w-5xl w-full mx-auto px-4">
      {/* Title skeleton */}
      <div className="animate-pulse">
        <div className="h-10 bg-secondary/10 rounded w-2/3 mx-auto mb-10" />
        <div className="h-6 bg-secondary/10 rounded w-3/4 mx-auto mb-6" />

        {/* Filter controls skeleton */}
        <div className="mb-5 flex flex-col sm:flex-row sm:justify-between items-center gap-4 px-2 min-h-[56px]">
          <div className="h-10 bg-secondary/10 rounded w-40" />
          <div className="h-10 bg-secondary/10 rounded w-48" />
        </div>
      </div>

      {/* Service cards skeleton */}
      <ServiceCardSkeleton count={6} />
    </section>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="text-center py-20 text-failure bg-primary min-h-screen">{error}</div>
);

export default function BroadbandServiceSelector({ addressId }) {
  const t = useTranslations('broadbandServices');
  const commonT = useTranslations('common');

  const {
    taxRate,
    setTaxRate,
    getBroadbandItemByUniqueAddress,
    removeBroadbandItemByUniqueAddress,
  } = useCart();
  const { isLoading, error, installationAddress, servicesPrivate, servicesCompany } =
    useBroadbandData(addressId);

  const [showBoundServices, setShowBoundServices] = useState(true);

  const baseServicesToDisplay = useMemo(
    () => (taxRate === 1.25 ? servicesPrivate : servicesCompany),
    [taxRate, servicesPrivate, servicesCompany]
  );
  const showBoundServicesButton = useMemo(
    () =>
      baseServicesToDisplay.some((item) => item.bound > 0) &&
      baseServicesToDisplay.some((item) => item.bound === 0),
    [baseServicesToDisplay]
  );
  const servicesToDisplay = useMemo(
    () =>
      baseServicesToDisplay.filter((item) =>
        showBoundServicesButton ? (showBoundServices ? item.bound > 0 : item.bound === 0) : true
      ),
    [baseServicesToDisplay, showBoundServicesButton, showBoundServices]
  );

  const handleCustomerTypeChange = (event) => {
    const newTax = parseFloat(event.target.value);
    if (installationAddress?.accessId && installationAddress?.stadsnat) {
      const uniqueKey = `${installationAddress.stadsnat}${installationAddress.accessId}`;
      if (getBroadbandItemByUniqueAddress(uniqueKey)) {
        removeBroadbandItemByUniqueAddress(uniqueKey);
      }
    }
    setTaxRate(newTax);
  };

  if (isLoading) return <LoadingState t={t} />;
  if (error) return <ErrorState error={error} />;
  if (!installationAddress || (servicesToDisplay.length === 0 && !showBoundServicesButton)) {
    return <ErrorState error={t('noServicesAvailable')} />;
  }

  const formattedAddressForLink = formatAddressForDisplay(installationAddress);

  return (
    <div className="bg-primary flex flex-col items-center min-h-screen text-secondary py-10">
      <section id="broadbandSelect" className="max-w-5xl w-full mx-4">
        <h1 className="my-10 text-3xl font-semibold text-center sm:text-4xl text-secondary">
          {t('selectBroadbandService')}
        </h1>
        <p className="text-center mb-6 text-lg text-secondary px-1 sm:px-2">
          {t('showingServicesFor')}{' '}
          <Link
            href={`/address-sok-bredband?q=${encodeURIComponent(formattedAddressForLink)}`}
            className="inline-flex items-center gap-x-1.5 font-semibold text-accent hover:underline"
            title={commonT('changeAddress')}
          >
            <span className="break-words">{formattedAddressForLink}</span>
            <PencilSquareIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          </Link>
        </p>

        <div className="mb-5 flex flex-col sm:flex-row sm:justify-between items-center gap-4 px-2 min-h-[56px]">
          <div>
            {showBoundServicesButton && (
              <label className="relative flex items-center group p-2 text-sm cursor-pointer">
                <span className="mr-3 text-secondary">{t('showWithBinding')}</span>
                <input
                  type="checkbox"
                  checked={showBoundServices}
                  onChange={() => setShowBoundServices((prev) => !prev)}
                  className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
                />
                <span className="scale-75 w-16 h-10 flex items-center flex-shrink-0 ml-auto p-1 bg-secondary/20 rounded-full duration-300 ease-in-out peer-checked:bg-accent after:w-8 after:h-8 after:bg-primary after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
              </label>
            )}
          </div>
          <div>
            {(servicesPrivate.length > 0 || servicesCompany.length > 0) && (
              <div className="h-10 flex border border-divider rounded items-center text-secondary relative">
                <select
                  value={taxRate}
                  onChange={handleCustomerTypeChange}
                  name="customerType"
                  id="customerType"
                  className="pl-3 pr-8 py-2 appearance-none outline-none w-full bg-transparent focus:ring-1 focus:ring-accent text-sm rounded-md"
                >
                  {servicesPrivate.length > 0 && (
                    <option value={1.25}>
                      {t('showPrivateServices', { count: servicesPrivate.length })}
                    </option>
                  )}
                  {servicesCompany.length > 0 && (
                    <option value={1.0}>
                      {t('showCompanyServices', { count: servicesCompany.length })}
                    </option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary/75">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {servicesToDisplay.length > 0 ? (
          <BroadbandProductStrategy
            services={servicesToDisplay}
            installationAddress={installationAddress}
          />
        ) : (
          <div className="text-center py-10 text-secondary">
            {t('noServicesMatchFilters', {
              type:
                taxRate === 1.25
                  ? commonT('private').toLowerCase()
                  : commonT('company').toLowerCase(),
            })}
          </div>
        )}
      </section>
    </div>
  );
}
