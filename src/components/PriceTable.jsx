import { useTranslations } from 'next-intl';
import React, { useState, useMemo } from 'react';

// Data structure representing the table content
const pricingData = [
  {
    country: 'Afghanistan',
    connectionMobile: '0.00 kr',
    mobilePerMin: '0.00 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '7.40 kr/min',
  },
  {
    country: 'Albania',
    connectionMobile: '0.50 kr',
    mobilePerMin: '4.90 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '2.90 kr/min',
  },
  {
    country: 'Algeria',
    connectionMobile: '0.50 kr',
    mobilePerMin: '3.70 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '2.90 kr/min',
  },
  {
    country: 'Andorra',
    connectionMobile: '0.00 kr',
    mobilePerMin: '0.00 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '1.50 kr/min',
  },
  {
    country: 'Angola',
    connectionMobile: '0.00 kr',
    mobilePerMin: '0.00 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '7.40 kr/min',
  },
  {
    country: 'Anguilla',
    connectionMobile: '0.00 kr',
    mobilePerMin: '0.00 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '7.40 kr/min',
  },
  {
    country: 'Antigua And Barbuda',
    connectionMobile: '0.00 kr',
    mobilePerMin: '0.00 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '7.40 kr/min',
  },
  {
    country: 'Argentina',
    connectionMobile: '0.00 kr',
    mobilePerMin: '0.00 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '2.90 kr/min',
  },
  {
    country: 'Armenia',
    connectionMobile: '0.00 kr',
    mobilePerMin: '0.00 kr/min',
    connectionLandline: '0.50 kr',
    landlinePerMin: '7.40 kr/min',
  },
];

export default function PriceTable({ pricingData, t }) {
  // State to hold the current search term
  const [searchTerm, setSearchTerm] = useState('');

  // Filter the data based on the search term using useMemo for performance
  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) {
      return pricingData;
    }

    return pricingData.filter((item) => {
      // Check if the country name includes the search term
      return item.country.toLowerCase().includes(query);
    });
  }, [searchTerm]);

  return (
    <div className="w-full max-w-5xl rounded-md border border-gray-200 rounded-bl-xl rounded-br-xl">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          id="searchInput"
          placeholder={t('internationalPrices.searchPlaceholder')}
          className="w-full p-4 pl-4 text-mediumGray text-base border-0 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon className="w-5 h-5" />
        </span> */}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-bl-xl rounded-br-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-surfaceSecondary">
            <tr>
              <th className="px-4 py-2 text-left text-lightergray text-xs font-semibold uppercase tracking-wider min-w-[150px]">
                {t('internationalPrices.tableHeaders.country')}
              </th>
              <th className="px-4 py-2 text-left text-lightergray text-xs font-semibold uppercase tracking-wider min-w-[180px]">
                {t('internationalPrices.tableHeaders.connMobile')}
              </th>
              <th className="px-4 py-2 text-left text-lightergray text-xs font-semibold uppercase tracking-wider min-w-[150px]">
                {t('internationalPrices.tableHeaders.mobile')}
              </th>
              <th className="px-4 py-2 text-left text-lightergray text-xs font-semibold uppercase tracking-wider min-w-[180px]">
                {t('internationalPrices.tableHeaders.connLandline')}
              </th>
              <th className="px-4 py-2 text-left text-lightergray text-xs font-semibold uppercase tracking-wider min-w-[150px]">
                {t('internationalPrices.tableHeaders.landline')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredData.map((item, index) => (
              <tr
                key={item.country}
                className={index % 2 === 0 ? 'hover:bg-gray-50' : 'bg-white hover:bg-gray-50'}
              >
                <td className="px-4 py-3 text-lightergray text-xs font-semibold">{item.country}</td>
                <td className="px-4 py-3 text-paraSecondary text-xs font-normal">
                  {item.connectionMobile}
                </td>
                <td className="px-4 py-3 text-paraSecondary text-xs font-normal">
                  {item.mobilePerMin}
                </td>
                <td className="px-4 py-3 text-paraSecondary text-xs font-normal">
                  {item.connectionLandline}
                </td>
                <td className="px-4 py-3 text-paraSecondary text-xs font-normal">
                  {item.landlinePerMin}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No results message */}
        {filteredData.length === 0 && (
          <div className="text-center p-6 text-gray-500 text-lg">
            {t.rich('internationalPrices.noResults', {
              searchTerm: searchTerm,
              bold: (chunks) => <b className="text-accent">{chunks}</b>,
            })}
          </div>
        )}
      </div>
    </div>
  );
}
