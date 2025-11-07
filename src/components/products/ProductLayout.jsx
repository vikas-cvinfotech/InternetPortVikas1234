
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer';
import { getBunnyCDNImageUrl, IMAGE_PRESETS, getResponsiveSrcSet } from '@/lib/utils/bunnycdn';

export default function ProductLayout({ product, children, description, descriptionComponent }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="bg-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start gap-8">
          {/* Left Column: Image Gallery */}
          <TabGroup
            as="div"
            className="flex flex-col-reverse"
            selectedIndex={selectedImageIndex}
            onChange={setSelectedImageIndex}
          >
            {/* Image navigation controls */}
            {product.images && product.images.length > 1 && (
              <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
                {/* Mobile (< 1/4 >) navigation */}
                <div className="sm:hidden">
                  <div className="flex items-center justify-center gap-x-6">
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                      disabled={selectedImageIndex === 0}
                      className="rounded-md p-1 text-secondary/70 hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <div className="text-sm font-medium text-secondary">
                      {selectedImageIndex + 1} / {product.images.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                      disabled={selectedImageIndex === product.images.length - 1}
                      className="rounded-md p-1 text-secondary/70 hover:bg-secondary/10 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Desktop thumbnail navigation */}
                <TabList className="hidden sm:grid sm:grid-cols-4 sm:gap-6">
                  {product.images.map((image, index) => (
                    <Tab
                      key={index}
                      className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-primary text-sm font-medium uppercase text-secondary hover:bg-secondary/5 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-accent"
                    >
                      <span className="sr-only">{image.alt}</span>
                      <span className="absolute inset-0 overflow-hidden rounded-md">
                        <img
                          alt={image.alt}
                          src={getBunnyCDNImageUrl(image.src, IMAGE_PRESETS.productThumbnail)}
                          className="h-full w-full object-cover object-center"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-accent"
                      />
                    </Tab>
                  ))}
                </TabList>
              </div>
            )}

            <TabPanels className="w-full">
              {product.images &&
                product.images.map((image, index) => (
                  <TabPanel key={index}>
                    <div className="relative aspect-square w-full overflow-hidden sm:rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
                      <picture>
                        {/* Mobile image */}
                        <source
                          media="(max-width: 640px)"
                          srcSet={getBunnyCDNImageUrl(image.src, IMAGE_PRESETS.productHeroMobile)}
                        />
                        {/* Desktop image */}
                        <img
                          alt={image.alt}
                          src={getBunnyCDNImageUrl(image.src, IMAGE_PRESETS.productHero)}
                          srcSet={getResponsiveSrcSet(image.src, [600, 800, 1200])}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                          className="absolute inset-0 h-full w-full object-contain object-center p-4"
                          loading="lazy"
                        />
                      </picture>
                    </div>
                  </TabPanel>
                ))}
            </TabPanels>
          </TabGroup>

          {/* Right Column: Details & Strategy */}
          <div className="text-secondary">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Strategy-specific options are rendered here */}
            {children}
            
            {/* Description */}
            {(description || descriptionComponent) && (
              <div className="mt-10">
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6 text-base text-secondary/80">
                  {descriptionComponent ? descriptionComponent : <SafeHtmlRenderer html={description} />}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
