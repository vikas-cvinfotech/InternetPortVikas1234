'use client';

import Image from 'next/image';

export default function VpnHeroSection({
  subtitle = 'SUBTITLE_HERE',
  description = 'DESCRIPTION_HERE',
  ctaText = 'CTA_TEXT_HERE',
  videoId = 'BlAieK1vANE',
  onCtaClick,
}) {
  const cdnBaseUrl = 'https://cdn.internetport.se/se/img/nordvpn/';

  return (
    <div className="bg-primary pt-0 pb-12 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="flex justify-center">
              <Image
                src={`${cdnBaseUrl}NordVPN_Logo_RGB_Primary_Blue_Black-01.svg`}
                alt="NordVPN Logo"
                width={200}
                height={60}
                className="h-48 w-auto"
                priority
              />
            </div>

            <div className="mb-16 flex justify-center">
              <p className="text-2xl text-secondary/70 max-w-xl">{subtitle}</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={onCtaClick}
                className="inline-flex items-center rounded-md bg-accent px-8 py-4 text-base font-medium text-primary hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-hidden transition-colors"
                aria-label="Go to VPN Product Page"
              >
                {ctaText}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title="VPN Explanation Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
