import '../globals.css';
// import { Figtree } from 'next/font/google';
import { IBM_Plex_Sans, Figtree } from 'next/font/google';
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import FooterCompanyMission from '@/sections/FooterCompanyMission';
import CombinedHeader from '@/sections/CombinedHeaders';
import { CartProvider } from '@/context/CartContext';
import 'react-datepicker/dist/react-datepicker.css';
import { OrderProvider } from '@/context/OrderContext';
import CookieBanner from '@/components/CookieBanner';
import GoogleTagManager from '@/components/GoogleTagManager';
import SupportWidget from '@/components/SupportWidget';

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  display: 'swap', // Add font-display: swap for faster text rendering
  preload: true, // Preload the font
});
const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// Dynamic Metadata API with i18n support
export async function generateMetadata({ params }) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid.
  if (!routing.locales || !routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to get metadata translations.
  const messages = await getMessages();

  return {
    title: messages.metadata?.title || 'Internetport Sweden AB',
    description:
      messages.metadata?.description ||
      'Internetport Sweden AB tillhandahåller flexibla, skalbara IT-lösningar, bredband och telefontjänster för företag och privatpersoner.',
    icons: {
      icon: [
        {
          url: 'https://internetportcom.b-cdn.net/se/img/favicon-16x16.png',
          sizes: '16x16',
        },
        {
          url: 'https://internetportcom.b-cdn.net/se/img/favicon-32x32.png',
          sizes: '32x32',
        },
        { url: 'https://internetportcom.b-cdn.net/se/img/favicon.ico' },
      ],
      apple: 'https://internetportcom.b-cdn.net/se/img/apple-touch-icon.png',
      android: [
        {
          url: 'https://internetportcom.b-cdn.net/se/img/android-chrome-192x192.png',
          sizes: '192x192',
        },
        {
          url: 'https://internetportcom.b-cdn.net/se/img/android-chrome-512x512.png',
          sizes: '512x512',
        },
      ],
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid.
  if (!routing.locales || !routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client.
  const messages = await getMessages();

  return (
    <div className={`${ibmPlexSans.variable} ${figtree.variable} antialiased`}>
      <GoogleTagManager />
      <CartProvider>
        <OrderProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <CombinedHeader />
            {children}
            <CookieBanner />
            <FooterCompanyMission />
            <SupportWidget />
          </NextIntlClientProvider>
        </OrderProvider>
      </CartProvider>
    </div>
  );
}
