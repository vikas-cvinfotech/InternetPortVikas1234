'use client';
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CompanyHeader({
  pathname,
  hostingRef,
  hostingOpen,
  setHostingOpen,
  hostingProducts = [],
  setMobileMenuOpen,
  mobileHidden,
}) {
  const t = useTranslations('header');

  const closeMobile = () => {
    if (setMobileMenuOpen) setMobileMenuOpen(false);
    if (window.innerWidth >= 1024) {
      setHostingOpen(false);
    }
  };
  return (
    <PopoverGroup
      className={`${
        mobileHidden ? mobileHidden : 'flex'
      } flex-col lg:flex-row lg:gap-x-12 lg:flex-1`}
    >
      {/* HOME */}
      <Link
        href="/foretag"
        onClick={closeMobile}
        onMouseEnter={closeMobile}
        className={`text-sm py-3 lg:p-0 font-semibold ${
          pathname === '/foretag' ? 'text-accent' : 'lg:text-primary'
        } hover:text-accent`}
      >
        {t('home')}
      </Link>

      {/* BROADBAND */}
      <Link
        href="/foretag/bredband"
        onClick={closeMobile}
        onMouseEnter={closeMobile}
        className={`text-sm py-3 lg:p-0 font-semibold ${
          pathname.startsWith('/foretag/bredband') ? 'text-accent' : 'lg:text-primary'
        } hover:text-accent`}
      >
        {t('broadband')}
      </Link>

      {/* HOSTING DROPDOWN */}
      <div ref={hostingRef}>
        <Popover
          className="relative group/menu"
          onMouseEnter={() => {
            if (window.innerWidth >= 1024) setHostingOpen(true);
          }}
        >
          <div className="flex items-center gap-1 justify-between lg:justify-start">
            {/* Hosting LINK */}
            <button
              type="button"
              onClick={closeMobile}
              className={`py-3 lg:p-0 text-sm font-semibold ${
                pathname.startsWith('/foretag/hosting') ? 'text-accent' : 'lg:text-primary'
              } lg:group-hover/menu:text-accent`}
            >
              {t('hosting')}
            </button>

            {/* Dropdown Trigger */}
            <PopoverButton
              className="flex items-center outline-none border-0 shadow-none 
             focus:outline-none focus:ring-0 focus:ring-offset-0
             active:outline-none active:ring-0"
              onClick={() => {
                window.innerWidth >= 1024 ? setHostingOpen(true) : setHostingOpen(!hostingOpen);
              }}
            >
              <ChevronDownIcon
                className={`w-5 h-5 ${
                  pathname.startsWith('/foretag/hosting') ? 'text-accent' : 'lg:text-primary/75'
                } lg:group-hover/menu:text-accent`}
              />
            </PopoverButton>
          </div>

          {hostingOpen && (
            <PopoverPanel
              static
              className="block rounded-lg bg-primary z-10 lg:mt-3 w-full lg:absolute lg:top-full lg:left-0 lg:w-[200px] lg:bg-primary lg:shadow-lg lg:ring-1 lg:ring-secondary/5 "
            >
              {hostingProducts.map((item) => (
                <div
                  key={item.name}
                  className="group flex gap-x-3 p-3 hover:bg-secondary/5 items-center"
                >
                  <div className="flex items-center justify-center rounded-lg size-11 lg:size-auto bg-secondaryBg lg:bg-transparent">
                    <item.icon className="size-6 text-secondary group-hover:text-accent" />
                  </div>

                  <div>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setHostingOpen(false);
                          closeMobile();
                        }}
                        className="font-semibold text-secondary hover:text-accent"
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => {
                          setHostingOpen(false);
                          closeMobile();
                        }}
                        className="font-semibold text-secondary hover:text-accent text-sm"
                      >
                        {item.name}
                      </Link>
                    )}

                    {/* <p className="mt-1 text-sm text-secondary">{item.description}</p> */}
                  </div>
                </div>
              ))}
            </PopoverPanel>
          )}
        </Popover>
      </div>

      {/* TELEPHONY */}
      <Link
        href="/foretag/telefoni"
        onClick={closeMobile}
        onMouseEnter={closeMobile}
        className={`text-sm py-3 lg:p-0 font-semibold lg:hover:text-accent ${
          pathname.startsWith('/foretag/telefoni') ? 'text-accent' : 'lg:text-primary'
        }`}
      >
        {t('telephony')}
      </Link>
    </PopoverGroup>
  );
}
