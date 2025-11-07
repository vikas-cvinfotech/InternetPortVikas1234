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

export default function TvPageClient({ locale }) {
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
  const [tvFamilyPricing, setTvFamilyPricing] = useState({ basic: null, plus: null });
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

        // PERFORMANCE FIX: Preload critical LCP images for TV services
        const tvServiceImages = [
          'https://internetportcom.b-cdn.net/se/img/tva-personer-tittar-pa-tv-hemma-vardagsrum.jpg?width=400&fit=cover&q=75&format=auto',
          'https://internetportcom.b-cdn.net/se/img/fotboll-pa-tv-fjarrkontroll-sportkanaler-hemma.jpg?width=400&fit=cover&q=75&format=auto',
        ];

        tvServiceImages.forEach((src, index) => {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = src;
          if (index === 0) preloadLink.fetchPriority = 'high'; // First image gets high priority
          if (!document.head.querySelector(`link[href="${src}"]`)) {
            document.head.appendChild(preloadLink);
          }
        });

        const languageId = locale === 'sv'
          ? process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_SV || '9'
          : process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_EN || '2';

        const tvBoxIds = process.env.NEXT_PUBLIC_TV_BOXES_IDS || '';
        const tvBaspaketIds = process.env.NEXT_PUBLIC_TV_BASPAKET_SERVICE_IDS || '';
        const tvBaspaketPlusIds = process.env.NEXT_PUBLIC_TV_BASPAKET_PLUS_SERVICE_IDS || '';
        const [hardwareData, baspaketData, baspaketPlusData] = await Promise.all([
          fetch(`/api/hostbill/get-products-by-ids?ids=${tvBoxIds}&language_id=${languageId}&category=tv`).then(r => r.json()),
          fetch(`/api/hostbill/get-products-by-ids?ids=${tvBaspaketIds}&language_id=${languageId}&category=tv`).then(r => r.json()),
          fetch(`/api/hostbill/get-products-by-ids?ids=${tvBaspaketPlusIds}&language_id=${languageId}&category=tv`).then(r => r.json()),
        ]);

        // Set hardware products for display
        if (hardwareData.success) {
          setProducts(hardwareData.products || []);
        } else {
          setError(hardwareData.error || 'Kunde inte hämta TV-boxar');
        }

        // Calculate minimum prices from service products
        const baspaketProducts = baspaketData.success ? baspaketData.products : [];
        const baspaketPlusProducts = baspaketPlusData.success ? baspaketPlusData.products : [];

        const minBaspaketPrice =
          baspaketProducts.length > 0
            ? Math.min(...baspaketProducts.map((p) => parseFloat(p.m_price || p.price || 0)))
            : null;

        const minBaspaketPlusPrice =
          baspaketPlusProducts.length > 0
            ? Math.min(...baspaketPlusProducts.map((p) => parseFloat(p.m_price || p.price || 0)))
            : null;

        setTvFamilyPricing({
          basic: minBaspaketPrice ? Math.round(minBaspaketPrice * 1.25) : null, // Add VAT
          plus: minBaspaketPlusPrice ? Math.round(minBaspaketPlusPrice * 1.25) : null, // Add VAT
        });
      } catch (err) {
        console.error('Error fetching TV products:', err);
        setError('Ett fel uppstod vid hämtning av produkter');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [locale]);

  // PERFORMANCE FIX: Preload critical images for faster LCP
  const tvServices = [
    {
      key: 'tv-baspaket',
      name: t('tvService.productNames.baspaket'),
      href: `/kategori/tv/tv-baspaket`,
      image:
        'https://internetportcom.b-cdn.net/se/img/tva-personer-tittar-pa-tv-hemma-vardagsrum.jpg?width=400&fit=cover&q=75&format=auto',
      fromPrice: tvFamilyPricing.basic,
    },
    {
      key: 'tv-baspaket-plus',
      name: t('tvService.productNames.baspaketPlus'),
      href: `/kategori/tv/tv-baspaket-plus`,
      image:
        'https://internetportcom.b-cdn.net/se/img/fotboll-pa-tv-fjarrkontroll-sportkanaler-hemma.jpg?width=400&fit=cover&q=75&format=auto',
      fromPrice: tvFamilyPricing.plus,
    },
  ];

  return (
    <Suspense
      fallback={
        <div className="bg-primary">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="pb-6 border-b border-secondary/10">
              <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                {t('categoriesPage.categories.tv.name')}
              </h1>
              <p className="mt-4 text-base text-secondary/70">
                {t('categoryPages.tv.subtitle')}
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
          title={t('categoriesPage.categories.tv.name')}
          subtitle={t('categoryPages.tv.subtitle')}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
        />
        <ListingContent
          products={products}
          services={tvServices}
          isLoading={isLoading}
          error={error}
          categorySlug="tv"
          locale={locale}
          sortOptions={sortOptions}
          currentSort={currentSort}
          onSortChange={setCurrentSort}
        />
      </ListingPageLayout>
    </Suspense>
  );
}
