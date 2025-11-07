'use client';

import { use } from 'react';
import { useEffect } from 'react';
import UnifiedProductPageController from '@/components/products/UnifiedProductPageController';
import StandardProductPage from './StandardProductPage';
import BroadbandProductPage from './BroadbandProductPage';

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams['kategori-namn'];
  const productSlugWithId = resolvedParams['produkt-slug-id'];
  const locale = resolvedParams?.locale || 'sv';

  // PERFORMANCE FIX: Preconnect to API endpoints and CDN for better performance
  useEffect(() => {
    if (categorySlug === 'bredband' || categorySlug === 'telefoni') {
      const preconnectOrigin = document.createElement('link');
      preconnectOrigin.rel = 'preconnect';
      preconnectOrigin.href = window.location.origin;
      if (!document.head.querySelector(`link[href="${window.location.origin}"]`)) {
        document.head.appendChild(preconnectOrigin);
      }

      // PERFORMANCE FIX: Preconnect to CDN for faster router product images
      const preconnectCDN = document.createElement('link');
      preconnectCDN.rel = 'preconnect';
      preconnectCDN.href = 'https://internetportcom.b-cdn.net';
      if (!document.head.querySelector('link[href="https://internetportcom.b-cdn.net"]')) {
        document.head.appendChild(preconnectCDN);
      }

      // PERFORMANCE FIX: Preload critical images for router installment products to prevent CLS
      if (productSlugWithId?.includes('installment') || productSlugWithId?.includes('router')) {
        const criticalImages = [
          'https://internetportcom.b-cdn.net/se/img/router-wifi-modern-hem-tradlos-uppkoppling.jpg?width=600&fit=cover&q=75&format=auto',
          'https://internetportcom.b-cdn.net/se/img/router-led-lampor-nattverk-uppkoppling-status.jpg?width=600&fit=cover&q=75&format=auto'
        ];
        
        criticalImages.forEach((src, index) => {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = src;
          if (index === 0) preloadLink.fetchPriority = 'high'; // First image gets high priority
          if (!document.head.querySelector(`link[href="${src}"]`)) {
            document.head.appendChild(preloadLink);
          }
        });
      }

      // PERFORMANCE FIX: Preload critical images for telephony products to improve LCP
      if (categorySlug === 'telefoni') {
        const telephonyImages = [
          'https://internetportcom.b-cdn.net/se/img/telefonibox-grandstream-analog-telefon-adapter.jpg?width=600&fit=cover&q=75&format=auto',
          'https://internetportcom.b-cdn.net/se/img/ip-telefon-gigaset-tradlos-hemtelefoni.jpg?width=600&fit=cover&q=75&format=auto'
        ];
        
        telephonyImages.forEach((src, index) => {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = src;
          if (index === 0) preloadLink.fetchPriority = 'high'; // First image gets high priority
          if (!document.head.querySelector(`link[href="${src}"]`)) {
            document.head.appendChild(preloadLink);
          }
        });
      }
      
      return () => {
        if (document.head.contains(preconnectOrigin)) {
          document.head.removeChild(preconnectOrigin);
        }
        if (document.head.contains(preconnectCDN)) {
          document.head.removeChild(preconnectCDN);
        }
      };
    }
  }, [categorySlug, productSlugWithId]);

  // Use the new unified controller that implements the strategy pattern
  return (
    <UnifiedProductPageController
      productSlugWithId={productSlugWithId}
      categorySlug={categorySlug}
      locale={locale}
    />
  );

  // LEGACY CODE - Keep for reference but commented out
  // This is the old routing logic that we're replacing with the strategy pattern
  /*
  if (categorySlug === 'bredband') {
    return <BroadbandProductPage productSlugWithId={productSlugWithId} />;
  } else {
    return (
      <StandardProductPage
        productSlugWithId={productSlugWithId}
        categorySlug={categorySlug}
        locale={locale}
      />
    );
  }
  */
}
