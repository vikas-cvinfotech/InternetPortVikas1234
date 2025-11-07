'use client';

import * as React from 'react';
import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Lazy load icons to improve FCP
const MagnifyingGlassIcon = lazy(() => import('@heroicons/react/16/solid').then(module => ({ default: module.MagnifyingGlassIcon })));
const ChevronLeftIcon = lazy(() => import('@heroicons/react/16/solid').then(module => ({ default: module.ChevronLeftIcon })));
const ChevronRightIcon = lazy(() => import('@heroicons/react/16/solid').then(module => ({ default: module.ChevronRightIcon })));
const ChevronDownIcon = lazy(() => import('@heroicons/react/16/solid').then(module => ({ default: module.ChevronDownIcon })));
import { formatAddressForDisplay, parseAddressForApi, generateBroadbandAddressSlug } from '@/lib/utils/formatting';
import { sanitizeText } from '@/lib/utils/sanitization';
import useLoadingState from '@/hooks/useLoadingState';
import StandardLoadingSpinner from '@/components/StandardLoadingSpinner';
import AddressResultSkeleton from '@/components/skeletons/AddressResultSkeleton';

// Helper Hooks & Functions.

const resultsPerPage = 50;

export default function AddressSokBredbandPage() {
  const t = useTranslations('searchAddresses');
  const commonT = useTranslations('common');
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  const initialQueryFromUrl = useRef(searchParamsHook.get('q'));
  const initialSearchDone = useRef(false);

  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [selectedCityFilter, setSelectedCityFilter] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoadingState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedAccessId, setCopiedAccessId] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const abortControllerRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const inputRef = useRef(null);

  const performSearch = useCallback(
    async (currentSearchTerm) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const trimmedInput = currentSearchTerm.trim();
      setCurrentPage(1);

      if (trimmedInput.length < 3) {
        setSearchResults([]);
        setFilteredResults([]);
        setUniqueCities([]);
        setInfoMessage(trimmedInput.length > 0 ? commonT('typeMin3Chars') : '');
        stopLoading();
        return;
      }

      startLoading();
      setInfoMessage(commonT('searchingFor', { address: trimmedInput }));
      setSearchResults([]);
      setFilteredResults([]);
      setUniqueCities([]);
      setSelectedCityFilter('');

      const apiParams = parseAddressForApi(trimmedInput);
      apiParams.limit = 1000;

      try {
        const response = await fetch('/api/internetport/get-addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiParams),
          signal,
        });

        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        const data = await response.json();

        if (signal.aborted) return;

        const fetchedAddresses = data.response || [];
        setSearchResults(fetchedAddresses);
        setFilteredResults(fetchedAddresses);

        if (fetchedAddresses.length === 0) {
          setInfoMessage(commonT('noResultsFound'));
        } else {
          setInfoMessage('');
          const cities = [
            ...new Set(fetchedAddresses.map((addr) => addr.city).filter(Boolean)),
          ].sort();
          setUniqueCities(cities);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
          setInfoMessage(commonT('searchError'));
        }
      } finally {
        if (!signal.aborted) stopLoading();
      }
    },
    [commonT],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const query = initialQueryFromUrl.current;
    if (query && !initialSearchDone.current) {
      const decodedQuery = decodeURIComponent(query);
      setInputValue(decodedQuery);
      performSearch(decodedQuery);
      initialSearchDone.current = true;
    }
  }, [performSearch]);

  useEffect(() => {
    const newQuery = searchParamsHook.get('q');
    if (newQuery !== initialQueryFromUrl.current) {
      initialQueryFromUrl.current = newQuery;
      initialSearchDone.current = false;
      if (newQuery) {
        const decodedQuery = decodeURIComponent(newQuery);
        setInputValue(decodedQuery);
        performSearch(decodedQuery);
        initialSearchDone.current = true;
      } else {
        setInputValue('');
        setSearchResults([]);
        setFilteredResults([]);
        setUniqueCities([]);
        setInfoMessage('');
      }
    }
  }, [searchParamsHook, performSearch]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    
    // Clear results and info when input is cleared
    if (newValue.trim().length === 0) {
      setSearchResults([]);
      setFilteredResults([]);
      setUniqueCities([]);
      setInfoMessage('');
      stopLoading();
      if (abortControllerRef.current) abortControllerRef.current.abort();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    const trimmedInput = inputValue.trim();
    
    if (trimmedInput.length < 3) {
      setInfoMessage(commonT('typeMin3Chars'));
      return;
    }
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    initialSearchDone.current = true;
    performSearch(inputValue);
  };

  useEffect(() => {
    if (selectedCityFilter === '') {
      setFilteredResults(searchResults);
    } else {
      setFilteredResults(searchResults.filter((addr) => addr.city === selectedCityFilter));
    }
    setCurrentPage(1);
  }, [selectedCityFilter, searchResults]);

  const handleCityFilterClick = (city) => {
    setSelectedCityFilter((prevFilter) => (prevFilter === city ? '' : city));
  };

  const handleAddressClick = (address) => {
    // Always format the address for display in messages or logs.
    const formattedAddress = formatAddressForDisplay(address);

    // Apply the same filtering logic as in the render to check for available services
    const parseServices = (servicesStr) => {
      try {
        return typeof servicesStr === 'string' ? JSON.parse(servicesStr) : servicesStr || [];
      } catch (e) {
        return [];
      }
    };

    const allServices = address.activeServices || [];
    const availableServices = allServices.filter((service) => {
      // Filter out external services, keep all others (all, internal, or any other value)
      if (service.visible_on?.toLowerCase() === 'external') return false;
      const customerType = parseInt(service.c_type, 10);
      return customerType === 1 || customerType === 2;
    });

    // Debug logging to understand what's happening

    if (availableServices.length > 0 && address.id != null) {
      // Generate the address slug and route to the new broadband product page structure
      const addressSlug = generateBroadbandAddressSlug(address);
      router.push(`/kategori/bredband/${addressSlug}`);
    } else {
      // Don't show redundant error message for inactive addresses - user already sees the red "Inactive" status
      console.warn('No services available for address:', formattedAddress, 'ID:', address.id);
      // Removed redundant setInfoMessage call - the inactive status is already clear from the UI
    }
  };

  const copyToClipboard = async (event, text, accessId) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Capture mouse position for tooltip
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY - 40 // Show above mouse cursor
    });
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccessId(accessId);
      // Hide tooltip after 2 seconds
      setTimeout(() => setCopiedAccessId(null), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentDisplayedResults = filteredResults.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (resultsContainerRef.current) {
      if (
        currentPage > 1 ||
        (currentPage === 1 && (searchResults.length > 0 || initialQueryFromUrl.current))
      ) {
        resultsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage, searchResults.length]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > halfPagesToShow + 2 && totalPages > maxPagesToShow) {
        pageNumbers.push('...');
      }
      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);
      if (currentPage <= halfPagesToShow + 1) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - (pageNumbers.includes('...') ? 3 : 2));
      }
      if (currentPage >= totalPages - halfPagesToShow && totalPages > maxPagesToShow) {
        startPage = Math.max(
          2,
          totalPages - maxPagesToShow + (pageNumbers.includes('...') ? 3 : 2),
        );
      }
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pageNumbers.push(i);
        }
      }
      if (pageNumbers[pageNumbers.length - 1] === '...' && endPage >= totalPages - 1) {
        pageNumbers.pop();
      }
      if (pageNumbers[1] === '...' && startPage <= 2) {
        pageNumbers.splice(1, 1);
      }
      if (
        currentPage < totalPages - halfPagesToShow - 1 &&
        endPage < totalPages - 1 &&
        totalPages > maxPagesToShow
      ) {
        pageNumbers.push('...');
      }
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }
    return [...new Set(pageNumbers)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-primary border-b border-divider">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold my-8 text-secondary">
          {t('pageTitle') || 'Sök Bredband på din Adress'}
        </h1>
        <p className="text-lg mb-8 text-secondary">
          {t('introParagraph') ||
            'Påbörja en sökning av din adress nedan så kan du sedan ta del av våra erbjudanden.'}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3"
        >
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Suspense fallback={<div className="w-5 h-5 bg-secondary/10 rounded animate-pulse" />}>
                <MagnifyingGlassIcon className="w-5 h-5 text-secondary/75" aria-hidden="true" />
              </Suspense>
            </div>
            <input
              ref={inputRef}
              type="search"
              id="address-page-search"
              className="block w-full p-4 ps-10 text-sm text-secondary border border-divider rounded-lg bg-primary focus:ring-accent focus:border-accent placeholder:text-secondary/75 shadow-sm"
              placeholder={t('enterYourAddress')}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-primary px-5 py-4 text-sm font-semibold rounded-lg shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap"
          >
            {commonT('search')}
          </button>
        </form>
            {infoMessage && (
              <p
                className={`mt-2 text-sm ${infoMessage === commonT('searchError') ? 'text-failure' : 'text-secondary/80'}`}
              >
                {infoMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-6 sm:px-6">
        {isLoading && (
          <AddressResultSkeleton count={12} />
        )}

        <div ref={resultsContainerRef}>
        {!isLoading && searchResults.length > 0 && (
          <>
            <div className="text-center mb-6 text-secondary">
              <h2 className="text-xl font-bold mb-2">
                {t('searchResultsTitle') || 'Sökresultat'}
              </h2>
              <p className="text-sm">
                <strong>{filteredResults.length}</strong>{' '}
                {commonT(filteredResults.length === 1 ? 'result' : 'results')}{' '}
                {commonT('forYourSearch', { highlightedTerm: `"${inputValue}"` })}
              </p>
            </div>

            {uniqueCities.length > 1 && (
              <div className="mb-6 text-center">
                <p className="mb-3 text-secondary">
                  {t('filterByCityPrompt') || 'Filtrera ytterligare genom att välja en stad:'}
                </p>
                
                {/* Mobile: Dropdown Select */}
                <div className="sm:hidden">
                  <div className="relative max-w-xs mx-auto">
                    <select
                      value={selectedCityFilter}
                      onChange={(e) => setSelectedCityFilter(e.target.value)}
                      className="block w-full px-3 py-2 pr-8 text-sm border border-divider rounded-lg bg-primary text-secondary focus:ring-accent focus:border-accent appearance-none"
                    >
                      <option value="">{t('allCities') || 'Alla städer'}</option>
                      {uniqueCities.map((city) => (
                        <option key={city} value={city}>
                          {sanitizeText(city)}
                        </option>
                      ))}
                    </select>
                    <Suspense fallback={<div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-secondary/10 rounded animate-pulse" />}>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary/60 pointer-events-none" />
                    </Suspense>
                  </div>
                </div>
                
                {/* Desktop: Flexible Button Grid with Expand/Collapse */}
                <div className="hidden sm:block">
                  {/* Medium screens: show up to 4 cities initially, flexible wrap layout */}
                  <div className="lg:hidden">
                    <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                      {(showAllCities ? uniqueCities : uniqueCities.slice(0, 4)).map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCityFilterClick(city)}
                          className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors whitespace-nowrap
                                    ${
                                      selectedCityFilter === city
                                        ? 'bg-accent text-primary border-accent'
                                        : 'bg-secondary/10 text-secondary border-divider hover:bg-secondary/20'
                                    }`}
                        >
                          {sanitizeText(city)}
                        </button>
                      ))}
                    </div>
                    {uniqueCities.length > 4 && (
                      <button
                        onClick={() => setShowAllCities(!showAllCities)}
                        className="mt-3 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                      >
                        {showAllCities 
                          ? (t('showLess') || 'Visa färre städer') 
                          : (t('showMore') || `Visa ${uniqueCities.length - 4} fler städer`)
                        }
                      </button>
                    )}
                  </div>
                  
                  {/* Large screens: show up to 6 cities initially, flexible wrap layout */}
                  <div className="hidden lg:block">
                    <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                      {(showAllCities ? uniqueCities : uniqueCities.slice(0, 6)).map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCityFilterClick(city)}
                          className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors whitespace-nowrap
                                    ${
                                      selectedCityFilter === city
                                        ? 'bg-accent text-primary border-accent'
                                        : 'bg-secondary/10 text-secondary border-divider hover:bg-secondary/20'
                                    }`}
                        >
                          {sanitizeText(city)}
                        </button>
                      ))}
                    </div>
                    {uniqueCities.length > 6 && (
                      <button
                        onClick={() => setShowAllCities(!showAllCities)}
                        className="mt-3 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                      >
                        {showAllCities 
                          ? (t('showLess') || 'Visa färre städer') 
                          : (t('showMore') || `Visa ${uniqueCities.length - 6} fler städer`)
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {currentDisplayedResults.map((address) => {
                // Apply the same filtering logic as useBroadbandData to determine actual service availability
                const allServices = address.activeServices || [];
                
                
                const availableServices = allServices.filter((service) => {
                  // Filter out external services, keep all others (all, internal, or any other value)
                  if (service.visible_on?.toLowerCase() === 'external') return false;
                  const customerType = parseInt(service.c_type, 10);
                  return customerType === 1 || customerType === 2;
                });
                
                // Show green only if there are services available after filtering
                const isActive = availableServices.length > 0 && address.id != null;
                return (
                  <div
                    key={address.id}
                    onClick={() => handleAddressClick(address)}
                    className={`relative p-3 rounded-lg border flex flex-col transition-all duration-150 ease-in-out overflow-hidden
                              ${
                                isActive
                                  ? 'cursor-pointer hover:border-accent hover:bg-secondary/5 border-divider'
                                  : 'cursor-not-allowed bg-secondary/10 border-divider opacity-70'
                              }`}
                  >
                    <div
                      className={`absolute top-0 left-0 px-2 py-0.5 text-xs font-semibold 
                                ${isActive ? 'bg-success text-primary' : 'bg-failure text-primary'} 
                                rounded-br-lg`}
                    >
                      {isActive ? t('statusActive') : t('statusInactive')}
                    </div>
                    <div className="grow text-secondary pt-8">
                      {sanitizeText(address.streetName)} {sanitizeText(address.streetNumber)}
                      {address.streetLittera && ` ${sanitizeText(address.streetLittera)}`}{' '}
                      {address.mduApartmentNumber ? `Lgh ${sanitizeText(address.mduApartmentNumber)}` : ''},
                      <br />
                      {sanitizeText(address.city)} {sanitizeText(address.postalCode)}{' '}
                    </div>
                    <div className="pl-2 text-right text-xs text-secondary/75 mt-2">
                      <small>{sanitizeText(address.stadsnat)} fibernät</small>
                      <br />
                      {address.mduDistinguisher && (
                        <span className="block">{sanitizeText(address.mduDistinguisher)}</span>
                      )}
                      <button
                        onClick={(e) => copyToClipboard(e, address.accessId, address.accessId)}
                        className="mt-1 text-xs font-medium px-2 py-0.5 rounded border border-divider bg-primary hover:bg-secondary/10 text-secondary transition-colors"
                        title={t('copyAccessId')}
                      >
                        :{address.accessId}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <nav
                className="flex items-center justify-between border-t border-divider px-4 sm:px-0 mt-8 pt-4 sm:pt-6"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-secondary">
                    {commonT('showing')} <span className="font-medium">{startIndex + 1}</span>{' '}
                    {commonT('to')}{' '}
                    <span className="font-medium">
                      {Math.min(endIndex, filteredResults.length)}
                    </span>{' '}
                    {commonT('of')} <span className="font-medium">{filteredResults.length}</span>{' '}
                    {commonT(filteredResults.length === 1 ? 'result' : 'results')}
                  </p>
                </div>
                <div className="flex flex-1 justify-between sm:justify-end space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-divider bg-primary px-3 py-2 text-sm font-medium text-secondary hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Suspense fallback={<div className="h-5 w-5 bg-secondary/10 rounded animate-pulse mr-1" />}>
                      <ChevronLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                    </Suspense>
                    {commonT('previous')}
                  </button>
                  <div className="hidden md:flex items-center space-x-1">
                    {getPageNumbers().map((page, index) =>
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          aria-current={page === currentPage ? 'page' : undefined}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                        ${
                                          page === currentPage
                                            ? 'z-10 bg-accent border-accent text-primary'
                                            : 'border-divider bg-primary text-secondary hover:bg-secondary/5'
                                        }`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span
                          key={index}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-secondary"
                        >
                          {page}
                        </span>
                      ),
                    )}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-md border border-divider bg-primary px-3 py-2 text-sm font-medium text-secondary hover:bg-secondary/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commonT('next')}
                    <Suspense fallback={<div className="h-5 w-5 bg-secondary/10 rounded animate-pulse ml-1" />}>
                      <ChevronRightIcon className="h-5 w-5 ml-1" aria-hidden="true" />
                    </Suspense>
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
        {!isLoading &&
          inputValue.length >= 3 &&
          searchResults.length === 0 &&
          infoMessage === commonT('noResultsFound') && (
            <div className="text-center py-12 text-secondary">
              <p className="mb-4">{commonT('noResultsFoundForTerm', { term: inputValue })}</p>
            </div>
          )}
      </div>

        {/* Custom tooltip for copied feedback */}
        {copiedAccessId && (
          <div
            className="fixed z-50 px-2 py-1 text-xs font-medium text-primary bg-accent rounded shadow-lg pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, 0)'
            }}
          >
            {commonT('copied')}
          </div>
        )}
      </div>
    </div>
  );
}
