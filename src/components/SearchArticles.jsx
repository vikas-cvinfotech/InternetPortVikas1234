'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export default function SearchArticles() {
  const t = useTranslations('knowledgeBase');
  const commonT = useTranslations('common');
  const [search, setSearch] = useState('');
  const [showEmptySearchError, setShowEmptySearchError] = useState(false);
  const [showMinCharsError, setShowMinCharsError] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    const trimmedSearch = search.trim();
    if (!trimmedSearch) {
      setShowEmptySearchError(true);
      setShowMinCharsError(false);
    } else if (trimmedSearch.length < 3) {
      setShowMinCharsError(true);
      setShowEmptySearchError(false);
    } else {
      setShowEmptySearchError(false);
      setShowMinCharsError(false);
      const encodedSearch = encodeURIComponent(trimmedSearch);
      router.push(`/kunskapsbas/sok/${encodedSearch}`);
    }
  };

  const handleInputChange = (e) => {
    if (showEmptySearchError) {
      setShowEmptySearchError(false);
    }
    if (showMinCharsError) {
      setShowMinCharsError(false);
    }
    setSearch(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mt-16">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`border p-2 rounded w-full text-secondary placeholder:text-secondary/75 ${
            showEmptySearchError || showMinCharsError ? 'border-accent' : 'border-divider'
          }`}
          aria-describedby={showEmptySearchError ? 'search-error' : showMinCharsError ? 'min-chars-error' : undefined}
        />
        <button
          onClick={handleSearch}
          className="bg-accent text-primary px-4 py-2 rounded flex items-center gap-1 hover:opacity-75 disabled:opacity-50 flex-shrink-0"
        >
          <MagnifyingGlassIcon className="h-5 w-5" /> {t('searchButton')}
        </button>
      </div>
      {showEmptySearchError && (
        <p id="search-error" className="text-accent text-sm mt-1">
          {t('emptySearchError')}
        </p>
      )}
      {showMinCharsError && (
        <p id="min-chars-error" className="text-accent text-sm mt-1">
          {commonT('typeMin3Chars')}
        </p>
      )}
    </div>
  );
}
