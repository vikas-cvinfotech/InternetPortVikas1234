'use client';
import React from 'react';

const pricingComparisonData = [
  {
    section: 'Storage capacity (per GiB monthly):',
    rows: [
      ['0–500 TiB', 'kr 0.045 /GiB', 'kr 0.0200 /GiB', 'kr 0.0196 /GiB'],
      ['500+ TiB', 'Contact us', 'kr 0.0192 /GiB', 'kr 0.0196 /GiB'],
    ],
  },
  {
    section: 'Operational requests (monthly):',
    rows: [
      ['Write operations (per 10 000)', 'No charge', 'kr 0.0460', 'kr 0.0426'],
      ['Read operations (per 10 000)', 'No charge', 'kr 0.0037', 'kr 0.0034'],
    ],
  },
  {
    section: 'Public outbound bandwidth (per GiB monthly):',
    rows: [
      ['0–50 TiB', 'No charge', 'kr 0.0723 /GiB', 'kr 0.0681 /GiB'],
      ['Next 100 TiB', 'No charge', 'kr 0.0596 /GiB', 'kr 0.0681 /GiB'],
      ['Next 350 TiB', 'No charge', 'kr 0.0426 /GiB', 'kr 0.0681 /GiB'],
      ['500+ TiB', 'Contact us', 'kr 0.0426 /GiB', 'kr 0.0681 /GiB'],
    ],
  },
];

export default function PriceComparisonTable() {
  return (
    <div className="w-full lg:px-[140px]">
      <div className="overflow-x-auto whitespace-nowrap sm:whitespace-normal md:overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-left text-xs">
          <thead>
            <tr className="bg-surfaceSecondary text-lightergray">
              <th className="px-4 py-2 border-b"></th>
              <th className="px-4 py-2 border-b font-semibold">INTERNETPORT OBJECT STORAGE</th>
              <th className="px-4 py-2 border-b font-semibold">AMAZON S3</th>
              <th className="px-4 py-2 border-b font-semibold">GOOGLE CLOUD STORAGE</th>
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
                        className={`px-4 py-3 border-b
                      ${
                        cellIndex === 0
                          ? 'font-semibold text-lightergray' // first cell style
                          : 'text-paraSecondary' // others
                      }
                    `}
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
