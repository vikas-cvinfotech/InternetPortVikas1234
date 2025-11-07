'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslations } from 'next-intl';

const ListingPageLayout = lazy(() =>
  import('@/components/products/listing').then((mod) => ({ default: mod.ListingPageLayout }))
);
const ListingHeader = lazy(() =>
  import('@/components/products/listing').then((mod) => ({ default: mod.ListingHeader }))
);
const ListingContent = lazy(() =>
  import('@/components/products/listing').then((mod) => ({ default: mod.ListingContent }))
);

export default function SakerhetPageClient({ locale }) {
  const t = useTranslations();

  const sortOptions = [
    { name: t('listing.sort.options.priceLowToHigh'), href: '#', current: false },
    { name: t('listing.sort.options.priceHighToLow'), href: '#', current: false },
    { name: t('listing.sort.options.aToZ'), href: '#', current: false },
    { name: t('listing.sort.options.zToA'), href: '#', current: false },
  ];


  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);

        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = window.location.origin;
        if (!document.head.querySelector(`link[href="${window.location.origin}"]`)) {
          document.head.appendChild(preconnectLink);
        }

        const languageId = locale === 'sv'
          ? process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_SV || '9'
          : process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_EN || '2';

        const campaignProductIds = process.env.NEXT_PUBLIC_NORDVPN_CAMPAIGN_PRODUCT_IDS || '';

        const response = await fetch(
          `/api/hostbill/get-products-by-ids?ids=${campaignProductIds}&language_id=${languageId}&category=sakerhet`
        );
        const data = await response.json();

        if (data.success) {
          setProducts(data.products || []);
        } else {
          setError(data.error || 'Kunde inte hämta produkter');
        }
      } catch (err) {
        console.error('Error fetching security products:', err);
        setError('Ett fel uppstod vid hämtning av produkter');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [locale]);


  return (
    <Suspense
      fallback={
        <div className="bg-primary">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="pb-6 border-b border-secondary/10">
              <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                {t('categoriesPage.categories.security.name')}
              </h1>
              <p className="mt-4 text-base text-secondary/70">
                {t('categoryPages.security.subtitle')}
              </p>
            </div>
            <section className="pb-24 pt-6">
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-x-8 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-secondary/10 rounded-lg" />
                    <div className="h-4 bg-secondary/10 rounded w-3/4" />
                    <div className="h-6 bg-secondary/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      }
    >
      <ListingPageLayout locale={locale}>
        <ListingHeader
          title={t('categoriesPage.categories.security.name')}
          subtitle={t('categoryPages.security.subtitle')}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
        />
        <ListingContent
          products={products}
          isLoading={isLoading}
          error={error}
          categorySlug="sakerhet"
          locale={locale}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
        />
      </ListingPageLayout>
    </Suspense>
  );
}