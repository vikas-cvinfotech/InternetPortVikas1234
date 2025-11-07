import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { extractSpeed } from '@/lib/utils/formatting';

/**
 * Custom hook to fetch, process, and manage broadband services for a given address ID.
 * @param {string | null} addressId - The unique identifier for the address.
 * @returns {object} The state and derived data for the broadband services page.
 */
export function useBroadbandData(addressId) {
  const t = useTranslations('broadbandServices');
  const commonT = useTranslations('common');

  const [installationAddress, setInstallationAddress] = useState(null);
  const [servicesPrivate, setServicesPrivate] = useState([]);
  const [servicesCompany, setServicesCompany] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Abort controller for cleanup
  const abortControllerRef = useState(() => new AbortController())[0];

  useEffect(() => {
    if (!addressId) {
      setIsLoading(false);
      setError(commonT('invalidAddressIdentifier'));
      return;
    }

    const fetchAddressAndServices = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch('/api/internal/internetport/get-address-by-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: addressId }),
          signal: abortControllerRef.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to fetch address: ${res.status}`);
        }
        const data = await res.json();

        if (!data.success || !data.response) {
          throw new Error(commonT('addressNotFound'));
        }

        const fetchedAddr = data.response;
        setInstallationAddress(fetchedAddr);

        if (!fetchedAddr.accessId) {
          throw new Error(commonT('missingAccessId'));
        }

        const parseServices = (servicesStr) => {
          try {
            return typeof servicesStr === 'string' ? JSON.parse(servicesStr) : servicesStr || [];
          } catch (e) {
            console.error('Failed to parse services string:', e);
            return [];
          }
        };

        const allServices = parseServices(fetchedAddr.servicesAvailable);
        const privateList = [];
        const companyList = [];

        allServices.forEach((service) => {
          // Filter out external services, keep all others (all, internal, or any other value)
          if (service.visible_on?.toLowerCase() === 'external') return;
          const customerType = parseInt(service.c_type, 10);
          if (customerType === 2) companyList.push(service);
          else if (customerType === 1) privateList.push(service);
        });

        setServicesPrivate(privateList);
        setServicesCompany(companyList);

        // Don't set error state when no services are available - let the component handle this gracefully
        // if (privateList.length === 0 && companyList.length === 0) {
        //   setError(t('noServicesAvailable'));
        // }
      } catch (err) {
        // Don't set error state if request was aborted
        if (err.name === 'AbortError') {
          return;
        }
        console.error('Error fetching broadband data:', err);
        setError(err.message || commonT('searchError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddressAndServices();
  }, [addressId, commonT, t, abortControllerRef.signal]);

  const sortServices = (services) => {
    return [...services].sort((a, b) => {
      const speedA = extractSpeed(a.friendlyname);
      const speedB = extractSpeed(b.friendlyname);
      if (speedA !== speedB) return speedA - speedB;
      const priceA = parseFloat(a.m_price) || 0;
      const priceB = parseFloat(b.m_price) || 0;
      if (priceA !== priceB) return priceA - priceB;
      return (a.friendlyname || '').localeCompare(b.friendlyname || '');
    });
  };

  const sortedServicesPrivate = useMemo(() => sortServices(servicesPrivate), [servicesPrivate]);
  const sortedServicesCompany = useMemo(() => sortServices(servicesCompany), [servicesCompany]);

  return {
    isLoading,
    error,
    installationAddress,
    servicesPrivate: sortedServicesPrivate,
    servicesCompany: sortedServicesCompany,
  };
}
