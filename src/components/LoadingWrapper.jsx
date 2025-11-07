'use client';

import { Fragment } from 'react';

/**
 * LoadingWrapper - Higher Order Component for consistent loading patterns
 * Reduces boilerplate by centralizing conditional loading logic
 * 
 * @param {boolean} isLoading - Whether the component is in loading state
 * @param {React.ReactNode} skeleton - The skeleton component to show while loading
 * @param {React.ReactNode} children - The actual content to show when loaded
 * @param {React.ReactNode} error - Optional error component to show on error
 * @param {boolean} hasError - Whether there's an error state
 * @param {React.ReactNode} empty - Optional empty state component
 * @param {boolean} isEmpty - Whether to show empty state
 * @param {string} className - Optional wrapper className
 */
export default function LoadingWrapper({
  isLoading,
  skeleton,
  children,
  error = null,
  hasError = false,
  empty = null,
  isEmpty = false,
  className = '',
}) {
  // Error state takes precedence
  if (hasError && error) {
    return <div className={className}>{error}</div>;
  }

  // Loading state
  if (isLoading) {
    return <div className={className}>{skeleton}</div>;
  }

  // Empty state
  if (isEmpty && empty) {
    return <div className={className}>{empty}</div>;
  }

  // Normal content
  return className ? <div className={className}>{children}</div> : <Fragment>{children}</Fragment>;
}

/**
 * Higher-order component version for component wrapping
 * 
 * @param {React.Component} Component - Component to wrap
 * @param {Object} options - Default loading options
 * @returns {React.Component} - Wrapped component with loading logic
 */
export function withLoading(Component, options = {}) {
  const WrappedComponent = (props) => {
    const {
      isLoading,
      skeleton,
      error,
      hasError,
      empty,
      isEmpty,
      className,
      ...restProps
    } = props;

    return (
      <LoadingWrapper
        isLoading={isLoading ?? options.isLoading}
        skeleton={skeleton ?? options.skeleton}
        error={error ?? options.error}
        hasError={hasError ?? options.hasError}
        empty={empty ?? options.empty}
        isEmpty={isEmpty ?? options.isEmpty}
        className={className ?? options.className}
      >
        <Component {...restProps} />
      </LoadingWrapper>
    );
  };

  WrappedComponent.displayName = `withLoading(${Component.displayName || Component.name})`;
  return WrappedComponent;
}