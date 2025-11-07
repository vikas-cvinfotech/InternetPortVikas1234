'use client';

import { Fragment, useState, useEffect } from 'react';
import { use } from 'react';
import ProductCard from '@/components/products/ProductCard';
import { formatPriceWithVAT } from '@/lib/utils/tax';
import { notFound } from 'next/navigation';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Link } from '@/i18n/routing';

const categoryNames = {
  vpn: 'VPN',
  natverksprodukter: 'Nätverksprodukter',
  telefoni: 'Telefoni',
};

const sortOptions = [
  { name: 'Mest Populära', href: '#', current: true },
  { name: 'Bäst Betyg', href: '#', current: false },
  { name: 'Nyaste', href: '#', current: false },
  { name: 'Pris: Låg till Hög', href: '#', current: false },
  { name: 'Pris: Hög till Låg', href: '#', current: false },
];

const categoryFilters = {
  vpn: [
    {
      id: 'price-range',
      name: 'Prisintervall',
      options: [
        { value: '0-100', label: 'Under 100 kr', checked: false },
        { value: '100-400', label: '100-400 kr', checked: false },
        { value: '400-1000', label: '400-1000 kr', checked: false },
        { value: '1000+', label: '1000+ kr', checked: false },
      ],
    },
  ],
  natverksprodukter: [
    {
      id: 'price-range',
      name: 'Prisintervall',
      options: [
        { value: '0-100', label: 'Under 100 kr', checked: false },
        { value: '100-400', label: '100-400 kr', checked: false },
        { value: '400-1000', label: '400-1000 kr', checked: false },
        { value: '1000+', label: '1000+ kr', checked: false },
      ],
    },
  ],
  telefoni: [
    {
      id: 'price-range',
      name: 'Prisintervall',
      options: [
        { value: '0-100', label: 'Under 100 kr', checked: false },
        { value: '100-400', label: '100-400 kr', checked: false },
        { value: '400-1000', label: '400-1000 kr', checked: false },
        { value: '1000+', label: '1000+ kr', checked: false },
      ],
    },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CategoryProductsPage({ params }) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams['kategori-namn'];
  const locale = resolvedParams?.locale || 'sv';

  const validCategories = Object.keys(categoryNames);
  if (!validCategories.includes(categorySlug)) {
    notFound();
  }

  const categoryName = categoryNames[categorySlug];
  const filters = categoryFilters[categorySlug] || [];

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSort, setCurrentSort] = useState('Mest Populära');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [dismissedBanners, setDismissedBanners] = useState({});

  const sortProducts = (products, sortType) => {
    const sorted = [...products];

    // Helper function to get tax-inclusive price for sorting
    const getTaxInclusivePrice = (product) => {
      if (product.pricingOptions && product.pricingOptions.length > 0) {
        const monthlyOption = product.pricingOptions.find((opt) => opt.period === 'monthly');
        const selectedOption = monthlyOption || product.pricingOptions[0];

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
      // Fallback to parsing the old price format
      return parseFloat(product.price?.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
    };

    switch (sortType) {
      case 'Pris: Låg till Hög':
        return sorted.sort((a, b) => {
          return getTaxInclusivePrice(a) - getTaxInclusivePrice(b);
        });
      case 'Pris: Hög till Låg':
        return sorted.sort((a, b) => {
          return getTaxInclusivePrice(b) - getTaxInclusivePrice(a);
        });
      case 'Nyaste':
        return sorted.sort((a, b) => b.id - a.id);
      case 'Bäst Betyg':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'Mest Populära':
      default:
        return sorted;
    }
  };

  const filterProducts = (products, filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return products;
    }

    return products.filter((product) => {
      return Object.entries(filters).every(([filterId, selectedValues]) => {
        if (!selectedValues || selectedValues.length === 0) {
          return true;
        }

        switch (filterId) {
          case 'price-range':
            // Calculate tax-inclusive price like ProductCard does
            let taxInclusivePrice = 0;
            if (product.pricingOptions && product.pricingOptions.length > 0) {
              const monthlyOption = product.pricingOptions.find((opt) => opt.period === 'monthly');
              const selectedOption = monthlyOption || product.pricingOptions[0];

              if (selectedOption) {
                const basePrice = selectedOption.price || 0;
                if (basePrice > 0) {
                  const priceWithTax = formatPriceWithVAT(basePrice);
                  taxInclusivePrice = priceWithTax.inclusivePrice;
                } else if (selectedOption.setupFee > 0) {
                  const setupWithTax = formatPriceWithVAT(selectedOption.setupFee);
                  taxInclusivePrice = setupWithTax.inclusivePrice;
                }
              }
            } else {
              // Fallback to parsing the old price format
              taxInclusivePrice =
                parseFloat(product.price?.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
            }

            return selectedValues.some((range) => {
              switch (range) {
                case '0-100':
                  return taxInclusivePrice >= 0 && taxInclusivePrice <= 100;
                case '100-400':
                  return taxInclusivePrice > 100 && taxInclusivePrice <= 400;
                case '400-1000':
                  return taxInclusivePrice > 400 && taxInclusivePrice <= 1000;
                case '1000+':
                  return taxInclusivePrice > 1000;
                default:
                  return true;
              }
            });
          default:
            return true;
        }
      });
    });
  };

  const handleFilterChange = (filterId, optionValue, checked) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      if (!newFilters[filterId]) {
        newFilters[filterId] = [];
      }

      if (checked) {
        newFilters[filterId] = [...newFilters[filterId], optionValue];
      } else {
        newFilters[filterId] = newFilters[filterId].filter((val) => val !== optionValue);
      }

      if (newFilters[filterId].length === 0) {
        delete newFilters[filterId];
      }

      return newFilters;
    });
  };

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
  };

  const handleDismissBanner = (bannerId) => {
    setDismissedBanners((prev) => ({ ...prev, [bannerId]: true }));
  };

  const redirectCards = products.filter((product) => product.type === 'redirect');
  const regularProducts = products.filter((product) => product.type !== 'redirect');

  const processedRegularProducts = sortProducts(
    filterProducts(regularProducts, selectedFilters),
    currentSort
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);

        const languageId = locale === 'sv'
          ? process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_SV || '9'
          : process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_EN || '2';
        const response = await fetch(`/api/hostbill/get-products?category=${categorySlug}&language_id=${languageId}`);
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          throw new Error(data.error || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [categorySlug]);

  return (
    <div className="bg-primary">
      <div>
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-primary pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-secondary">Filter</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-primary p-2 text-secondary/50 hover:bg-secondary/5 focus:ring-2 focus:ring-accent focus:outline-hidden"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Stäng meny</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              <form className="mt-4 border-t border-divider">
                {filters.length > 0 ? (
                  filters.map((section) => (
                    <Disclosure
                      key={section.id}
                      as="div"
                      className="border-t border-divider px-4 py-6"
                    >
                      <h3 className="-mx-2 -my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between bg-primary px-2 py-3 text-secondary/50 hover:text-secondary">
                          <span className="font-medium text-secondary">{section.name}</span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="size-5 group-data-[open]:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="size-5 hidden group-data-[open]:block"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="space-y-6">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    value={option.value}
                                    checked={
                                      selectedFilters[section.id]?.includes(option.value) || false
                                    }
                                    onChange={(e) =>
                                      handleFilterChange(section.id, option.value, e.target.checked)
                                    }
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-divider bg-primary checked:border-accent checked:bg-accent indeterminate:border-accent indeterminate:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:border-divider disabled:bg-secondary/5 disabled:checked:bg-secondary/5 forced-colors:appearance-auto"
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-primary group-has-disabled:stroke-secondary/25"
                                  >
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-checked:opacity-100"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <label
                                htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                className="min-w-0 flex-1 text-secondary/70"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-secondary/70">
                      Inga filter tillgängliga för denna kategori
                    </p>
                  </div>
                )}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-8">
            <Link
              href={`/kategori`}
              className="inline-flex items-center text-sm text-secondary/70 hover:text-accent transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Tillbaka till kategorier
            </Link>
          </div>

          {redirectCards.length > 0 && (
            <div className="mb-8">
              {redirectCards
                .filter((product) => !dismissedBanners[product.id])
                .map((product) => (
                  <div
                    key={product.id}
                    className="relative flex items-center justify-between gap-x-6 bg-accent px-6 py-2.5 sm:pr-3.5 lg:pl-8 rounded-lg mb-4 last:mb-0"
                  >
                    <div className="flex-1">
                      <Link href={`/${product.redirectUrl}`} className="block">
                        <p className="text-sm/6 text-primary">
                          <strong className="font-semibold">{product.name}</strong>
                          <svg
                            viewBox="0 0 2 2"
                            aria-hidden="true"
                            className="mx-2 inline size-0.5 fill-current"
                          >
                            <circle r={1} cx={1} cy={1} />
                          </svg>
                          {product.description}&nbsp;
                          <span aria-hidden="true">&rarr;</span>
                        </p>
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDismissBanner(product.id);
                      }}
                      className="-m-3 flex-none p-3 hover:bg-accent/80 rounded-md transition-colors focus-visible:-outline-offset-4"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon aria-hidden="true" className="size-5 text-primary" />
                    </button>
                  </div>
                ))}
            </div>
          )}

          <div className="flex items-baseline justify-between border-b border-divider pt-4 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                {categoryName}
              </h1>
              <p className="mt-2 text-lg text-secondary/70">
                {processedRegularProducts.length > 0
                  ? `Upptäck våra ${categoryName.toLowerCase()}-lösningar`
                  : `Produkter för ${categoryName.toLowerCase()} kommer snart`}
              </p>
            </div>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-secondary/70 hover:text-secondary">
                    {currentSort}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-secondary/50 group-hover:text-secondary/70"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-primary shadow-2xl ring-1 ring-divider transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <button
                          onClick={() => handleSortChange(option.name)}
                          className={classNames(
                            currentSort === option.name
                              ? 'font-medium text-secondary'
                              : 'text-secondary/70',
                            'block w-full text-left px-4 py-2 text-sm data-focus:bg-secondary/5 data-focus:outline-hidden hover:bg-secondary/5'
                          )}
                        >
                          {option.name}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-secondary/50 hover:text-secondary/70 sm:ml-7"
              >
                <span className="sr-only">Visa rutnät</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-secondary/50 hover:text-secondary/70 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filter</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Produkter
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <form className="hidden lg:block">
                {filters.length > 0 ? (
                  filters.map((section) => (
                    <Disclosure key={section.id} as="div" className="border-b border-divider py-6">
                      <h3 className="-my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between bg-primary py-3 text-sm text-secondary/50 hover:text-secondary">
                          <span className="font-medium text-secondary">{section.name}</span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="size-5 group-data-[open]:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="size-5 hidden group-data-[open]:block"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="space-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    value={option.value}
                                    checked={
                                      selectedFilters[section.id]?.includes(option.value) || false
                                    }
                                    onChange={(e) =>
                                      handleFilterChange(section.id, option.value, e.target.checked)
                                    }
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-divider bg-primary checked:border-accent checked:bg-accent indeterminate:border-accent indeterminate:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:border-divider disabled:bg-secondary/5 disabled:checked:bg-secondary/5 forced-colors:appearance-auto"
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-primary group-has-disabled:stroke-secondary/25"
                                  >
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-checked:opacity-100"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="text-sm text-secondary/70"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  ))
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-secondary/70">
                      Inga filter tillgängliga för denna kategori
                    </p>
                  </div>
                )}
              </form>

              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:col-span-3 lg:gap-x-8">
                {isLoading && (
                  <div className="col-span-full text-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-secondary mb-2">
                      Laddar produkter...
                    </h3>
                    <p className="text-secondary/70">
                      Hämtar de senaste produkterna från vårt system.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="col-span-full text-center p-12 border border-failure/20 rounded-lg bg-failure-light">
                    <div className="w-16 h-16 bg-failure/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-failure"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-failure-dark mb-2">
                      Kunde inte ladda produkter
                    </h3>
                    <p className="text-failure mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center px-4 py-2 bg-failure text-white text-sm font-medium rounded-md hover:bg-failure-dark transition-colors"
                    >
                      Försök igen
                    </button>
                  </div>
                )}

                {!isLoading && !error && (
                  <>
                    {processedRegularProducts.length > 0 ? (
                      processedRegularProducts.map((product, index) => {
                        return (
                          <ProductCard
                            key={product.id}
                            product={product}
                            locale={locale}
                            categorySlug={categorySlug}
                            priority={index < 3}
                          />
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center p-12 border border-divider rounded-lg">
                        {regularProducts.length > 0 ? (
                          <>
                            <h3 className="text-xl font-semibold text-secondary mb-2">
                              Inga produkter matchade dina filter
                            </h3>
                            <p className="text-secondary/70 mb-4">
                              Försök att justera filtren eller sorteringsalternativ för att se fler
                              produkter.
                            </p>
                            <button
                              onClick={() => {
                                setSelectedFilters({});
                                setCurrentSort('Mest Populära');
                              }}
                              className="inline-flex items-center px-4 py-2 bg-accent text-primary text-sm font-medium rounded-md hover:bg-accent/90 transition-colors"
                            >
                              Rensa alla filter
                            </button>
                          </>
                        ) : (
                          <>
                            <h3 className="text-xl font-semibold text-secondary mb-2">
                              Produkter kommer snart
                            </h3>
                            <p className="text-secondary/70">
                              Vi arbetar på att lägga till produkter i denna kategori.
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
