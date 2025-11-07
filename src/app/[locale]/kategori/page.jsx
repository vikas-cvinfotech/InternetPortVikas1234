'use client';

import { useState, useEffect } from 'react';
import CategoryCard from '@/components/products/CategoryCard';
import { use } from 'react';
import { useTranslations } from 'next-intl';

export default function CategoriesPage({ params }) {
  const resolvedParams = use(params);
  const locale = resolvedParams?.locale || 'sv';
  const t = useTranslations('categoriesPage');

  const [isLoading, setIsLoading] = useState(false);

  const baseCategoryData = [
    {
      name: t('categories.broadband.name'),
      slug: 'bredband',
      description: t('categories.broadband.description'),
      imageSrc: 'https://internetportcom.b-cdn.net/se/img/kategori-router.jpg?q=100&auto=format',
      imageAlt: 'Modern broadband and internet connection equipment',
    },
    {
      name: t('categories.telephony.name'),
      slug: 'telefoni',
      description: t('categories.telephony.description'),
      imageSrc: 'https://internetportcom.b-cdn.net/se/img/kategori-telefoni.jpg?q=100&auto=format',
      imageAlt: 'Modern home phone and IP telephony setup',
    },
    {
      name: t('categories.tv.name'),
      slug: 'tv',
      description: t('categories.tv.description'),
      imageSrc: 'https://internetportcom.b-cdn.net/se/img/kategori-tv.jpg?q=100&auto=format',
      imageAlt: 'Modern TV and entertainment streaming setup',
    },
    {
      name: t('categories.hosting.name'),
      slug: 'hosting',
      description: t('categories.hosting.description'),
      imageSrc: 'https://internetportcom.b-cdn.net/se/img/kategori-hosting.jpg?q=100&auto=format',
      imageAlt: 'Server room with hosting and web infrastructure',
      href: 'https://internetport.com',
      isExternal: true,
    },
    {
      name: t('categories.security.name'),
      slug: 'sakerhet',
      description: t('categories.security.description'),
      imageSrc: 'https://internetportcom.b-cdn.net/se/img/kategori-sakerhet.jpg?q=100&auto=format',
      imageAlt: 'Digital security and encryption concept with lock icons',
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-12 sm:py-14 lg:max-w-none lg:py-20">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                {t('title')}
              </h1>
              <p className="mt-4 text-lg text-secondary/70 max-w-3xl mx-auto">{t('subtitle')}</p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group relative">
                  <div className="relative flex h-72 w-full flex-col overflow-hidden rounded-lg p-6 animate-pulse">
                    <div className="absolute inset-0 bg-secondary/10"></div>
                    <div className="relative mt-auto text-center">
                      <div className="h-6 bg-secondary/20 rounded mb-2 w-24 mx-auto"></div>
                      <div className="h-4 bg-secondary/20 rounded w-32 mx-auto"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-14 lg:max-w-none lg:py-20">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-secondary/70 max-w-3xl mx-auto">{t('subtitle')}</p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {baseCategoryData.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                slug={category.slug}
                description={category.description}
                imageSrc={category.imageSrc}
                imageAlt={category.imageAlt}
                href={category.href}
                isExternal={category.isExternal}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}