'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import ProductErrorBoundary from './ProductErrorBoundary';

export default function ProductStrategyErrorBoundary({ children, productName, productType }) {
  const t = useTranslations('common');

  const fallbackUI = (error) => {
    return (
      <div className="bg-failure-light/10 border border-failure/20 rounded-lg p-6 my-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-failure" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-failure-dark mb-2">
              {t('errors.productStrategy.title')}
            </h3>
            <p className="text-sm text-secondary/70 mb-4">
              {t('errors.productStrategy.description')}
            </p>
            
            <div className="space-y-3">
              <div className="text-sm text-secondary/60">
                {t('errors.productStrategy.suggestions')}
              </div>
              <ul className="text-sm text-secondary/70 space-y-1 ml-4">
                <li>• {t('errors.productStrategy.refresh')}</li>
                <li>• {t('errors.productStrategy.contact')}</li>
              </ul>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                {t('errors.refresh')}
              </button>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-secondary/20 text-sm font-medium rounded-md text-secondary bg-primary hover:bg-secondary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              >
                {t('errors.goBack')}
              </button>
            </div>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 pt-4 border-t border-failure/20">
            <summary className="text-sm text-failure cursor-pointer hover:text-failure-dark font-medium">
              Development Error Details
            </summary>
            <pre className="mt-3 text-xs text-secondary/60 bg-secondary/5 p-3 rounded overflow-auto max-h-48 whitespace-pre-wrap">
              <strong>Error:</strong> {error.toString()}
              {error.stack && (
                <>
                  <br /><br />
                  <strong>Stack Trace:</strong>
                  <br />{error.stack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    );
  };

  return (
    <ProductErrorBoundary
      context="product-strategy"
      fallback={fallbackUI}
      onError={(error, errorInfo) => {
        // Enhanced error logging for product strategies
        console.error('Product Strategy Error:', {
          productName,
          productType,
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack
        });
        
        // Optional: Send to monitoring service
        // Example: sendToErrorTracking({ productName, productType, error, errorInfo });
      }}
    >
      {children}
    </ProductErrorBoundary>
  );
}