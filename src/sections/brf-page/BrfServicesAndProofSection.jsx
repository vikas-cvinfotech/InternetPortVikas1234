'use client';
import Image from 'next/image';

export default function BrfServicesAndProofSection({
  serviceFeaturesData,
  statsData,
  servicesTitle,
  servicesSubtitle,
  statsCatchyTitle,
  statsTitle,
  statsDescription,
  statsImage,
}) {
  return (
    <>
      <div className="bg-secondary text-primary">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:pt-20 sm:pb-24 lg:max-w-7xl lg:px-8 lg:pt-24">
          <h2 className="text-3xl font-bold tracking-tight text-primary">{servicesTitle}</h2>
          <p className="mt-4 max-w-3xl text-lg text-primary/80">{servicesSubtitle}</p>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
            {serviceFeaturesData.map((feature) => (
              <div key={feature.name}>
                <div>
                  <span className="flex size-12 items-center justify-center rounded-md bg-accent">
                    <feature.icon aria-hidden="true" className="size-6 text-primary" />
                  </span>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-primary">{feature.name}</h3>
                  <p className="mt-2 text-base text-primary/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-primary py-16 sm:py-24">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-secondary/5 xl:top-0 xl:h-full hidden xl:block" />
        <div className="mx-auto max-w-4xl px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-flow-col-dense xl:grid-cols-2 xl:gap-x-8">
          <div className="relative pt-12 pb-16 sm:pt-24 sm:pb-20 xl:col-start-1 xl:pb-24">
            <h2 className="text-base font-semibold">
              <span className="bg-gradient-to-r from-accent to-red-500 bg-clip-text text-transparent">
                {statsCatchyTitle}
              </span>
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-secondary">{statsTitle}</p>
            <p className="mt-5 text-lg text-secondary/90">{statsDescription}</p>
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
              {statsData.map((item) => (
                <p key={item.id}>
                  <span className="block text-2xl font-bold text-secondary">{item.stat}</span>
                  <span className="mt-1 block text-base text-secondary/80">
                    <span className="font-medium text-secondary">{item.emphasis}</span> {item.rest}
                  </span>
                </p>
              ))}
            </div>
          </div>
          <div className="relative h-80 xl:h-auto xl:col-start-2 mt-12 xl:mt-0">
            {statsImage?.src && (
              <Image
                alt={statsImage.alt}
                src={statsImage.src}
                width={statsImage.intrinsicWidth || 1920}
                height={statsImage.intrinsicHeight || 1441}
                className="size-full rounded-xl object-cover shadow-xl"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
