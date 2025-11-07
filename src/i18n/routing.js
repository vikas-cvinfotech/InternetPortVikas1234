import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  domains: [
    {
      domain: 'internetport.com',
      defaultLocale: 'en',
      locales: ['en', 'sv'],
    },
    {
      domain: 'internetport.se',
      defaultLocale: 'sv',
      locales: ['sv', 'en'],
    },
    {
      domain: 'dev.internetport.se',
      defaultLocale: 'sv',
      locales: ['sv', 'en'],
    },
    {
      domain: 'test.internetport.se',
      defaultLocale: 'sv',
      locales: ['sv', 'en'],
    },
    {
      domain: 'dev.internetport.com',
      defaultLocale: 'en',
      locales: ['en', 'sv'],
    },
    {
      domain: 'localhost:3000',
      defaultLocale: 'sv',
      locales: ['sv', 'en'],
    },
    // Local development
    {
      domain: 'localhost:3000',
      defaultLocale: 'sv',
      locales: ['sv'],
    },
    {
      domain: 'localhost:3001',
      defaultLocale: 'en',
      locales: ['en', 'sv'],
    },
  ],
  locales: ['sv', 'en'],
  defaultLocale: 'sv',
  localePrefix: 'as-needed',
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
