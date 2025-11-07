import { useMemo } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const apiStatusBaseUrl = process.env.NEXT_PUBLIC_STATUS_API_ENDPOINT;

const incidentStatusKeys = {
  0: 'statuses.incidents.scheduled',
  1: 'statuses.incidents.investigating',
  2: 'statuses.incidents.identified',
  3: 'statuses.incidents.monitoring',
  4: 'statuses.incidents.resolved',
};

const componentStatusKeys = {
  1: 'statuses.components.operational',
  2: 'statuses.components.performanceIssues',
  3: 'statuses.components.partialOutage',
  4: 'statuses.components.majorOutage',
};

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`An error occurred while fetching the data: ${res.statusText}`);
    }
    return res.json();
  });

/**
 * A utility function to format date strings based on locale.
 * @param {string} dateString - The date string to format.
 * @param {string} locale - The locale to use for formatting (e.g., 'en-US', 'sv-SE').
 * @returns {string} A formatted date string.
 */
const formatDate = (dateString, locale) => {
  try {
    return new Date(dateString).toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Custom hook to fetch and manage data for the status page.
 * @param {{locale: string}} props - The current locale for date formatting.
 * @returns {object} An object with status data, loading states, and actions.
 */
export const useStatusData = ({ locale }) => {
  const {
    data: componentsData,
    error: componentsError,
    isLoading: isLoadingComponents,
  } = useSWR(`${apiStatusBaseUrl}/components`, fetcher);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.meta.pagination.links.next_page) return null;
    if (pageIndex === 0) return `${apiStatusBaseUrl}/incidents?sort=id&order=desc&per_page=5`;
    return previousPageData.meta.pagination.links.next_page;
  };

  const {
    data: incidentsPages,
    error: incidentsError,
    size,
    setSize,
    isLoading: isLoadingIncidents,
    isValidating,
  } = useSWRInfinite(getKey, fetcher);

  const error = componentsError || incidentsError;

  const formattedComponents = useMemo(() => {
    if (!componentsData?.data) return [];
    return componentsData.data
      .filter((c) => c.enabled !== false)
      .map((c) => ({
        ...c,
        statusTitleKey: `${componentStatusKeys[c.status] || 'statuses.unknown'}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [componentsData]);

  const formattedIncidents = useMemo(() => {
    if (!incidentsPages) return [];
    const allIncidents = incidentsPages.flatMap((page) => page.data);
    return allIncidents.map((incident) => {
      const component = componentsData?.data.find((c) => c.id === incident.component_id);
      return {
        ...incident,
        component_name: component ? component.name : null,
        statusTitleKey: `${incidentStatusKeys[incident.status] || 'statuses.unknown'}`,
        formatted_created_at: formatDate(incident.created_at, locale),
      };
    });
  }, [incidentsPages, componentsData, locale]);

  const isLastPage = incidentsPages
    ? !incidentsPages[incidentsPages.length - 1]?.meta.pagination.links.next_page
    : false;
  const isLoadingMore = isValidating && incidentsPages?.length > 0;

  const fetchNextPage = () => {
    if (!isLoadingMore) {
      setSize(size + 1);
    }
  };

  return {
    components: formattedComponents,
    incidents: formattedIncidents,
    error,
    isLoading: isLoadingComponents || isLoadingIncidents,
    fetchNextPage,
    isLastPage,
    isLoadingMore,
  };
};
