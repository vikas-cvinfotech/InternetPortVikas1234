'use client';
import Image from 'next/image';

export default function BrfHeroSection({ heroData, priceTagline }) {
  const {
    titlePart1 = 'Snabb & Framtidssäker',
    titlePart2 = 'Internetuppkoppling för BRF:er',
    subtitle = 'Information om våra tjänster kommer snart.',
    image: {
      src: imageSrc = 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      alt: imageAlt = 'Abstrakt bakgrundsbild för teknik och anslutning',
    } = {},
  } = heroData || {};

  return (
    <div className="relative">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary" />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative shadow-xl sm:overflow-hidden">
          <div className="absolute inset-0">
            <Image
              alt={imageAlt}
              src={imageSrc}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply" />
          </div>
          <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
            <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-primary">{titlePart1}</span>
              <span className="block text-primary">{titlePart2}</span>
            </h1>

            {priceTagline && (
              <p className="mt-4 text-center text-2xl font-semibold tracking-tight text-primary sm:text-3xl lg:text-4xl">
                <span className="text-primary">{priceTagline.prefix} </span>
                <span className="inline-block bg-primary/95 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 shadow-lg">
                  <span className="text-accent font-bold">{priceTagline.price}</span>
                  <span className="text-secondary">{priceTagline.suffix}</span>
                </span>
              </p>
            )}

            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-primary sm:max-w-3xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
