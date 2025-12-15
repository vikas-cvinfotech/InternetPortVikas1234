'use client';

import { BroadbandSearchBox } from '@/components/BroadbandSearchBox';
import Image from 'next/image';

export default function BroadbandHeroSection({ heroData }) {
  const {
    titlePart1 = 'Lorem Ipsum',
    titlePart2 = 'Dolor Sit!',
    subtitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
    image: {
      src: imageSrc = 'https://internetportcom.b-cdn.net/se/img/broadbandnew.webp',
      alt: imageAlt = 'Abstrakt bakgrundsbild för teknik och anslutning',
    } = {},
  } = heroData || {};

  return (
    <div className="relative">
      <div className="mx-auto max-w-full">
        <div className="relative shadow-xl sm:overflow-hidden">
          <div className="relative w-full">
            <Image
              alt={imageAlt}
              src={imageSrc}
              width={1440}
              height={600}
              className="w-full h-[600px] object-cover lg:object-top-168 "
            />
            <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply" />
          </div>
          <div className="absolute inset-0 py-24 lg:py-[158px] px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px]  grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
            <div className="flex flex-col gap-30">
              <h1 className="text-start text-4xl font-semibold  sm:text-5xl lg:text-6xl/[1.5]">
                <span className="text-primary">{titlePart1}</span> <br />
                <span className="text-primary">{titlePart2}</span>
              </h1>
              <p className="text-base text-primary sm:max-w-3xl">{subtitle}</p>
            </div>

            <div className="w-full  ">
              <BroadbandSearchBox btn_bg_color="red" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
