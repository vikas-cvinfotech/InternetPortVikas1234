'use client';

import { use, useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useCart } from '@/hooks/useCart';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer';
import { useTranslations } from 'next-intl';

// Helper to generate a URL-friendly slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const categoryNames = {
  vpn: 'Säkerhet',
  natverksprodukter: 'Nätverksprodukter',
  telefoni: 'Telefoni',
};

const categoryIds = {
  vpn: 22,
  natverksprodukter: 10,
  telefoni: 16,
};

export default function StandardProductPage({ productSlugWithId, categorySlug, locale }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const t = useTranslations('productPage');
  const tCommon = useTranslations('common');

  useEffect(() => {
    async function fetchProductData() {
      let productData;
      let productId;
      let slugFromUrl;

      try {
        setIsLoading(true);
        setError(null);

        const parts = productSlugWithId.split('-');
        productId = parts.pop();
        slugFromUrl = parts.join('-');

        if (!productId || isNaN(parseInt(productId))) {
          throw new Error('Invalid product identifier in URL.');
        }

        const languageId = locale === 'sv' ? 9 : 2;
        const productResponse = await fetch(
          `/api/hostbill/get-product?id=${productId}&language_id=${languageId}`
        );
        productData = await productResponse.json();

        if (!productData.success) {
          throw new Error(productData.error || 'Failed to fetch product');
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product. Please try again later.');
        setIsLoading(false);
        return;
      }

      const fetchedProduct = productData.product;
      const canonicalSlug = generateSlug(fetchedProduct.name);

      if (slugFromUrl !== canonicalSlug) {
        const canonicalUrl = `/kategori/${categorySlug}/${canonicalSlug}-${fetchedProduct.id}`;
        redirect(canonicalUrl);
      }

      const enrichedProduct = {
        ...fetchedProduct,
        category: categoryNames[categorySlug],
        category_name: categoryNames[categorySlug],
        categorySlug: categorySlug,
      };

      setProduct(enrichedProduct);

      try {
        const categoryResponse = await fetch(`/api/hostbill/get-products?category=${categorySlug}`);
        const categoryData = await categoryResponse.json();

        if (categoryData.success) {
          const related = categoryData.products
            .filter((p) => p.id !== fetchedProduct.id && p.type !== 'redirect')
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.warn('Failed to fetch related products:', err);
      }

      setIsLoading(false);
    }

    fetchProductData();
  }, [productSlugWithId, categorySlug, locale]);

  const handleAddToCart = () => {
    if (!product || isAdding) return;

    setIsAdding(true);

    const cartItemData = {
      id: product.id,
      name: product.name,
      category: product.category,
      categoryId: categoryIds[categorySlug],
      m_price: product.m_price,
      s_price: product.m_setup,
      quantity: 1,
      config: {},
    };

    try {
      addToCart(cartItemData);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 1000); // 1 second delay
  };

  if (isLoading) {
    return (
      <div className="bg-primary py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-secondary mb-4">{t('loadingTitle')}</h1>
            <p className="text-secondary/70">{t('loadingText')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-failure-light rounded-full flex items-center justify-center mx-auto mb-4">
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
            <h1 className="text-2xl font-bold text-failure-dark mb-4">{t('errorTitle')}</h1>
            <p className="text-failure mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-failure text-primary text-sm font-medium rounded-md hover:bg-failure-dark transition-colors"
              >
                {t('retryButton')}
              </button>
              <Link
                href={`/kategori/${categorySlug}`}
                className="inline-flex items-center px-4 py-2 border border-divider text-secondary text-sm font-medium rounded-md hover:bg-secondary/5 transition-colors"
              >
                {t('backToCategoryButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-primary py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-4">{t('notFoundTitle')}</h1>
            <Link href={`/kategori/${categorySlug}`} className="text-accent hover:text-accent/80">
              {t('backToCategoryButton')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup
            as="div"
            className="flex flex-col-reverse"
            selectedIndex={selectedImageIndex}
            onChange={setSelectedImageIndex}
          >
            {/* Image navigation controls */}
            {product.images && product.images.length > 1 && (
              <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
                {/* Mobile (< 1/4 >) navigation */}
                <div className="sm:hidden">
                  <div className="flex items-center justify-center gap-x-6">
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                      disabled={selectedImageIndex === 0}
                      className="rounded-md p-1 text-secondary/70 hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <div className="text-sm font-medium text-secondary">
                      {selectedImageIndex + 1} / {product.images.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                      disabled={selectedImageIndex === product.images.length - 1}
                      className="rounded-md p-1 text-secondary/70 hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Desktop thumbnail navigation */}
                <TabList className="hidden sm:grid sm:grid-cols-4 sm:gap-6">
                  {product.images.map((image) => (
                    <Tab
                      key={image.id}
                      className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-primary text-sm font-medium uppercase text-secondary hover:bg-secondary/5 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-accent/50"
                    >
                      <span className="sr-only">{image.name}</span>
                      <span className="absolute inset-0 overflow-hidden rounded-md">
                        <img
                          alt=""
                          src={image.src}
                          className="h-full w-full object-cover object-center"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-accent"
                      />
                    </Tab>
                  ))}
                </TabList>
              </div>
            )}

            <TabPanels className="aspect-h-1 aspect-w-1 w-full">
              {product.images &&
                product.images.map((image) => (
                  <TabPanel key={image.id}>
                    <img
                      alt={image.alt}
                      src={image.src}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </TabPanel>
                ))}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-secondary">{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">{t('productInformation')}</h2>
              <p className="text-3xl tracking-tight text-secondary">{`${product.price} ${tCommon(
                'currencyPerMonth'
              )}`}</p>
            </div>

            <div className="mt-10">
              <button
                onClick={handleAddToCart}
                type="button"
                disabled={isAdding}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-accent px-8 py-3 text-base font-medium text-primary hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? t('addingToCart') : t(product.ctaLabelKey)}
              </button>
            </div>

            {/* Description */}
            <div className="mt-10">
              <h3 className="sr-only">{t('description')}</h3>
              <div className="space-y-6 text-base text-secondary/80">
                <SafeHtmlRenderer html={product.description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
