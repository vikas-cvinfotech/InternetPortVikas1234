'use client';
import { AddressSearchBox } from '@/components/AddressSearchBox';
import Image from 'next/image';

export default function ForetagHeroSection({ heroData }) {
  const {
    titlePart1 = 'Lorem Ipsum',
    titlePart2 = 'dolor sit!',
    subtitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
    image: {
      src: imageSrc = 'https://internetportcom.b-cdn.net/se/img/company-hero-section.webp',
      alt: imageAlt = 'Abstrakt bakgrundsbild för teknik och anslutning',
    } = {},
  } = heroData || {};

  return (
    <div className="relative">
      <div className="mx-auto max-w-full">
        <div className="relative shadow-xl sm:overflow-hidden">
          <div className="absolute inset-0 ">
            <Image
              alt={imageAlt}
              src={imageSrc}
              fill
              className="object-cover lg:object-top-10"
              priority
            />
            <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply" />
          </div>
          <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32 lg:w-[65%] mx-auto flex flex-col justify-center items-center">
            <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-primary">{titlePart1}</span>
              <span className="text-primary">{titlePart2}</span>
            </h1>

            <div className="w-full max-w-md sm:max-w-lg pt-[96px] relative">
              <div className="absolute top-1/4 left-1/2 -translate-y-1/4 -translate-x-1/2 w-full flex justify-center items-center">
                <div className="relative inline-block">
                  <div className="px-6 py-1 text-primary text-sm md:text-base font-medium bg-lightaccent  rounded-full ">
                    Duis Nec Commodo Dolor, Ac Vulputate Purus.
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-6 h-6 z-[-10]">
                    <div className="absolute w-8 h-8 bg-red-600 transform rotate-45 origin-bottom-left -translate-y-1/2 -ml-1 z-[-10]"></div>
                  </div>
                </div>
              </div>
              <AddressSearchBox data_page="company" />
            </div>
            <p className="mx-auto mt-8 max-w-lg text-center text-xl text-primary sm:max-w-3xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
