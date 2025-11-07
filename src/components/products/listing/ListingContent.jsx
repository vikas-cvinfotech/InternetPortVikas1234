import { Fragment } from 'react';
import ProductCard from './ProductCard';
import ServiceCard from './ServiceCard';
import RedirectCard from './RedirectCard';
import { useTranslations } from 'next-intl';
import { formatPriceWithVAT } from '@/lib/utils/tax';

export default function CategoryContent({
  products,
  services = [],
  redirects = [],
  isLoading,
  error,
  categorySlug,
  locale,
  sortOptions,
  currentSort,
  onSortChange,
  customCards = [],
}) {
  const t = useTranslations('listing');

  const getSortablePrice = (item) => {
    if (item.itemType === 'service') {
      return item.fromPrice || 0;
    } else if (item.itemType === 'redirect') {
      return 0;
    } else {
      if (item.pricingOptions && item.pricingOptions.length > 0) {
        const monthlyOption = item.pricingOptions.find((opt) => opt.period === 'monthly');
        const selectedOption = monthlyOption || item.pricingOptions[0];
        if (selectedOption) {
          const basePrice = selectedOption.price || 0;
          if (basePrice > 0) {
            const priceWithTax = formatPriceWithVAT(basePrice);
            return priceWithTax.inclusivePrice;
          } else if (selectedOption.setupFee > 0) {
            const setupWithTax = formatPriceWithVAT(selectedOption.setupFee);
            return setupWithTax.inclusivePrice;
          }
        }
      }
      const fallbackPrice = parseFloat(item.price?.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
      return fallbackPrice;
    }
  };

  const getSortableName = (item) => {
    let name = '';
    if (item.itemType === 'service' || item.itemType === 'redirect') {
      name = item.name || '';
    } else {
      name = item.name || item.fallbackName || '';
    }
    return name
      .replace(/Å/g, 'Z~A')
      .replace(/å/g, 'z~a')
      .replace(/Ä/g, 'Z~B')
      .replace(/ä/g, 'z~b')
      .replace(/Ö/g, 'Z~C')
      .replace(/ö/g, 'z~c');
  };

  const createUnifiedItems = () => {
    const unifiedItems = [];

    services.forEach((service) => {
      unifiedItems.push({
        ...service,
        itemType: 'service',
        id: `service-${service.key || service.name}`,
      });
    });

    redirects.forEach((redirect) => {
      unifiedItems.push({
        ...redirect,
        itemType: 'redirect',
        id: `redirect-${redirect.key || redirect.name}`,
      });
    });

    products.forEach((product) => {
      unifiedItems.push({
        ...product,
        itemType: 'product',
      });
    });

    return unifiedItems;
  };

  const sortUnifiedItems = (items, sortType) => {
    const sorted = [...items];
    switch (sortType) {
      case 'Pris: Låg till Hög':
      case 'Price: Low to High':
        return sorted.sort((a, b) => {
          const priceA = getSortablePrice(a);
          const priceB = getSortablePrice(b);
          // Put redirect cards (price = 0) first for low to high
          if (priceA === 0 && priceB === 0) return 0;
          if (priceA === 0) return -1;
          if (priceB === 0) return 1;
          return priceA - priceB;
        });
      case 'Pris: Hög till Låg':
      case 'Price: High to Low':
        return sorted.sort((a, b) => {
          const priceA = getSortablePrice(a);
          const priceB = getSortablePrice(b);
          // Put redirect cards (price = 0) last for high to low
          if (priceA === 0 && priceB === 0) return 0;
          if (priceA === 0) return 1;
          if (priceB === 0) return -1;
          return priceB - priceA;
        });
      case 'A-Z':
        return sorted.sort((a, b) => getSortableName(a).localeCompare(getSortableName(b)));
      case 'Z-A':
      default:
        return sorted.sort((a, b) => getSortableName(b).localeCompare(getSortableName(a)));
    }
  };

  const unifiedItems = createUnifiedItems();
  const sortedItems = currentSort ? sortUnifiedItems(unifiedItems, currentSort) : unifiedItems;
  
  // Use consistent skeleton count for better UX (prevents layout shift)
  // 4 skeletons matches our grid columns on XL screens
  const SKELETON_COUNT = 4;

  if (error) {
    return (
      <div className="bg-primary">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto w-16 h-16 bg-failure-light rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-failure"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-failure">
            {t('errors.title', { default: 'Fel' })}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
            {t('errors.loadProducts', { default: 'Kunde inte ladda produkter' })}
          </p>
          <p className="mt-2 text-lg text-secondary/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            aria-label="Retry loading products"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section aria-labelledby="products-heading" className="pb-24 pt-6" role="main">
        <h2 id="products-heading" className="sr-only">
          {t('products.headingSr', { default: 'Products' })}
        </h2>

        <div>
          {isLoading ? (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-x-8" role="list" aria-label="Product listing">
              {[...Array(SKELETON_COUNT)].map((_, i) => (
                <div key={i} className="group text-sm h-full flex flex-col">
                  <div className="block flex-1 flex flex-col">
                    {/* Image skeleton */}
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-secondary/5 relative">
                      <div className="absolute inset-0 bg-secondary/10 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-secondary/20 rounded animate-pulse" />
                      </div>
                    </div>
                    {/* Content skeleton */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Product name skeleton */}
                        <div className="h-4 bg-secondary/10 rounded animate-pulse w-3/4" />
                        {/* Badge skeleton (sometimes) */}
                        {i % 3 === 0 && (
                          <div className="h-6 w-16 bg-accent/10 rounded-full animate-pulse" />
                        )}
                      </div>
                      {/* Price skeleton */}
                      <div className="flex items-baseline gap-2">
                        <div className="h-6 bg-secondary/10 rounded animate-pulse w-20" />
                        <div className="h-3 bg-secondary/10 rounded animate-pulse w-12" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-x-8" role="list" aria-label="Product listing">
              {customCards.map((card, index) => (
                <Fragment key={`custom-${index}`}>{card}</Fragment>
              ))}
              {sortedItems.map((item, index) => {
                // Prioritize first 8 items for LCP optimization (2 rows on desktop)
                // This ensures images are loaded eagerly for above-the-fold content
                const shouldPrioritize = index < 8;
                
                if (item.itemType === 'service') {
                  return (
                    <ServiceCard
                      key={item.id}
                      name={item.name}
                      href={item.href}
                      image={item.image}
                      fromPrice={item.fromPrice}
                      priority={shouldPrioritize}
                    />
                  );
                } else if (item.itemType === 'redirect') {
                  // For broadband category, show starting price
                  const startingPrice = categorySlug === 'bredband' 
                    ? `${t('from')} ${process.env.NEXT_PUBLIC_BROADBAND_FROM_PRICE} ${t('currencyPerMonth')}` 
                    : undefined;
                  return <RedirectCard 
                    key={item.id} 
                    locale={locale} 
                    hideCategoryTitle={true}
                    startingPrice={startingPrice}
                  />;
                } else {
                  return (
                    <ProductCard
                      key={item.id}
                      product={item}
                      locale={locale}
                      categorySlug={categorySlug}
                      priority={shouldPrioritize}
                    />
                  );
                }
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
