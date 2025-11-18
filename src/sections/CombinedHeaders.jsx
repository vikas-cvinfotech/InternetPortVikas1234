'use client';

import { useState, useMemo, Fragment, useRef, useEffect, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { useStatusData } from '@/hooks/useStatusData';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import {
  Bars3Icon,
  // ShoppingBagIcon,
  // UserIcon,
  XMarkIcon,
  WifiIcon,
  TvIcon,
  ServerIcon,
  ShieldCheckIcon,
  PhoneIcon as PhoneIconOutline,
} from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon, UserIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import {
  ChevronDownIcon,
  PhoneIcon as PhoneIconSolid,
  ChevronRightIcon,
  Squares2X2Icon,
  GlobeAltIcon,
  CloudIcon,
  RectangleStackIcon,
} from '@heroicons/react/20/solid';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import { TransitionChild } from '@headlessui/react';
import SocialSection from './SocialSection';

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

const IncidentBannerContent = ({ component, tStatus }) => (
  <Link
    href="/driftstatus"
    className="flex-1 text-center text-sm font-medium text-primary lg:flex-none hover:text-primary/80 transition-colors"
  >
    <ExclamationTriangleIcon className="inline-block size-4 mr-2 align-middle" />
    <span className="font-bold align-middle">
      {component.name} - {tStatus(component.statusTitleKey)}
    </span>
    <ChevronRightIcon className="inline-block size-4 ml-1 align-middle" />
  </Link>
);

const DefaultBannerContent = ({ announcement }) => (
  <p className="flex-1 text-center text-sm font-medium text-primary lg:flex-none">{announcement}</p>
);

export default function CombinedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hostingOpen, setHostingOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hostingRef = useRef(null);
  const servicesRef = useRef(null);
  const companyRef = useRef(null);

  useClickOutside(hostingRef, () => setHostingOpen(false));
  useClickOutside(servicesRef, () => setServicesOpen(false));
  useClickOutside(companyRef, () => setCompanyOpen(false));

  const t = useTranslations('header');
  const tStatus = useTranslations('operationalStatus');
  const { totalItems, isLoadingCart } = useCart();
  const displayCartCount = totalItems;
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const { components, isLoading: isLoadingStatus } = useStatusData({ locale });

  const firstIncidentComponent = useMemo(() => {
    if (isLoadingStatus || !components) return null;
    return components.find((c) => c.status !== 1);
  }, [components, isLoadingStatus]);

  const hasOngoingIssues = !!firstIncidentComponent;

  const announcement = t('announcement');
  // A missing translation key for 'announcement' will result in the string 'announcement' being returned.
  // We don't want to display this as an announcement, so we check for it.
  const showAnnouncement = announcement && announcement !== 'announcement';

  const availableLanguages = [
    { code: 'sv', label: t('swedish') },
    { code: 'en', label: t('english') },
  ];

  const products = useMemo(
    () => [
      {
        name: t('servicesMenu.broadband.name'),
        description: t('servicesMenu.broadband.description'),
        href: '/kategori/bredband',
        icon: WifiIcon,
      },
      {
        name: t('servicesMenu.telephony.name'),
        description: t('servicesMenu.telephony.description'),
        href: '/kategori/telefoni',
        icon: PhoneIconOutline,
      },
      {
        name: t('servicesMenu.tv.name'),
        description: t('servicesMenu.tv.description'),
        href: '/kategori/tv',
        icon: TvIcon,
      },
      {
        name: t('servicesMenu.hosting.name'),
        description: t('servicesMenu.hosting.description'),
        href: 'https://internetport.com',
        icon: ServerIcon,
        external: true,
      },
      {
        name: t('servicesMenu.security.name'),
        description: t('servicesMenu.security.description'),
        href: '/kategori/sakerhet',
        icon: ShieldCheckIcon,
      },
    ],
    [t]
  );

  const callsToAction = useMemo(
    () => [
      { name: t('servicesMenu.callsToAction.categories'), href: '/kategori', icon: Squares2X2Icon },
      {
        name: t('servicesMenu.callsToAction.support'),
        href: '/kontakta-oss',
        icon: PhoneIconSolid,
      },
    ],
    [t]
  );

  const company = useMemo(
    () => [
      {
        name: t('businessMenu.aboutUs'),
        href: '/om-oss',
        description: t('businessMenu.aboutUsDescription'),
      },
      {
        name: t('businessMenu.careers'),
        href: '/karriar',
        description: t('businessMenu.careersDescription'),
      },
      {
        name: t('businessMenu.contactUs'),
        href: '/kontakta-oss',
        description: t('businessMenu.contactUsDescription'),
      },
      {
        name: t('businessMenu.support'),
        href: '/kontakta-oss',
        description: t('businessMenu.supportDescription'),
      },
    ],
    [t]
  );

  const categories = [
    { name: t('private'), href: '/' },
    // { name: t('company'), href: 'https://business.internetport.se/' },
    { name: t('company'), href: '/foretag' },
    { name: t('brf'), href: '/brf' },
  ];

  const handleLanguageChange = (newLocale) => {
    startTransition(() => {
      router.push(pathname, { locale: newLocale });
      router.refresh();
    });
  };

  return (
    <div className={`bg-primary transition-opacity ${isPending ? 'opacity-75' : 'opacity-100'}`}>
      {/* Mobile menu */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog onClose={setMobileMenuOpen} className="relative z-40 lg:hidden">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-secondary/25" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 left-0 z-50 flex w-full flex-col justify-between overflow-y-auto bg-primary shadow-xl sm:max-w-sm">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-md p-2.5 text-secondary"
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-1.5 p-1.5"
                    aria-label="Internetport Sweden AB"
                  >
                    <span className="sr-only">Internetport Sweden AB</span>
                    <Image
                      alt="Internetport Sweden AB logo"
                      src="https://internetportcom.b-cdn.net/com/internetport-logo.png"
                      width={200}
                      height={53}
                      className="h-7 md:h-8 w-auto"
                      quality={95}
                      priority
                    />
                  </Link>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-divider">
                    <div className="space-y-2 py-6">
                      {products.map((item) => {
                        const commonProps = {
                          onClick: () => setMobileMenuOpen(false),
                          className:
                            'group -mx-3 flex items-center gap-x-6 rounded-lg p-3 text-base/7 font-semibold text-secondary hover:bg-secondary/5',
                        };

                        const content = (
                          <>
                            <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-secondary/5 group-hover:bg-primary">
                              <item.icon
                                aria-hidden="true"
                                className="size-6 text-secondary group-hover:text-accent"
                              />
                            </div>
                            {item.name}
                          </>
                        );

                        if (item.external) {
                          return (
                            <a
                              key={item.name}
                              {...commonProps}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <Link key={item.name} {...commonProps} href={item.href}>
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="space-y-2 py-6">
                      <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-secondary hover:bg-secondary/5"
                      >
                        {t('home')}
                      </Link>
                      {company.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-secondary hover:bg-secondary/5"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-2 py-6">
                      {categories.map((item) => {
                        const { href, name } = item;
                        let isActive;
                        if (href === '/') {
                          isActive =
                            !pathname.startsWith('/brf') && !pathname.startsWith('/foretag');
                        } else {
                          isActive = pathname.startsWith(href);
                        }
                        const className = `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-secondary hover:bg-secondary/5 ${
                          isActive
                            ? 'underline decoration-accent underline-offset-4 decoration-2'
                            : ''
                        }`;
                        if (href.startsWith('http')) {
                          return (
                            <a
                              key={name}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMobileMenuOpen(false)}
                              className={className}
                            >
                              {name}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={name}
                            href={href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={className}
                          >
                            {name}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="space-y-2 py-6">
                      <a
                        href="https://portal.internetport.com/signup/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-secondary hover:bg-secondary/5"
                      >
                        {t('createAnAccount')}
                      </a>
                      <a
                        href="https://portal.internetport.com/clientarea/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-secondary hover:bg-secondary/5"
                      >
                        {t('login')}
                      </a>
                    </div>
                    <div className="py-6">
                      <form className="-mx-3 px-3">
                        <div className="relative">
                          <select
                            id="mobile-currency"
                            name="currency"
                            aria-label="Language"
                            value={locale}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            disabled={isPending}
                            className="block w-full appearance-none rounded-lg bg-primary py-2.5 pl-3 pr-10 text-base/7 font-semibold text-secondary hover:bg-secondary/5 focus:outline-none focus:ring-2 focus:ring-accent"
                          >
                            {availableLanguages.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="size-5 text-secondary/75"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 grid grid-cols-2 divide-x divide-secondary/5 bg-primary text-center">
                {callsToAction.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 text-base/7 font-semibold text-secondary hover:bg-secondary/10"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>

      {/* Desktop Header */}
      <header className="relative bg-primary">
        <div className="bg-secondary">
          <div
            className={`mx-auto flex items-center justify-between  ${
              hasOngoingIssues || showAnnouncement ? 'h-10' : 'h-0 lg:h-10'
            } px-[24px] sm:px-[40px] lg:px-[50px] xl:px-[80px] xxl:px-[135px]`}
          >
            <div className="hidden lg:flex lg:flex-1">
              <form>
                <div className="-ml-2 inline-grid grid-cols-1">
                  <select
                    id="desktop-currency"
                    name="currency"
                    aria-label="Language"
                    value={locale}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    disabled={isPending}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-secondary py-0.5 pr-7 pl-2 text-left text-base font-medium text-primary focus:outline-2 focus:-outline-offset-1 focus:outline-primary sm:text-sm/6"
                  >
                    {availableLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-1 size-5 self-center justify-self-end fill-primary"
                  />
                </div>
              </form>
            </div>
            <div className="flex justify-center">
              {hasOngoingIssues ? (
                <IncidentBannerContent component={firstIncidentComponent} tStatus={tStatus} />
              ) : (
                showAnnouncement && <DefaultBannerContent announcement={announcement} />
              )}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-2">
              {categories.map((item) => {
                const { href, name } = item;
                if (href.startsWith('http')) {
                  return (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm px-[20px] py-[4px] text-sm/6 font-medium text-primary hover:bg-primary/10"
                    >
                      {name}
                    </a>
                  );
                }
                let isActive;
                if (href === '/') {
                  isActive = !pathname.startsWith('/brf') && !pathname.startsWith('/foretag');
                } else {
                  isActive = pathname.startsWith(href);
                }
                return (
                  <Link
                    key={name}
                    href={href}
                    className={`rounded-sm px-[20px] py-[4px] text-sm/6 font-medium transition-colors ${
                      isActive ? 'bg-primary text-accent' : 'text-primary hover:bg-primary/10'
                    }`}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <nav aria-label="Top" className="navtop">
          <div className="border-0 border-divider">
            <div className="hidden lg:flex items-center justify-between py-[30px] mx-auto px-[24px] lg:px-[50px] xl:px-[80px] xxl:px-[135px]">
              <Link href="/" className="flex lg:ml-0" aria-label="Internetport Sweden AB">
                <span className="sr-only">Internetport Sweden AB</span>
                <Image
                  alt="Internetport Sweden AB logo"
                  src="https://internetportcom.b-cdn.net/com/internetport-logo.png"
                  width={200}
                  height={53}
                  className="h-7 md:h-8 w-auto"
                  quality={95}
                  priority
                />
              </Link>
              <div className="right-side hidden lg:block">
                <SocialSection />
              </div>
            </div>
            <div className="bg-secondary">
              <div className="flex h-16 items-center justify-between mx-auto px-[24px] lg:px-[50px] xl:px-[80px] xxl:px-[135px] border-[0px] border-none">
                <div className="flex flex-1 items-center lg:hidden">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-ml-2 rounded-md bg-primary p-2 text-secondary"
                  >
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12 lg:flex-1">
                  <Link
                    href="/"
                    className={`text-sm font-semibold hover:text-accent ${
                      pathname === '/' ? 'text-accent' : 'text-primary'
                    }`}
                  >
                    {t('home')}
                  </Link>
                  <div ref={servicesRef}>
                    <Popover className="relative group/menu">
                      <PopoverButton
                        onClick={() => {
                          setServicesOpen(!servicesOpen);
                          setCompanyOpen(false);
                        }}
                        className={`flex items-center gap-x-1 text-sm font-semibold group-hover/menu:text-accent  outline-none focus:outline-none1 ${
                          pathname.startsWith('/kategori') ? 'text-accent' : 'text-primary'
                        }`}
                      >
                        {t('services')}
                        <ChevronDownIcon
                          aria-hidden="true"
                          className={`size-5 flex-none  group-hover/menu:text-accent ${
                            pathname.startsWith('/kategori') ? 'text-accent' : 'text-primary/75'
                          }`}
                        />
                      </PopoverButton>
                      {servicesOpen && (
                        <PopoverPanel
                          static
                          transition
                          className="absolute top-full left-0 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-primary shadow-lg ring-1 ring-secondary/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                        >
                          <div className="p-4">
                            {products.map((item) => (
                              <div
                                key={item.name}
                                className="group relative flex gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-secondary/5"
                              >
                                <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-secondary/5 group-hover:bg-primary">
                                  <item.icon
                                    aria-hidden="true"
                                    className="size-6 text-secondary group-hover:text-accent"
                                  />
                                </div>
                                <div className="flex-auto">
                                  {item.external ? (
                                    <a
                                      href={item.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setServicesOpen(false)}
                                      className="block font-semibold text-secondary"
                                    >
                                      {item.name}
                                      <span className="absolute inset-0" />
                                    </a>
                                  ) : (
                                    <Link
                                      href={item.href}
                                      onClick={() => setServicesOpen(false)}
                                      className="block font-semibold text-secondary"
                                    >
                                      {item.name}
                                      <span className="absolute inset-0" />
                                    </Link>
                                  )}
                                  <p className="mt-1 text-sm text-secondary">{item.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 divide-x divide-divider bg-secondary/5">
                            {callsToAction.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setServicesOpen(false)}
                                className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-secondary hover:bg-secondary/10"
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className="size-5 flex-none text-secondary/75"
                                />
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </PopoverPanel>
                      )}
                    </Popover>
                  </div>
                  <div ref={companyRef}>
                    <Popover className="relative group/menu">
                      <PopoverButton
                        onClick={() => {
                          setCompanyOpen(!companyOpen);
                          setServicesOpen(false);
                        }}
                        className={`flex items-center gap-x-1 text-sm font-semibold group-hover/menu:text-accent outline-none focus:outline-none ${
                          pathname.startsWith('/om-oss') ||
                          pathname.startsWith('/karriar') ||
                          pathname.startsWith('/kontakta-oss')
                            ? 'text-accent'
                            : 'text-primary'
                        }`}
                      >
                        {t('ourCompany')}
                        <ChevronDownIcon
                          aria-hidden="true"
                          className={`size-5 flex-none  group-hover/menu:text-accent ${
                            pathname.startsWith('/om-oss') ||
                            pathname.startsWith('/karriar') ||
                            pathname.startsWith('/kontakta-oss')
                              ? 'text-accent'
                              : 'text-primary/75'
                          }`}
                        />
                      </PopoverButton>
                      {companyOpen && (
                        <PopoverPanel
                          static
                          className="absolute top-full -left-8 z-10 mt-3 w-96 rounded-3xl bg-primary p-4 shadow-lg ring-1 ring-secondary/5"
                        >
                          {company
                            .filter((item) => item.name !== t('businessMenu.support'))
                            .map((item) => (
                              <div
                                key={item.name}
                                className="relative rounded-lg p-4 hover:bg-secondary/5"
                              >
                                <Link
                                  href={item.href}
                                  onClick={() => setCompanyOpen(false)}
                                  className="block text-sm/6 font-semibold text-secondary"
                                >
                                  {item.name}
                                  <span className="absolute inset-0" />
                                </Link>
                                {item.description && (
                                  <p className="mt-1 text-sm/6 text-secondary">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            ))}
                        </PopoverPanel>
                      )}
                    </Popover>
                  </div>
                </PopoverGroup>

                <div className="flex flex-1 items-center justify-end h-full">
                  <a
                    href="https://portal.internetport.com/clientarea/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:text-accent"
                  >
                    <span className="sr-only">Account</span>
                    <UserIcon aria-hidden="true" className="size-6" />
                  </a>
                  <div className="ml-4 flow-root lg:ml-6">
                    <Link href="/varukorg" className="group -m-2 flex items-center p-2 relative">
                      <ShoppingBagIcon
                        aria-hidden="true"
                        className="size-6 text-primary group-hover:text-accent"
                      />
                      {!isLoadingCart && displayCartCount > 0 && (
                        <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-medium text-primary">
                          {displayCartCount}
                        </span>
                      )}
                      <span className="sr-only">items in cart, view bag</span>
                    </Link>
                  </div>
                  <Link
                    href="/kontakta-oss"
                    className="hidden text-base font-semibold text-primary lg:flex lg:ms-6 bg-accent hover:bg-hoveraccent h-full px-[30px] items-center justify-center gap-2"
                  >
                    {t('businessMenu.support')}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.804 21.644C5.1987 21.715 5.59897 21.7505 6 21.75C7.26747 21.7517 8.50959 21.395 9.583 20.721C10.357 20.903 11.167 21 12 21C17.322 21 21.75 17.03 21.75 12C21.75 6.97 17.322 3 12 3C6.678 3 2.25 6.97 2.25 12C2.25 14.409 3.275 16.587 4.924 18.192C5.156 18.418 5.201 18.62 5.178 18.735C5.05442 19.3571 4.77426 19.9373 4.364 20.421C4.27883 20.5215 4.22165 20.6428 4.19823 20.7724C4.17481 20.9021 4.18596 21.0357 4.23057 21.1597C4.27518 21.2836 4.35167 21.3937 4.45233 21.4787C4.553 21.5638 4.67429 21.6208 4.804 21.644ZM8.25 10.875C7.95163 10.875 7.66548 10.9935 7.4545 11.2045C7.24353 11.4155 7.125 11.7016 7.125 12C7.125 12.2984 7.24353 12.5845 7.4545 12.7955C7.66548 13.0065 7.95163 13.125 8.25 13.125C8.54837 13.125 8.83452 13.0065 9.0455 12.7955C9.25647 12.5845 9.375 12.2984 9.375 12C9.375 11.7016 9.25647 11.4155 9.0455 11.2045C8.83452 10.9935 8.54837 10.875 8.25 10.875ZM10.875 12C10.875 11.7016 10.9935 11.4155 11.2045 11.2045C11.4155 10.9935 11.7016 10.875 12 10.875C12.2984 10.875 12.5845 10.9935 12.7955 11.2045C13.0065 11.4155 13.125 11.7016 13.125 12C13.125 12.2984 13.0065 12.5845 12.7955 12.7955C12.5845 13.0065 12.2984 13.125 12 13.125C11.7016 13.125 11.4155 13.0065 11.2045 12.7955C10.9935 12.5845 10.875 12.2984 10.875 12ZM15.75 10.875C15.4516 10.875 15.1655 10.9935 14.9545 11.2045C14.7435 11.4155 14.625 11.7016 14.625 12C14.625 12.2984 14.7435 12.5845 14.9545 12.7955C15.1655 13.0065 15.4516 13.125 15.75 13.125C16.0484 13.125 16.3345 13.0065 16.5455 12.7955C16.7565 12.5845 16.875 12.2984 16.875 12C16.875 11.7016 16.7565 11.4155 16.5455 11.2045C16.3345 10.9935 16.0484 10.875 15.75 10.875Z"
                        fill="white"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
