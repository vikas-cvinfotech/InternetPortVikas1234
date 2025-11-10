import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { TicketIcon } from '@heroicons/react/24/solid';

export default function SupportSection() {
  const t = useTranslations('supportSection');

  // Use CSS custom properties for colors to maintain consistency with Tailwind palette
  // These will resolve to the actual hex values defined in tailwind.config.mjs
  const accentColor = 'rgb(190 24 35)'; // Corresponds to accent color from palette
  const lighterAccentColor = 'rgb(190 24 35)'; // Using same accent color as no lighter variant is defined

  return (
    <div className="relative">
      <div className="relative h-80 overflow-hidden  md:absolute md:left-0 md:h-full w-full">
        <Image
          alt=""
          src="https://internetportcom.b-cdn.net/se/img/helpimagetwo.webp"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1D1D1D]/[0.14] " />
      </div>
      <div className="relative mx-auto py-16 sm:py-24 lg:px-8 ">
        <div className="text-center px-4 sm:px-[80px] xxl:px-[135px]">
          {/* <h2 className="text-base/7 font-semibold text-accent">{t('supportHeading')}</h2> */}
          <p className="mt-2 text-4xl font-semibold tracking-tight text-primary sm:text-5xl capitalize">
            {t('helpHeading1')}
            <span className="text-accent"> {t('helpHeading2')}</span>
          </p>
          <p className="mt-6 text-lg text-primary">{t('supportText')}</p>
          <div className="mt-14">
            <Link
              href="/kontakta-oss"
              className="inline-flex rounded-md bg-accent px-3.5 py-2.5 text-base font-semibold text-primary shadow-xs hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t('createTicket')}
              <TicketIcon aria-hidden="true" className="size-6 text-primary ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
