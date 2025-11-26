'use client';

import Link from 'next/link';

export default function FeatureCard({ title, icon }) {
  console.log(title);
  console.log(icon);

  return (
    <div className="relative z-[0]">
      <div className="borderbottomeffect h-full">
        <div className="block flex items-center gap-4 border shadow-darkShadow rounded-lg p-6 bg-primary border-borderGray h-full">
          <dt className="font-semibold text-secondary">
            <div className="rounded-full inline-flex items-center bg-surfaceSecondary p-4">
              {icon}
            </div>
          </dt>
          <dd className="flex flex-auto items-center justify-between text-base/7 text-secondary">
            <div className="flex flex-col gap-4">
              <div className="text-lg font-semibold text-secondary">{title}</div>
            </div>
          </dd>
        </div>
      </div>
    </div>
  );
}
