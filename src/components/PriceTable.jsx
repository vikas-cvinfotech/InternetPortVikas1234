import { useTranslations } from 'next-intl';
import React, { useState, useMemo } from 'react';

export default function PriceTable({ pricingData, t }) {
  const [searchTerm, setSearchTerm] = useState('');
  // State to track if the table is expanded
  const [showAll, setShowAll] = useState(false);

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) {
      return pricingData;
    }

    return pricingData.filter((item) => {
      return item.country.toLowerCase().includes(query);
    });
  }, [searchTerm, pricingData]);

  // Logic to determine which rows to display
  // If showAll is false and there's no search query, only show first 4 items
  const displayedData = useMemo(() => {
    if (showAll || searchTerm.trim() !== '') {
      return filteredData;
    }
    return filteredData.slice(0, 10);
  }, [filteredData, showAll, searchTerm]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl">
      <div className="w-full rounded-md border border-gray-200 rounded-bl-xl rounded-br-xl mb-6">
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
              {displayedData.map((item, index) => (
                <tr
                  key={item.country}
                  className={index % 2 === 0 ? 'hover:bg-gray-50' : 'bg-white hover:bg-gray-50'}
                >
                  <td className="px-4 py-3 text-lightergray text-xs font-semibold">
                    {item.country}
                  </td>
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

      {/* "Show all" Button - Only visible if not searching and list is collapsed */}
      {!showAll && searchTerm === '' && filteredData.length > 4 && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm d-block px-8 py-2.5 rounded-[4px] font-semibold bg-accent text-primary hover:bg-hoveraccent uppercase"
        >
          {t('internationalPrices.viewAll')}
        </button>
      )}

      {/* "Show less" Button - Only visible if list is expanded and not searching */}
      {showAll && searchTerm === '' && filteredData.length > 4 && (
        <button
          onClick={() => setShowAll(false)}
          className="text-sm d-block px-8 py-2.5 rounded-[4px] font-semibold bg-accent text-primary hover:bg-hoveraccent uppercase"
        >
          {t('internationalPrices.viewLess')}
        </button>
      )}
    </div>
  );
}
