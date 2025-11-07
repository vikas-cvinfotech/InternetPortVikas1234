'use client';

import Image from 'next/image';
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';

export default function VpnExplainerSection({
  title = 'EXPLAINER_TITLE_HERE',
  subtitle = 'EXPLAINER_SUBTITLE_HERE',
  features = [
    {
      name: 'FEATURE_1_NAME_HERE',
      description: 'FEATURE_1_DESCRIPTION_HERE',
      icon: ShieldCheckIcon,
    },
    {
      name: 'FEATURE_2_NAME_HERE',
      description: 'FEATURE_2_DESCRIPTION_HERE',
      icon: EyeSlashIcon,
    },
    {
      name: 'FEATURE_3_NAME_HERE',
      description: 'FEATURE_3_DESCRIPTION_HERE',
      icon: GlobeAltIcon,
    },
    {
      name: 'FEATURE_4_NAME_HERE',
      description: 'FEATURE_4_DESCRIPTION_HERE',
      icon: LockClosedIcon,
    },
  ],
  whyVpn = {
    title: 'WHY_VPN_HEADLINE_HERE',
    description: 'WHY_VPN_DESCRIPTION_HERE',
    benefits: ['BENEFIT_1_HERE', 'BENEFIT_2_HERE', 'BENEFIT_3_HERE'],
  },
}) {
  // Add icons to features if not provided
  const featuresWithIcons = features.map((feature, index) => ({
    ...feature,
    icon: feature.icon || [ShieldCheckIcon, EyeSlashIcon, GlobeAltIcon, LockClosedIcon][index],
  }));
  return (
    <>
      <div className="bg-secondary/5 py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-lg text-secondary/70 max-w-3xl mx-auto">{subtitle}</p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuresWithIcons.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center">
                    <span className="flex size-12 items-center justify-center rounded-md bg-accent text-primary">
                      <feature.icon className="size-6" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-secondary">{feature.name}</h3>
                  <p className="mt-2 text-base text-secondary/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-secondary sm:text-3xl">{whyVpn.title}</h3>
              <p className="mt-4 text-base text-secondary/70">{whyVpn.description}</p>
              <ul className="mt-6 space-y-2">
                {whyVpn.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <ShieldCheckIcon className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="ml-3 text-secondary">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden">
                <Image
                  src="https://internetportcom.b-cdn.net/se/img/vpn-mobil.webp"
                  alt="VPN protection on mobile device"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
