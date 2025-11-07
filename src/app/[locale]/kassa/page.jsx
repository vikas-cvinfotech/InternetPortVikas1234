'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/hooks/useCart';
import { useOrder } from '@/hooks/useOrder';
import { getCheckoutSchema } from '@/lib/validation/checkoutSchema';
import { isSwedishIdentityNumber } from '@/lib/validation/isSwedishIdentityNumber';
import { isSwedishOrganizationNumber } from '@/lib/validation/isSwedishOrganizationNumber';
import { getNewNumberAddonId, getPortNumberAddonId } from '@/config/telephonyAddons';
import { isTelephonyMonthlyBoundHardware } from '@/config/telephonyProducts';
import {
  formatAddressForDisplay,
  roundedPrice,
  normalizeSwedishPersonalNumber,
} from '@/lib/utils/formatting';
import { getCampaignPricingDisplay } from '@/lib/utils/campaignPricing';
import {
  ShoppingBagIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockClosedIcon,
  CalendarDaysIcon,
} from '@heroicons/react/20/solid';
import { Radio, RadioGroup } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Lazy load non-critical components for better FCP/LCP
const PageSkeleton = dynamic(() => import('@/components/skeletons/PageSkeleton'), {
  loading: () => <div className="animate-pulse">Loading...</div>,
});
const LoadingWrapper = dynamic(() => import('@/components/LoadingWrapper'));
import { useCSRFToken } from '@/hooks/useCSRFToken';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { sv } from 'date-fns/locale';
import { format } from 'date-fns';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const commonT = useTranslations('common');
  const validationT = useTranslations('validation');
  const categoryT = useTranslations('categoryIcons');
  const locale = useLocale();
  const router = useRouter();
  const { cartItems, taxRate, cartTotalMonthly, cartTotalSetup, isLoadingCart, updateItemConfig } =
    useCart();
  const { setOrderDetails } = useOrder();
  const { csrfToken, refreshToken: refreshCSRFToken } = useCSRFToken();

  const [showTermsError, setShowTermsError] = useState(false);

  const redirectPathSweden = '/kassa/signera';
  const redirectPathNotSweden = '/kassa/bekraftelse';

  const mainService = useMemo(
    () => cartItems.find((item) => item.category !== 'Router'),
    [cartItems]
  );

  const formSchema = useMemo(() => getCheckoutSchema(validationT, locale), [validationT, locale]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'private',
      firstName: '',
      lastName: '',
      companyName: '',
      orgPersonNr: '',
      personalNumberForAuth: '',
      email: '',
      phoneNumber: '',
      desiredActivationDate: mainService?.config?.activationDate?.split('T')[0] || '',
      address: '',
      postalCode: '',
      city: '',
      terms: false,
    },
  });

  const customerType = watch('type');
  const watchedDate = watch('desiredActivationDate');
  const orgPersonNrValue = watch('orgPersonNr');

  // General flag for routing: true if ANY Swedish ID is entered.
  const isSwedishCustomer = useMemo(
    () => isSwedishIdentityNumber(orgPersonNrValue),
    [orgPersonNrValue]
  );

  // Specific flag for UI: true ONLY if it's a company AND a 10-digit org number is entered.
  const showSignatoryField = useMemo(
    () => customerType === 'company' && isSwedishOrganizationNumber(orgPersonNrValue),
    [customerType, orgPersonNrValue]
  );

  useEffect(() => {
    if (watchedDate && mainService?.id) {
      const cartDate = mainService.config?.activationDate?.split('T')[0];
      if (watchedDate !== cartDate) {
        const isoDate = new Date(watchedDate).toISOString();
        updateItemConfig(mainService.id, { activationDate: isoDate });
      }
    }
  }, [watchedDate, mainService, updateItemConfig]);

  const paymentMethods = useMemo(
    () => [
      {
        id: 'email',
        title: t('invoiceInfo.email'),
        price: t('invoiceInfo.emailPrice'),
      },
      {
        id: 'paper',
        title: t('invoiceInfo.paper'),
        price: t('invoiceInfo.paperPrice'),
      },
      {
        id: 'kivra',
        title: t('invoiceInfo.kivra'),
        price: t('invoiceInfo.kivraPrice'),
      },
    ],
    [t]
  );

  const billingFrequencies = useMemo(
    () => [
      { id: 'monthly', title: t('frequencies.monthly') },
      { id: 'quarterly', title: t('frequencies.quarterly') },
    ],
    [t]
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);
  const [selectedBillingFrequency, setSelectedBillingFrequency] = useState(
    billingFrequencies[0].id
  );

  // Translate category display names (same logic as BaseCartItem)
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
      case 'ip-telefoni': // Add IP-telefoni category
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

  const onSubmit = (data) => {
    const routerItem = cartItems.find((item) => item.category === 'Router');

    const bankIdPersonalNumber =
      data.type === 'company' && isSwedishCustomer
        ? normalizeSwedishPersonalNumber(data.personalNumberForAuth)
        : normalizeSwedishPersonalNumber(data.orgPersonNr);

    const customerDetailsForOrder = {
      ...data,
      orgPersonNr: normalizeSwedishPersonalNumber(data.orgPersonNr),
      type: data.type.charAt(0).toUpperCase() + data.type.slice(1),
    };
    delete customerDetailsForOrder.personalNumberForAuth;

    const orderPayload = {
      customerDetails: customerDetailsForOrder,
      bankIdPersonalNumber: bankIdPersonalNumber,
      paymentDetails: {
        paymentMethod: selectedPaymentMethod.id,
        billingFrequency: selectedBillingFrequency,
      },
      cart: {
        items: cartItems,
        totalMonthly: cartTotalMonthly,
        totalSetup: cartTotalSetup,
        taxRate: taxRate,
      },
      mainServiceId: mainService?.id,
      routerId: routerItem?.id,
    };

    setOrderDetails(orderPayload);

    const redirectPath = isSwedishCustomer ? redirectPathSweden : redirectPathNotSweden;

    router.push(redirectPath);
  };

  const onInvalid = (errors) => {
    if (errors.terms) {
      setShowTermsError(true);
    }
  };

  const emptyCartContent = (
    <div className="bg-primary">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <div className="py-12 text-center">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-secondary/30" />
          <h3 className="mt-2 text-lg font-medium text-secondary">{t('emptyCartTitle')}</h3>
          <p className="mt-1 text-sm text-secondary/70">{t('emptyCartSubtitle')}</p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-md border border-transparent bg-accent px-4 py-2 text-sm font-medium text-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <LoadingWrapper
      isLoading={isLoadingCart}
      skeleton={<PageSkeleton variant="checkout" />}
      isEmpty={!isLoadingCart && cartItems.length === 0}
      empty={emptyCartContent}
      className="bg-primary min-h-screen"
    >
      <div className="bg-primary">
        <style jsx global>{`
          .react-datepicker__day--selected,
          .react-datepicker__day--in-selecting-range,
          .react-datepicker__day--in-range,
          .react-datepicker__month-text--selected,
          .react-datepicker__month-text--in-selecting-range,
          .react-datepicker__month-text--in-range,
          .react-datepicker__quarter-text--selected,
          .react-datepicker__quarter-text--in-selecting-range,
          .react-datepicker__quarter-text--in-range,
          .react-datepicker__year-text--selected,
          .react-datepicker__year-text--in-selecting-range,
          .react-datepicker__year-text--in-range {
            background-color: rgb(190 24 35) !important;
            color: rgb(255 255 255) !important;
          }
          .react-datepicker__day--keyboard-selected {
            background-color: transparent !important;
            color: inherit !important;
          }
        `}</style>
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h1 className="mb-12 text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('checkoutTitle')}
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
            >
              <div>
                <section>
                  <h2 className="text-lg font-medium text-secondary">{t('contactInfo.title')}</h2>

                  <fieldset className="mt-6">
                    <legend className="text-sm font-medium text-secondary">
                      {t('contactInfo.customerType')}
                    </legend>
                    <div className="mt-2 flex items-center gap-x-6">
                      <div className="flex items-center">
                        <input
                          id="private"
                          type="radio"
                          value="private"
                          {...register('type')}
                          className="relative size-4 appearance-none rounded-full border border-divider bg-primary before:absolute before:inset-1 before:rounded-full before:bg-primary checked:border-accent checked:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                        />
                        <label htmlFor="private" className="ml-3 block text-sm text-secondary">
                          {t('private')}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="company"
                          type="radio"
                          value="company"
                          {...register('type')}
                          className="relative size-4 appearance-none rounded-full border border-divider bg-primary before:absolute before:inset-1 before:rounded-full before:bg-primary checked:border-accent checked:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                        />
                        <label htmlFor="company" className="ml-3 block text-sm text-secondary">
                          {t('company')}
                        </label>
                      </div>
                    </div>
                  </fieldset>

                  <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    {customerType === 'company' && (
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="companyName"
                          className="block text-sm font-medium text-secondary"
                        >
                          {t('contactInfo.companyName')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="companyName"
                            type="text"
                            autoComplete="organization"
                            {...register('companyName')}
                            className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                              errors.companyName ? 'ring-failure' : 'ring-divider'
                            }`}
                          />
                          {errors.companyName && (
                            <p className="mt-1 text-sm text-failure">
                              {errors.companyName.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-secondary"
                      >
                        {t('contactInfo.firstName')}
                      </label>
                      <div className="mt-1">
                        <input
                          id="firstName"
                          type="text"
                          autoComplete="given-name"
                          {...register('firstName')}
                          className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                            errors.firstName ? 'ring-failure' : 'ring-divider'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-failure">{errors.firstName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-secondary"
                      >
                        {t('contactInfo.lastName')}
                      </label>
                      <div className="mt-1">
                        <input
                          id="lastName"
                          type="text"
                          autoComplete="family-name"
                          {...register('lastName')}
                          className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                            errors.lastName ? 'ring-failure' : 'ring-divider'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-failure">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="orgPersonNr"
                        className="block text-sm font-medium text-secondary"
                      >
                        {customerType === 'private'
                          ? t('contactInfo.personalNumber')
                          : t('contactInfo.orgNumber')}
                      </label>
                      <div className="mt-1">
                        <input
                          id="orgPersonNr"
                          type="text"
                          inputMode="numeric"
                          placeholder={
                            customerType === 'private'
                              ? locale === 'sv'
                                ? t('contactInfo.personalNumberHint')
                                : t('contactInfo.personalNumberHintInternational')
                              : locale === 'sv'
                              ? t('contactInfo.orgNumberHint')
                              : t('contactInfo.orgNumberHintInternational')
                          }
                          {...register('orgPersonNr')}
                          className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                            errors.orgPersonNr ? 'ring-failure' : 'ring-divider'
                          }`}
                        />
                        {errors.orgPersonNr && (
                          <p className="mt-1 text-sm text-failure">{errors.orgPersonNr.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Conditionally render the signatory personal number field */}
                    {showSignatoryField && (
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="personalNumberForAuth"
                          className="block text-sm font-medium text-secondary"
                        >
                          {t('contactInfo.signatoryPersonalNumber')}
                        </label>
                        <div className="mt-1">
                          <input
                            id="personalNumberForAuth"
                            type="text"
                            inputMode="numeric"
                            placeholder={t('contactInfo.personalNumberHint')}
                            {...register('personalNumberForAuth')}
                            className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                              errors.personalNumberForAuth ? 'ring-failure' : 'ring-divider'
                            }`}
                          />
                          {errors.personalNumberForAuth && (
                            <p className="mt-1 text-sm text-failure">
                              {errors.personalNumberForAuth.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-secondary">
                        {t('contactInfo.email')}
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...register('email')}
                          className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                            errors.email ? 'ring-failure' : 'ring-divider'
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-failure">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-secondary"
                      >
                        {t('contactInfo.mobileNumber')}
                      </label>
                      <div className="mt-1">
                        <input
                          id="phoneNumber"
                          type="tel"
                          autoComplete="tel"
                          {...register('phoneNumber')}
                          className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                            errors.phoneNumber ? 'ring-failure' : 'ring-divider'
                          }`}
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-failure">{errors.phoneNumber.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="desiredActivationDate"
                        className="block text-sm font-medium text-secondary"
                      >
                        {t('orderSummary.desiredActivationDateLabel')}
                      </label>
                      <div className="mt-1">
                        <div className="relative">
                          <Controller
                            control={control}
                            name="desiredActivationDate"
                            render={({ field }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) =>
                                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                                }
                                locale={locale === 'sv' ? sv : undefined}
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                placeholderText={t('contactInfo.desiredActivationDateHint')}
                                className={`block w-full rounded-md border-0 bg-primary px-3 pr-10 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                                  errors.desiredActivationDate ? 'ring-failure' : 'ring-divider'
                                }`}
                                calendarClassName="bg-primary border border-divider rounded-md shadow-lg"
                                wrapperClassName="w-full"
                                popperClassName="z-20"
                                dayClassName={(date) => {
                                  const isSelected =
                                    field.value &&
                                    new Date(date).toDateString() ===
                                      new Date(field.value).toDateString();
                                  const isToday =
                                    new Date(date).toDateString() === new Date().toDateString();

                                  let classes =
                                    'inline-flex size-8 items-center justify-center rounded-full text-sm';

                                  if (isSelected) {
                                    classes += ' bg-accent text-primary hover:bg-accent/90';
                                  } else if (isToday) {
                                    classes += ' bg-accent/10 text-accent ring-1 ring-accent';
                                  } else {
                                    classes += ' text-secondary hover:bg-accent/10';
                                  }
                                  return classes;
                                }}
                                renderCustomHeader={({
                                  date,
                                  decreaseMonth,
                                  increaseMonth,
                                  prevMonthButtonDisabled,
                                  nextMonthButtonDisabled,
                                }) => (
                                  <div className="flex items-center justify-between px-2 py-2">
                                    <button
                                      type="button"
                                      onClick={decreaseMonth}
                                      disabled={prevMonthButtonDisabled}
                                      className="rounded-lg p-1.5 text-secondary/70 hover:bg-accent/10 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <span className="sr-only">Previous Month</span>
                                      <ChevronLeftIcon className="size-5" />
                                    </button>
                                    <span className="text-sm font-medium text-secondary">
                                      {format(date, 'MMMM yyyy', {
                                        locale: locale === 'sv' ? sv : undefined,
                                      })}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={increaseMonth}
                                      disabled={nextMonthButtonDisabled}
                                      className="rounded-lg p-1.5 text-secondary/70 hover:bg-accent/10 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <span className="sr-only">Next Month</span>
                                      <ChevronRightIcon className="size-5" />
                                    </button>
                                  </div>
                                )}
                              />
                            )}
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <CalendarDaysIcon
                              className="size-5 text-secondary/40"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                        {errors.desiredActivationDate && (
                          <p className="mt-1 text-sm text-failure">
                            {errors.desiredActivationDate.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-10 border-t border-divider pt-10">
                  <h3 className="text-base font-medium text-secondary">
                    {t('billingAddress.title')}
                  </h3>

                  <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                      <label htmlFor="address" className="block text-sm font-medium text-secondary">
                        {t('billingAddress.address')}
                      </label>
                      <div className="mt-1">
                        <input
                          id="address"
                          type="text"
                          autoComplete="street-address"
                          {...register('address')}
                          className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                            errors.address ? 'ring-failure' : 'ring-divider'
                          }`}
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-failure">{errors.address.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-secondary"
                      >
                        {t('billingAddress.postalCode')}
                      </label>
                      <div className="mt-1">
                        <input
                          id="postalCode"
                          type="text"
                          autoComplete="postal-code"
                          {...register('postalCode')}
                          className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                            errors.postalCode ? 'ring-failure' : 'ring-divider'
                          }`}
                        />
                        {errors.postalCode && (
                          <p className="mt-1 text-sm text-failure">{errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium text-secondary">
                        {t('billingAddress.city')}
                      </label>
                      <div className="mt-1">
                        <input
                          id="city"
                          type="text"
                          autoComplete="address-level2"
                          {...register('city')}
                          className={`block w-full rounded-md border-0 bg-primary px-3 py-2.5 text-secondary ring-1 ring-inset placeholder:text-secondary/40 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm ${
                            errors.city ? 'ring-failure' : 'ring-divider'
                          }`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-failure">{errors.city.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-10 border-t border-divider pt-10">
                  <h3 className="text-base font-medium text-secondary">{t('invoiceInfo.title')}</h3>
                  <p className="mt-4 text-sm text-secondary/70">
                    {t('invoiceInfo.paymentDetails')}
                  </p>
                  <fieldset className="mt-6">
                    <legend className="text-sm font-medium text-secondary">
                      {t('invoiceInfo.sentVia')}
                    </legend>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onChange={setSelectedPaymentMethod}
                      className="mt-2 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
                    >
                      {paymentMethods.map((method) => (
                        <Radio key={method.id} value={method}>
                          {({ checked, focus }) => (
                            <div
                              className={`group relative flex cursor-pointer rounded-lg border bg-primary p-4 shadow-sm ${
                                checked ? 'border-accent' : 'border-divider'
                              }`}
                            >
                              <span className="flex flex-1">
                                <span className="flex flex-col">
                                  <span className="block text-sm font-medium text-secondary">
                                    {method.title}
                                  </span>
                                  <span className="mt-6 text-sm font-medium text-secondary">
                                    {method.price}
                                  </span>
                                </span>
                              </span>
                              {checked && (
                                <CheckCircleIcon
                                  aria-hidden="true"
                                  className="size-5 shrink-0 text-accent"
                                />
                              )}
                              <span
                                aria-hidden="true"
                                className={`pointer-events-none absolute -inset-px rounded-lg border-2 ${
                                  checked ? 'border-accent' : 'border-transparent'
                                } ${focus ? 'ring-2 ring-accent' : ''}`}
                              />
                            </div>
                          )}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </fieldset>

                  <fieldset className="mt-8">
                    <legend className="text-sm font-medium text-secondary">
                      {t('invoiceInfo.frequency')}
                    </legend>
                    <div className="mt-4 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      {billingFrequencies.map((freq) => (
                        <div key={freq.id} className="flex items-center">
                          <input
                            id={freq.id}
                            name="billing-frequency"
                            type="radio"
                            value={freq.id}
                            checked={selectedBillingFrequency === freq.id}
                            onChange={(e) => setSelectedBillingFrequency(e.target.value)}
                            className="relative size-4 appearance-none rounded-full border border-divider bg-primary before:absolute before:inset-1 before:rounded-full before:bg-primary checked:border-accent checked:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                          />
                          <label htmlFor={freq.id} className="ml-3 block text-sm text-secondary">
                            {freq.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </section>
              </div>

              <div className="mt-10 lg:mt-0">
                <h2 className="text-lg font-medium text-secondary">{t('orderSummary.title')}</h2>
                <div className="mt-4 rounded-lg bg-secondary/5 shadow-sm">
                  <h3 className="sr-only">{t('orderSummary.itemsInCart')}</h3>
                  <ul role="list" className="divide-y divide-divider px-4 py-6 sm:px-6">
                    {cartItems.map((product) => (
                      <li key={product.id} className="flex py-6">
                        <div className="w-20 shrink-0">
                          {product.imageSrc ? (
                            <Image
                              src={product.imageSrc}
                              alt={product.imageAlt || product.name}
                              width={80}
                              height={80}
                              className="w-20 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex size-16 items-center justify-center rounded-full bg-accent text-center sm:size-20">
                              <span className="px-1 py-2 text-[10px] sm:text-xs font-medium text-primary leading-tight">
                                {getCategoryDisplayName(product.category, product.categoryType)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-1 flex-col justify-center">
                          <div>
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-secondary">
                                  {product.name}
                                </h4>
                                {product.quantity > 1 && (
                                  <span className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
                                    {commonT('quantityWithValue', { quantity: product.quantity })}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Säkerhet (Security) category - with campaign pricing support */}
                            {product.category === 'Säkerhet' &&
                              (() => {
                                const campaignInfo = getCampaignPricingDisplay(
                                  product.rawProductData,
                                  locale
                                );
                                const paytype =
                                  product.paytype || product.rawProductData?.paytype || '';
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
                                        {roundedPrice(campaignInfo.campaignPrice * taxRate)}{' '}
                                        {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                      </div>
                                      <div className="text-xs line-through text-secondary/50">
                                        {roundedPrice(campaignInfo.originalPrice * taxRate)}{' '}
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
                                  const displayPrice = roundedPrice(oneTimePrice * taxRate);

                                  return (
                                    displayPrice > 0 && (
                                      <div className="mt-1 text-sm text-secondary/70">
                                        {displayPrice} {commonT('currency')}{' '}
                                        {commonT('tax.inclVat')}
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
                                    <div className="mt-1 text-sm text-secondary/70">
                                      {monthlyPrice > 0 && (
                                        <div>
                                          {roundedPrice(monthlyPrice * taxRate)}{' '}
                                          {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                        </div>
                                      )}
                                      {setupFee > 0 && (
                                        <div className="text-xs">
                                          + {roundedPrice(setupFee * taxRate)}{' '}
                                          {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              })()}

                            {/* Telefoni category - with comprehensive addon support */}
                            {(product.category === 'Telefoni' ||
                              product.category === 'IP-telefoni') &&
                              (() => {
                                // Determine if this is a one-time purchase (hardware) using paytype
                                const paytype =
                                  product.paytype || product.rawProductData?.paytype || '';
                                const isOneTimePurchase = paytype.toLowerCase() === 'once';

                                // Check if it's monthly bound telephony hardware
                                const productId =
                                  parseInt(product.id) || parseInt(product.hb_product_id);
                                const isMonthlyBoundTelephony =
                                  isTelephonyMonthlyBoundHardware(productId);

                                // If it's monthly bound telephony hardware, show monthly pricing with contract terms
                                if (isMonthlyBoundTelephony) {
                                  const monthlyPrice = parseFloat(
                                    product.m_price || product.rawProductData?.m_price || 0
                                  );
                                  const setupPrice = parseFloat(
                                    product.s_price || product.rawProductData?.s_price || 0
                                  );

                                  // For monthly bound telephony hardware, use default values if not set in API
                                  const boundMonths =
                                    product.bound || product.rawProductData?.bound || 12;

                                  return (
                                    <div className="mt-1 text-xs text-secondary/70 space-y-1">
                                      <div>
                                        {roundedPrice(monthlyPrice * taxRate)}{' '}
                                        {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                      </div>
                                      {setupPrice > 0 && (
                                        <div>
                                          + {roundedPrice(setupPrice * taxRate)}{' '}
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
                                          {roundedPrice(oneTimePrice * taxRate)}{' '}
                                          {commonT('currency')} {commonT('tax.inclVat')}
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
                                const associatedOrgPersonNr =
                                  product.config?.associatedOrgPersonNr || '';
                                const hardwareType = product.config?.hardwareType || '';

                                // Get pricing
                                const baseMonthlyPrice =
                                  parseFloat(product.m_price || product.rawProductData?.m_price) ||
                                  0;
                                const baseSetupPrice =
                                  parseFloat(product.s_price || product.rawProductData?.s_price) ||
                                  0;

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
                                    return locale === 'sv'
                                      ? 'Nytt telefonnummer'
                                      : 'Get new number';
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
                                      const basePrice = keepOption.setupPrice / taxRate;
                                      return `${roundedPrice(basePrice * taxRate)} ${commonT(
                                        'currency'
                                      )} ${commonT('tax.inclVat')}`;
                                    }
                                    const fallbackPrice = 295 / taxRate;
                                    return `${roundedPrice(fallbackPrice * taxRate)} ${commonT(
                                      'currency'
                                    )} ${commonT('tax.inclVat')}`;
                                  }

                                  // New Number addon
                                  if (addonId === getNewNumberAddonId()) {

                                    const newOption = phoneOptions.find(
                                      (opt) => opt.value === 'new_number'
                                    );
                                    if (newOption && newOption.monthlyPrice) {
                                      const basePrice = newOption.monthlyPrice / taxRate;
                                      return `${roundedPrice(basePrice * taxRate)} ${commonT(
                                        'currencyPerMonth'
                                      )} ${commonT('tax.inclVat')}`;
                                    }
                                    const fallbackPrice = 29 / taxRate;
                                    return `${roundedPrice(fallbackPrice * taxRate)} ${commonT(
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

                                  return `${roundedPrice(basePrice * taxRate)} ${commonT(
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
                                  return (
                                    equipmentNames[equipmentKey] ||
                                    hardwareType ||
                                    'Unknown Equipment'
                                  );
                                };

                                return (
                                  <div className="mt-1 space-y-1">
                                    {/* Base service pricing */}
                                    {baseMonthlyPrice > 0 && (
                                      <div className="text-sm text-secondary/70">
                                        {roundedPrice(baseMonthlyPrice * taxRate)}{' '}
                                        {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                      </div>
                                    )}
                                    {baseSetupPrice > 0 && (
                                      <div className="text-xs text-secondary/70">
                                        + {roundedPrice(baseSetupPrice * taxRate)}{' '}
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

                                    {/* Service terms */}
                                    {/* Show 1 month notice period for all non-installment products */}
                                    {!product.name?.toLowerCase().includes('avbetalning') && (
                                      <div className="text-xs text-secondary/70">
                                        {commonT('noticePeriod', { count: 1 })}
                                      </div>
                                    )}
                                    {product.bound > 0 && (
                                      <div className="text-xs text-secondary/70">
                                        {commonT('bindingPeriod', { count: product.bound })}
                                      </div>
                                    )}

                                    {/* Hardware section */}
                                    {hardwareType && (
                                      <div className="text-xs text-secondary/70 mt-2">
                                        <div className="font-medium text-secondary/80 mb-1">
                                          {locale === 'sv' ? 'Utrustning' : 'Equipment'}:
                                        </div>
                                        <div className="ml-2">
                                          1 X {getEquipmentName(hardwareType)} -{' '}
                                          {getEquipmentPricing(hardwareType)}
                                        </div>
                                      </div>
                                    )}

                                    {/* Addons section */}
                                    {relatedAddons.length > 0 && (
                                      <div className="text-xs text-secondary/70 mt-2">
                                        <div className="font-medium text-secondary/80 mb-1">
                                          {locale === 'sv' ? 'Tillägg' : 'Addons'}:
                                        </div>
                                        <div className="ml-2 space-y-1">
                                          {relatedAddons.map((addon) => (
                                            <div key={addon.id}>
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

                                // Handle TV Hardware with installment logic (same as TvHardwareCartItem)
                                if (isTvHardware) {
                                  const paytype =
                                    product.paytype || product.rawProductData?.paytype || '';
                                  const isOneTimePurchaseByPaytype =
                                    paytype.toLowerCase() === 'once';

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
                                              {roundedPrice(actualPrice * taxRate)}{' '}
                                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                            </div>
                                          )}
                                          {actualSetupPrice > 0 && (
                                            <div className="text-xs text-secondary/70">
                                              + {roundedPrice(actualSetupPrice * taxRate)}{' '}
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
                                            {roundedPrice(actualPrice * taxRate)}{' '}
                                            {commonT('currency')} {commonT('tax.inclVat')}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  );
                                }

                                // Regular TV service logic (existing)
                                const baseMonthlyPrice = parseFloat(
                                  product.m_price || product.rawProductData?.m_price || 0
                                );
                                const baseSetupPrice = parseFloat(
                                  product.s_price || product.rawProductData?.s_price || 0
                                );

                                // Get addons directly from the product's addons array (same as TvCartItem)
                                const relatedAddons = product.addons || [];

                                return (
                                  <div className="mt-1 space-y-1">
                                    {/* Base pricing */}
                                    {baseMonthlyPrice > 0 && (
                                      <div className="text-sm text-secondary/70">
                                        {roundedPrice(baseMonthlyPrice * taxRate)}{' '}
                                        {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                      </div>
                                    )}
                                    {baseSetupPrice > 0 && (
                                      <div className="text-xs text-secondary/70">
                                        + {roundedPrice(baseSetupPrice * taxRate)}{' '}
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
                                            {locale === 'sv' ? 'Stadsnät' : 'Citynet'}:{' '}
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
                                          {locale === 'sv' ? 'Tillägg' : 'Addons'}:
                                        </div>
                                        <div className="space-y-1">
                                          {relatedAddons.map((addon) => (
                                            <div
                                              key={addon.id}
                                              className="text-xs text-secondary/90"
                                            >
                                              {addon.qty} × {addon.name} -{' '}
                                              {roundedPrice(parseFloat(addon.m_price) * taxRate)}{' '}
                                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                            {/* Bredband category - with address and subscription details */}
                            {product.category === 'Bredband' &&
                              (() => {
                                // Check if this is a router product (using categoryType if available)
                                const isRouter =
                                  product.categoryType === 'ROUTER' ||
                                  product.name?.toLowerCase().includes('router') ||
                                  product.rawProductData?.name?.toLowerCase().includes('router');

                                // Handle router pricing logic (similar to RouterCartItem)
                                if (isRouter) {
                                  const paytype =
                                    product.paytype || product.rawProductData?.paytype || '';
                                  const isOneTimePurchaseByPaytype =
                                    paytype.toLowerCase() === 'once';

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

                                  // Check if it's an installment plan based on product name
                                  const isInstallmentByName =
                                    product.name?.toLowerCase().includes('avbetalning') ||
                                    product.name?.toLowerCase().includes('installment');

                                  let actualPrice = 0;
                                  let actualSetupPrice = 0;
                                  let isInstallmentPlan = false;
                                  // For installment plans, default to 12 months if no bound period is set
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
                                            {roundedPrice(actualPrice * taxRate)}{' '}
                                            {commonT('currency')} {commonT('tax.inclVat')}
                                          </div>
                                        )
                                      ) : (
                                        /* Regular subscription or installment pricing */
                                        <>
                                          {actualPrice > 0 && (
                                            <div className="text-sm text-secondary/70">
                                              {roundedPrice(actualPrice * taxRate)}{' '}
                                              {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                            </div>
                                          )}
                                          {actualSetupPrice > 0 && (
                                            <div className="text-xs text-secondary/70">
                                              + {roundedPrice(actualSetupPrice * taxRate)}{' '}
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
                                        {roundedPrice(monthlyPrice * taxRate)}{' '}
                                        {commonT('currencyPerMonth')} {commonT('tax.inclVat')}
                                      </div>
                                    )}
                                    {setupFee > 0 && (
                                      <div className="text-xs text-secondary/70">
                                        + {roundedPrice(setupFee * taxRate)}{' '}
                                        {commonT('currencySetupFee')} {commonT('tax.inclVat')}
                                      </div>
                                    )}

                                    {/* Address and subscription details */}
                                    <div className="text-xs text-secondary/70">
                                      {product.config?.customerType && (
                                        <div>
                                          <span className="font-medium">
                                            {commonT('customerTypeLabel')}{' '}
                                          </span>
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

                            {/* Other categories - fallback for any remaining categories */}
                            {!['Säkerhet', 'Telefoni', 'IP-telefoni', 'TV', 'Bredband'].includes(
                              product.category
                            ) && (
                              <div className="mt-1 text-sm text-secondary/70">
                                {roundedPrice((parseFloat(product.m_price) || 0) * taxRate)}{' '}
                                {commonT('currencyPerMonth')}
                                {parseFloat(product.s_price) > 0 &&
                                  ` (+${roundedPrice(
                                    (parseFloat(product.s_price) || 0) * taxRate
                                  )} ${commonT('currencySetupFee')})`}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <dl className="space-y-4 border-t border-divider px-4 py-6 sm:px-6">
                    {/* Clean, non-repetitive order summary matching /varukorg style */}
                    {cartTotalSetup > 0 && (
                      <div className="flex items-center justify-between">
                        <dt className="text-base font-medium text-secondary">
                          {t('orderSummary.totalOneTimeCosts')}
                        </dt>
                        <dd className="text-base font-medium text-secondary">
                          {roundedPrice(cartTotalSetup)} {commonT('currency')}{' '}
                          {commonT('tax.inclVat')}
                        </dd>
                      </div>
                    )}

                    {/* Simplified monthly pricing - no campaign display in order summary */}
                    {cartTotalMonthly > 0 && (
                      <div
                        className={`flex items-center justify-between ${
                          cartTotalSetup > 0 ? 'pt-2' : ''
                        }`}
                      >
                        <dt className="text-base font-medium text-secondary">
                          {t('orderSummary.totalMonthlyRecurring')}
                        </dt>
                        <dd className="text-base font-medium text-secondary">
                          {roundedPrice(cartTotalMonthly)} {commonT('currencyPerMonth')}{' '}
                          {commonT('tax.inclVat')}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="border-t border-divider px-4 py-6 sm:px-6">
                    <div className="space-y-2">
                      <div className="relative flex items-start gap-x-3">
                        <div className="flex h-6 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id="terms"
                              type="checkbox"
                              {...register('terms')}
                              className="col-start-1 row-start-1 appearance-none rounded-sm border border-divider bg-primary checked:border-accent checked:bg-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                            />
                            <svg
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-primary"
                              fill="none"
                              viewBox="0 0 14 14"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8L6 11L11 3.5"
                                className="opacity-0 group-has-[input:checked]:opacity-100"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="text-sm leading-6">
                          <label htmlFor="terms" className="text-secondary/80">
                            {t('termsAndConditions.agreementText', {
                              termsLink: t('termsAndConditions.termsLinkText'),
                              privacyLink: t('termsAndConditions.privacyLinkText'),
                            })
                              .replace(
                                t('termsAndConditions.termsLinkText'),
                                `<TERMS_LINK>${t('termsAndConditions.termsLinkText')}</TERMS_LINK>`
                              )
                              .replace(
                                t('termsAndConditions.privacyLinkText'),
                                `<PRIVACY_LINK>${t(
                                  'termsAndConditions.privacyLinkText'
                                )}</PRIVACY_LINK>`
                              )
                              .split(
                                /(<TERMS_LINK>.*?<\/TERMS_LINK>|<PRIVACY_LINK>.*?<\/PRIVACY_LINK>)/g
                              )
                              .map((part, i) => {
                                if (part.startsWith('<TERMS_LINK>')) {
                                  return (
                                    <Link
                                      key="terms-link"
                                      href="/allmana-villkor"
                                      className="font-medium text-accent hover:text-accent/80"
                                    >
                                      {t('termsAndConditions.termsLinkText')}
                                    </Link>
                                  );
                                }
                                if (part.startsWith('<PRIVACY_LINK>')) {
                                  return (
                                    <Link
                                      key="privacy-link"
                                      href="/integritetspolicy"
                                      className="font-medium text-accent hover:text-accent/80"
                                    >
                                      {t('termsAndConditions.privacyLinkText')}
                                    </Link>
                                  );
                                }
                                return <React.Fragment key={i}>{part}</React.Fragment>;
                              })}
                          </label>
                        </div>
                      </div>
                      {showTermsError && errors.terms && (
                        <p className="mt-1 text-sm text-failure">{errors.terms.message}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={showTermsError && !!errors.terms}
                      className="mt-6 w-full rounded-md border border-transparent bg-accent px-4 py-3 text-base font-medium text-primary shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t('confirmOrderButton')}
                    </button>
                    <p className="mt-4 flex justify-center text-xs text-secondary/70">
                      <LockClosedIcon
                        className="mr-1.5 size-4 text-secondary/50"
                        aria-hidden="true"
                      />
                      {t('securePaymentInfo')}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </LoadingWrapper>
  );
}
