'use client';
import Image from 'next/image';

export default function BrfIntroAndBenefitsSection({
  primaryFeatureData,
  secondaryFeatureData,
  tvFeatureData,
  priceTagline,
}) {
  return (
    <>
      {primaryFeatureData?.image?.src && (
        <div className="relative overflow-hidden bg-primary pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="relative">
            <div className="lg:items-center lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16 lg:col-start-2">
                <div>
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-md bg-accent text-primary">
                      <primaryFeatureData.icon aria-hidden="true" className="size-6" />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-secondary">
                      {primaryFeatureData.name}
                    </h2>
                    {primaryFeatureData.descriptionParts && priceTagline ? (
                      <p className="mt-4 text-lg text-secondary/90">
                        {primaryFeatureData.descriptionParts.beforePrice}
                        <span className="font-semibold text-secondary/80">
                          {priceTagline.prefix.toLowerCase()}{' '}
                        </span>
                        <span className="font-bold text-accent">{priceTagline.price}</span>
                        <span className="font-semibold text-secondary/80">
                          {priceTagline.suffix}
                        </span>
                        {primaryFeatureData.descriptionParts.afterPrice}
                      </p>
                    ) : (
                      <p className="mt-4 text-lg text-secondary/90">
                        {typeof primaryFeatureData.description === 'string'
                          ? primaryFeatureData.description
                          : (primaryFeatureData.descriptionParts?.beforePrice || '') +
                              (primaryFeatureData.descriptionParts?.afterPrice || '') ||
                            'Beskrivning kommer snart.'}
                      </p>
                    )}
                  </div>
                </div>
                {primaryFeatureData.testimonial &&
                  primaryFeatureData.testimonial.authorImage?.src && (
                    <div className="mt-8 border-t border-divider pt-6">
                      <blockquote>
                        <div>
                          <p className="text-base text-secondary/80">
                            "{primaryFeatureData.testimonial.quote}"
                          </p>
                        </div>
                        <footer className="mt-3">
                          <div className="flex items-center space-x-3">
                            <div className="shrink-0">
                              <Image
                                alt={
                                  primaryFeatureData.testimonial.authorImage.alt || 'Författarbild'
                                }
                                src={primaryFeatureData.testimonial.authorImage.src}
                                width={24}
                                height={24}
                                sizes="28px"
                                className="size-7 rounded-full object-cover"
                              />
                            </div>
                            <div className="text-base font-medium text-secondary/90">
                              {primaryFeatureData.testimonial.author}
                            </div>
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                  )}
              </div>

              <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
                <div className="-ml-48 pr-6 md:-ml-16 lg:m-0 lg:px-0">
                  <Image
                    alt={primaryFeatureData.image.alt || 'Primär funktion bild'}
                    src={primaryFeatureData.image.src}
                    width={primaryFeatureData.image.intrinsicWidth || 1920}
                    height={primaryFeatureData.image.intrinsicHeight || 1080}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
                    className="w-full rounded-xl shadow-xl ring-1 ring-black/5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {secondaryFeatureData?.image?.src && (
        <div className="relative overflow-hidden bg-secondary/5 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16">
                <div>
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-md bg-accent text-primary">
                      <secondaryFeatureData.icon aria-hidden="true" className="size-6" />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-secondary">
                      {secondaryFeatureData.name}
                    </h2>
                    <p className="mt-4 text-lg text-secondary/90">
                      {secondaryFeatureData.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-2">
                <div className="-mr-48 pl-6 md:-mr-16 lg:m-0 lg:px-0">
                  <Image
                    alt={secondaryFeatureData.image.alt || 'Sekundär funktion bild'}
                    src={secondaryFeatureData.image.src}
                    width={secondaryFeatureData.image.intrinsicWidth || 1920}
                    height={secondaryFeatureData.image.intrinsicHeight || 1080}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
                    className="w-full rounded-xl shadow-xl ring-1 ring-black/5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tvFeatureData?.image?.src && (
        <div className="relative overflow-hidden bg-primary pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16 lg:col-start-2">
                <div>
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-md bg-accent text-primary">
                      <tvFeatureData.icon aria-hidden="true" className="size-6" />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-secondary">
                      {tvFeatureData.name}
                    </h2>
                    <p className="mt-4 text-xl font-semibold text-secondary">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: tvFeatureData.priceTagline
                            .replace('26 kr / mån', '<span class="text-accent">26 kr / mån</span>')
                            .replace(
                              '26 SEK / month',
                              '<span class="text-accent">26 SEK / month</span>',
                            ),
                        }}
                      />
                    </p>
                    <p className="mt-4 text-lg text-secondary/90">{tvFeatureData.description}</p>

                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base font-medium text-secondary/80">
                      {tvFeatureData.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <span className="mr-2 h-2 w-2 rounded-full bg-accent"></span>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-secondary/70">{tvFeatureData.disclaimer}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1 lg:flex lg:items-center">
                <div className="-ml-48 pr-6 md:-ml-16 lg:m-0 lg:px-0">
                  <Image
                    alt={tvFeatureData.image.alt}
                    src={tvFeatureData.image.src}
                    width={tvFeatureData.image.intrinsicWidth || 1920}
                    height={tvFeatureData.image.intrinsicHeight || 1080}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 50vw"
                    className="w-full rounded-xl shadow-xl ring-1 ring-black/5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
