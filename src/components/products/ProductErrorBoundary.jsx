'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

class ProductErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Product component error:', error, errorInfo);
    
    // Optional: Send error to monitoring service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} context={this.props.context} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, context = 'product' }) {
  const t = useTranslations('common');

  const getErrorMessage = () => {
    return t('errors.general');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-failure-light/10 border border-failure/20 rounded-lg p-6 my-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-failure" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-failure-dark">
            {t('errors.title')}
          </h3>
          <p className="mt-1 text-sm text-secondary/70">
            {getErrorMessage()}
          </p>
          <div className="mt-4">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-failure bg-failure-light hover:bg-failure/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-failure"
            >
              {t('errors.refresh')}
            </button>
          </div>
        </div>
      </div>
      
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-4">
          <summary className="text-xs text-secondary/60 cursor-pointer hover:text-secondary">
            Development Error Details
          </summary>
          <pre className="mt-2 text-xs text-secondary/60 bg-secondary/5 p-2 rounded overflow-auto max-h-32">
            {error.toString()}
            {error.stack && `\n${error.stack}`}
          </pre>
        </details>
      )}
    </div>
  );
}

export default ProductErrorBoundary;