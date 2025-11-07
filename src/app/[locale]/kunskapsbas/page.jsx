'use client';

import * as React from 'react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import SearchArticles from '@/components/SearchArticles';

// Lazy load icons to reduce initial bundle size
const { lazy, Suspense } = React;
const GlobeAltIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.GlobeAltIcon }))
);
const PhoneIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.PhoneIcon }))
);
const TvIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.TvIcon }))
);
const ServerIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.ServerIcon }))
);
const CreditCardIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.CreditCardIcon }))
);
const WifiIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.WifiIcon }))
);
const ComputerDesktopIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.ComputerDesktopIcon }))
);
const CommandLineIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.CommandLineIcon }))
);
const CircleStackIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.CircleStackIcon }))
);
const BuildingStorefrontIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.BuildingStorefrontIcon }))
);
const WrenchScrewdriverIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.WrenchScrewdriverIcon }))
);
const ServerStackIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.ServerStackIcon }))
);
const LockClosedIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.LockClosedIcon }))
);
const WindowIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.WindowIcon }))
);
const HomeIcon = lazy(() =>
  import('@heroicons/react/24/solid').then((module) => ({ default: module.HomeIcon }))
);

export default function KnowledgeBasePage() {
  const t = useTranslations('knowledgeBase');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const isSwedish = locale === 'sv';

  // Define categories with inline slug ternaries
  const rawCategories = [
    {
      id: 17,
      slugName: isSwedish ? 'virtuell-privat-server' : 'virtual-private-server',
      categoryName: t('virtualPrivateServer'),
      icon: LockClosedIcon,
    },
    {
      id: 26,
      slugName: isSwedish ? 'windows' : 'windows',
      categoryName: t('windows'),
      icon: WindowIcon,
    },
    {
      id: 25,
      slugName: isSwedish ? 'hosting' : 'hosting',
      categoryName: t('hosting'),
      icon: ServerIcon,
    },
    {
      id: 24,
      slugName: isSwedish ? 'dedikerad-server' : 'dedicated-server',
      categoryName: t('dedicatedServer'),
      icon: ServerStackIcon,
    },
    {
      id: 23,
      slugName: isSwedish ? 'linux' : 'linux',
      categoryName: t('linux'),
      icon: CommandLineIcon,
    },
    {
      id: 22,
      slugName: isSwedish ? 'databas' : 'database',
      categoryName: t('database'),
      icon: CircleStackIcon,
    },
    {
      id: 21,
      slugName: isSwedish ? 'webbhotellhanterare' : 'web-hosting-manager',
      categoryName: t('whm'),
      icon: WrenchScrewdriverIcon,
    },
    {
      id: 20,
      slugName: isSwedish ? 'plesk' : 'plesk',
      categoryName: t('plesk'),
      icon: BuildingStorefrontIcon,
    },
    { id: 19, slugName: isSwedish ? 'cpanel' : 'cpanel', categoryName: t('cPanel'), icon: TvIcon },
    {
      id: 2,
      slugName: isSwedish ? 'ekonomi' : 'economy',
      categoryName: t('economy'),
      icon: CreditCardIcon,
    },
    {
      id: 11,
      slugName: isSwedish ? 'fritidshusabonnemang' : 'vacation-home-subscription',
      categoryName: t('vacationHomeSubscription'),
      icon: HomeIcon,
    },
    {
      id: 10,
      slugName: isSwedish ? 'domännamnsystemet' : 'domain-name-system',
      categoryName: t('dns'),
      icon: GlobeAltIcon,
    },
    {
      id: 9,
      slugName: isSwedish ? 'cloud-desktop' : 'cloud-desktop',
      categoryName: t('cloudDesktop'),
      icon: ComputerDesktopIcon,
    },
    {
      id: 8,
      slugName: isSwedish ? 'bredband' : 'broadband',
      categoryName: t('broadband'),
      icon: WifiIcon,
    },
    {
      id: 3,
      slugName: isSwedish ? 'ip-telefoni' : 'ip-telephony',
      categoryName: t('ipTelephony'),
      icon: PhoneIcon,
    },
  ];

  const categories = rawCategories.map(({ id, slugName, categoryName, icon }) => ({
    id,
    slug: `/kunskapsbas/kategori/${id}/${slugName}`,
    categoryName,
    icon,
  }));

  return (
    <div className="container mx-auto p-6 bg-primary">
      <h1 className="text-4xl font-bold text-center my-16 text-secondary">{t('title')}</h1>

      <div className="mb-12">
        <SearchArticles />
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-secondary">{t('categoriesTitle')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border border-divider p-4 rounded-lg flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow"
          >
            <Suspense
              fallback={<div className="h-12 w-12 bg-accent/10 rounded animate-pulse mb-2" />}
            >
              <category.icon className="h-12 w-12 text-accent mb-2" />
            </Suspense>
            <h3 className="text-lg font-semibold mb-2 text-secondary">{category.categoryName}</h3>
            <Link href={category.slug} className="text-accent hover:underline transition-colors">
              {t('viewArticles')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
