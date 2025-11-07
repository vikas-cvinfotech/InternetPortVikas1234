'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import ProductErrorBoundary from './ProductErrorBoundary';

export default function CartErrorBoundary({ children }) {
  const t = useTranslations('common');

  const fallbackUI = (error) => {
    return (
      <div className="bg-warning-light/10 border border-warning/20 rounded-lg p-4 my-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-warning-dark">
              {t('errors.cart.title')}
            </h3>
            <p className="mt-1 text-sm text-secondary/70">
              {t('errors.cart.description')}
            </p>
            <div className="mt-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-warning bg-warning-light hover:bg-warning/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning"
              >
                {t('errors.refresh')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProductErrorBoundary
      context="cart"
      fallback={fallbackUI}
      onError={(error, errorInfo) => {
        console.error('Cart Error:', error, errorInfo);
        // Cart errors are critical - consider immediate notification
      }}
    >
      {children}
    </ProductErrorBoundary>
  );
}