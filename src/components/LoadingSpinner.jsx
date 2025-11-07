// src/components/LoadingSpinner.jsx
'use client';
import { useTranslations } from 'next-intl';

export default function LoadingSpinner() {
  const t = useTranslations('common'); // Assuming 'loading' key is in 'common' namespace

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      {' '}
      {/* Added flex-col and text-center */}
      <div className="h-12 w-12 animate-spin text-accent">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            // Path 'd' attribute from Component 1's spinner
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      {/* Text is now below the spinner due to flex-col */}
      <span className="mt-4 text-lg font-medium text-secondary">{t('loading')}...</span>
    </div>
  );
}
