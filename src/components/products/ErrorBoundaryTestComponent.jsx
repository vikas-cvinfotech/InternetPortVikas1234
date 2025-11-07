'use client';

import React, { useState } from 'react';

// Test component to trigger errors for error boundary demonstration
// This should only be used in development
export default function ErrorBoundaryTestComponent() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Intentional error for testing error boundaries');
  }

  if (process.env.NODE_ENV !== 'development') {
    return null; // Don't show in production
  }

  return (
    <div className="bg-warning-light/10 border border-warning/20 rounded-lg p-4 my-4">
      <h4 className="font-medium text-warning-dark mb-2">
        Error Boundary Test (Development Only)
      </h4>
      <p className="text-sm text-secondary/70 mb-3">
        This component can trigger an error to test error boundary functionality.
      </p>
      <button
        onClick={() => setShouldError(true)}
        className="inline-flex items-center px-3 py-2 border border-warning text-sm font-medium rounded-md text-warning bg-warning-light hover:bg-warning/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning"
      >
        Trigger Error
      </button>
    </div>
  );
}