'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import {
  formatAddressForDisplay,
  parseAddressForApi,
  generateBroadbandAddressSlug,
} from '@/lib/utils/formatting';
import useLoadingState from '@/hooks/useLoadingState';

// Helper hook for debouncing function calls.
function useDebouncedCallback(callback, delay) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFn = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
}

export function AddressSearchBox({ btn_bg_color }) {
  const t = useTranslations('searchAddresses');
  const commonT = useTranslations('common');
  const router = useRouter();

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { isLoading, startLoading, stopLoading } = useLoadingState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const abortControllerRef = useRef(null);
  const formRef = useRef(null);

  const fetchAddressSuggestions = useCallback(
    async (currentInputValue) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const trimmedInput = currentInputValue.trim();
      setSelectedSuggestion(null);

      if (trimmedInput.length === 0) {
        setSuggestions([]);
        setInfoMessage('');
        stopLoading();
        return;
      }

      if (trimmedInput.length < 3) {
        setSuggestions([]);
        setInfoMessage(commonT('typeMin3Chars'));
        stopLoading();
        return;
      }

      setInfoMessage(commonT('searchingFor', { address: trimmedInput }));
      startLoading();
      setSuggestions([]);

      const apiParams = parseAddressForApi(trimmedInput);

      try {
        const response = await fetch('/api/internetport/get-addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiParams),
          signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (signal.aborted) return;

        setSuggestions(data.response || []);
        stopLoading();
        if ((data.response || []).length === 0) {
          setInfoMessage(commonT('noResultsFound'));
        } else {
          setInfoMessage('');
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          // Request was aborted
        } else {
          if (signal.aborted) return;
          console.error('Fetch error:', error);
          setSuggestions([]);
          stopLoading();
          setInfoMessage(commonT('searchError'));
        }
      }
    },
    [commonT]
  );

  const debouncedSearch = useDebouncedCallback(fetchAddressSuggestions, 800);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setSelectedSuggestion(null);

    if (newValue.trim().length === 0) {
      setSuggestions([]);
      setInfoMessage('');
      stopLoading();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    } else if (newValue.trim().length < 3) {
      setSuggestions([]);
      setInfoMessage(commonT('typeMin3Chars'));
      stopLoading();
    } else {
      debouncedSearch(newValue);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const formattedAddress = formatAddressForDisplay(suggestion);
    setInputValue(formattedAddress);
    setSelectedSuggestion(suggestion);
    setSuggestions([]);
    setInfoMessage('');

    // Immediately redirect to broadband product page when complete address is selected
    const addressSlug = generateBroadbandAddressSlug(suggestion);
    router.push(`/kategori/bredband/${addressSlug}`);
  };

  const performNavigation = () => {
    const trimmedInput = inputValue.trim();

    if (trimmedInput.length < 3) {
      fetchAddressSuggestions(trimmedInput);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (selectedSuggestion && formatAddressForDisplay(selectedSuggestion) === trimmedInput) {
      // A complete address suggestion was selected and input matches exactly
      const addressSlug = generateBroadbandAddressSlug(selectedSuggestion);
      router.push(`/kategori/bredband/${addressSlug}`);
    } else {
      // User typed incomplete address or modified the selected suggestion
      // Navigate to address search results page to show all matching addresses
      router.push(`/address-sok-bredband?q=${encodeURIComponent(trimmedInput)}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performNavigation();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    performNavigation();
  };

  const isInputValidForButtonAction = inputValue.trim().length >= 3;

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="flex sm:flex-row shadow-secondaryShadow">
      <div className="min-w-0 flex-1">
        <label htmlFor="address-search-input" className="sr-only">
          Address Search
        </label>
        <div className="relative">
          {/* <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 sm:left-3 sm:size-5 text-secondary/75"
          /> */}
          <input
            id="address-search-input"
            type="search"
            placeholder={t('enterYourAddress')}
            className="block w-full rounded-tl-[4px] rounded-bl-[4px] border border-divider py-[16px] px-[16px] text-sm font-medium text-mediumGray placeholder:text-mediumGray/75 shadow-xs sm:text-base focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 top-full mt-1 w-full rounded-md border border-divider bg-primary shadow-lg max-h-60 overflow-auto">
              {suggestions.map((item, idx) => (
                <li
                  key={item.id || idx}
                  onClick={() => handleSuggestionClick(item)}
                  className="flex items-center cursor-pointer px-3 py-2 text-xs sm:px-4 sm:text-sm text-secondary hover:bg-secondary/10 transition-colors"
                >
                  <MapPinIcon
                    aria-hidden="true"
                    className="mr-2 size-3 sm:size-4 shrink-0 text-secondary/75"
                  />
                  <span>{formatAddressForDisplay(item)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {infoMessage && <p className="mt-2 text-sm text-secondary/80">{infoMessage}</p>}
      </div>
      <div className="sm:flex-shrink-0">
        <button
          type="submit"
          disabled={!isInputValidForButtonAction && inputValue.trim().length > 0}
          className={`block w-full rounded-tr-[4px] rounded-br-[4px] border border-transparent ${
            btn_bg_color == 'red' ? 'bg-accent text-primary' : 'bg-secondary text-primary'
          }  px-[16px] py-[16px] text-sm font-semibold shadow-none focus:shadow-none hover:opacity-90 disabled:opacity-60 transition-opacity sm:text-base sm:w-auto focus:outline-none capitalize`}
        >
          Check Availability
        </button>
      </div>
    </form>
  );
}
