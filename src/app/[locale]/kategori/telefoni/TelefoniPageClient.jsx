'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslations } from 'next-intl';

// PERFORMANCE FIX: Lazy load listing components to reduce render-blocking
const ListingPageLayout = lazy(() =>
  import('@/components/products/listing').then((mod) => ({ default: mod.ListingPageLayout }))
);
const ListingHeader = lazy(() =>
  import('@/components/products/listing').then((mod) => ({ default: mod.ListingHeader }))
);
const ListingContent = lazy(() =>
  import('@/components/products/listing').then((mod) => ({ default: mod.ListingContent }))
);

// Helper to generate a URL-friendly slug (same as used in UnifiedProductPageController)
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function TelefoniPageClient({ locale }) {
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
  const [telephonyMinMonthly, setTelephonyMinMonthly] = useState(null);
  const [currentSort, setCurrentSort] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);

        // PERFORMANCE FIX: Add preconnect for faster API calls
        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = window.location.origin;
        if (!document.head.querySelector(`link[href="${window.location.origin}"]`)) {
          document.head.appendChild(preconnectLink);
        }

        // PERFORMANCE FIX: Preload critical LCP image for telephony service
        const criticalImage =
          'https://internetportcom.b-cdn.net/se/img/ip-telefoni-kvinna-talar-utomhus-strand.jpg?width=400&fit=cover&q=75&format=auto';
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = criticalImage;
        preloadLink.fetchPriority = 'high'; // High priority for LCP image
        if (!document.head.querySelector(`link[href="${criticalImage}"]`)) {
          document.head.appendChild(preloadLink);
        }

        const languageId = locale === 'sv'
          ? process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_SV || '9'
          : process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_EN || '2';
        const hardwareIds = [
          process.env.NEXT_PUBLIC_TELEPHONY_GIGASET_HARDWARE_ID,
          process.env.NEXT_PUBLIC_TELEPHONY_GRANDSTREAM_HARDWARE_ID,
          ...(process.env.NEXT_PUBLIC_TELEPHONY_MONTHLY_BOUND_HARDWARE_IDS || '')
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean),
        ]
          .filter(Boolean)
          .join(',');

        const cheapestServiceId = process.env.NEXT_PUBLIC_TELEPHONY_CHEAPEST_SERVICE_ID;
        const [hardwareData, serviceData] = await Promise.all([
          fetch(`/api/hostbill/get-products-by-ids?ids=${hardwareIds}&language_id=${languageId}&category=telefoni`).then(r => r.json()),
          fetch(`/api/hostbill/get-products-by-ids?ids=${cheapestServiceId}&language_id=${languageId}&category=telefoni`).then(r => r.json()),
        ]);

        // Set hardware products for display
        if (hardwareData.success) {
          setProducts(hardwareData.products || []);
        } else {
          setError(hardwareData.error || 'Kunde inte hämta telefoniprodukter');
        }

        // Calculate minimum price from service
        if (serviceData.success && serviceData.products && serviceData.products.length > 0) {
          const cheapestService = serviceData.products[0];
          let calculatedTelephonyMinMonthly = null;

          if (
            cheapestService &&
            cheapestService.pricingOptions &&
            cheapestService.pricingOptions.length > 0
          ) {
            const monthlyOption = cheapestService.pricingOptions.find(
              (opt) => opt.period === 'monthly'
            );
            const selectedOption = monthlyOption || cheapestService.pricingOptions[0];
            if (selectedOption && selectedOption.price > 0) {
              calculatedTelephonyMinMonthly = Math.round(selectedOption.price * 1.25);
            }
          }

          setTelephonyMinMonthly(calculatedTelephonyMinMonthly);
        }
      } catch (err) {
        console.error('Error fetching telephony products:', err);
        setError('Ett fel uppstod vid hämtning av produkter');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [locale]);

  const telephonyServices = [
    {
      key: 'ip-telefoni',
      name: t('serviceCards.telefoni.ipTelefoni'),
      href: `/kategori/telefoni/ip-telefoni`,
      image:
        'https://internetportcom.b-cdn.net/se/img/ip-telefoni-kvinna-talar-utomhus-strand.jpg?width=400&fit=cover&q=75&format=auto',
      fromPrice: telephonyMinMonthly,
      priority: true,
    },
  ];

  return (
    <Suspense
      fallback={
        <div className="bg-primary">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="pb-6 border-b border-secondary/10">
              <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                {t('categoriesPage.categories.telephony.name')}
              </h1>
              <p className="mt-4 text-base text-secondary/70">
                {t('categoryPages.telephony.subtitle')}
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
          title={t('categoriesPage.categories.telephony.name')}
          subtitle={t('categoryPages.telephony.subtitle')}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
        />
        <ListingContent
          products={products}
          services={telephonyServices}
          isLoading={isLoading}
          error={error}
          categorySlug="telefoni"
          locale={locale}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
        />
      </ListingPageLayout>
    </Suspense>
  );
}
