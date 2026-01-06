'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function PriceComparisonTable() {
  const t = useTranslations('objectStoragePage.pricing');

  // Define the structure using translation keys for labels
  const pricingComparisonData = [
    {
      section: t('sections.capacity'),
      rows: [
        ['0–500 TiB', 'kr 0.045 /GiB', 'kr 0.0200 /GiB', 'kr 0.0196 /GiB'],
        ['500+ TiB', t('labels.contact'), 'kr 0.0192 /GiB', 'kr 0.0196 /GiB'],
      ],
    },
    {
      section: t('sections.requests'),
      rows: [
        [t('labels.writeOps'), t('labels.noCharge'), 'kr 0.0460', 'kr 0.0426'],
        [t('labels.readOps'), t('labels.noCharge'), 'kr 0.0037', 'kr 0.0034'],
      ],
    },
    {
      section: t('sections.bandwidth'),
      rows: [
        ['0–50 TiB', t('labels.noCharge'), 'kr 0.0723 /GiB', 'kr 0.0681 /GiB'],
        [`${t('labels.next')} 100 TiB`, t('labels.noCharge'), 'kr 0.0596 /GiB', 'kr 0.0681 /GiB'],
        [`${t('labels.next')} 350 TiB`, t('labels.noCharge'), 'kr 0.0426 /GiB', 'kr 0.0681 /GiB'],
        ['500+ TiB', t('labels.contact'), 'kr 0.0426 /GiB', 'kr 0.0681 /GiB'],
      ],
    },
  ];

  return (
    <div className="w-full lg:px-[140px]">
      <div className="overflow-x-auto whitespace-nowrap sm:whitespace-normal md:overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full text-xs text-left">
          <thead>
            <tr className="bg-surfaceSecondary text-lightergray">
              <th className="px-4 py-2 border-b"></th>
              <th className="px-4 py-2 border-b font-semibold uppercase">{t('tableHead.port')}</th>
              <th className="px-4 py-2 border-b font-semibold uppercase">
                {t('tableHead.amazon')}
              </th>
              <th className="px-4 py-2 border-b font-semibold uppercase">
                {t('tableHead.google')}
              </th>
            </tr>
          </thead>

          <tbody>
            {pricingComparisonData.map((section, i) => (
              <React.Fragment key={i}>
                {/* Section Title */}
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-accent font-semibold bg-white border-b">
                    {section.section}
                  </td>
                </tr>

                {/* Rows */}
                {section.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-4 py-3 border-b ${
                          cellIndex === 0 ? 'font-semibold text-lightergray' : 'text-paraSecondary'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
