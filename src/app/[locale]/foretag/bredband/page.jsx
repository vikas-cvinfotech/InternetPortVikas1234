'use client';
import CallToAction from '@/components/CallToAction';
import ContentBlock from '@/components/ContentBlock';
import FaqSection from '@/components/FaqSection';
import OfferCard from '@/components/OfferCard';
import BroadbandHeroSection from '@/sections/broadband-page/broadbandHeroSection';
import FeatureSection from '@/sections/FeatureSection';
import ForetagCompanyPartner from '@/sections/foretag-page/ForetagCompanyPartner';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { features, faqData, ContentMap } from '@/components/broadband/broadbandData';

export default function BroadbandPage() {
  const t = useTranslations('header');

  return (
    <div className="w-full">
      <BroadbandHeroSection heroData="ddsf" />
      <ContentBlock
        title="Lorem ipsum dolor sit amet."
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium."
        // link="/"
        // linkLabel="Lorem Ipsum"
        imageUrl="https://internetportcom.b-cdn.net/se/img/team-mote-ovanifra%CC%8An.png"
        alt="broadbandtwo"
      />
      <OfferCard
        title="Current Offers"
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-4"
      />
      <FeatureSection powersection={true} />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 border border-solid border-l-0 border-r-0 border-borderGray">
          <h2 className="text-[32px] text-center font-bold mb-[60px] mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h2>
          <div className="mx-auto mt-[60px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="borderbottomeffect">
                <div className="border rounded-lg shadow-sm bg-primary p-8">
                  <div className="flex justify-between items-center mb-16">
                    <h2 className="text-2xl font-bold text-paraSecondary">Broadband Premium</h2>
                    <Link
                      href="/"
                      className="text-base font-normal bg-lightgreen rounded-lg px-3 py-1 leading-[24px] text-primary capitalize inline-block"
                    >
                      Popular
                    </Link>
                  </div>
                  <p className="text-base font-regular text-paraSecondary mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo,
                    tincidunt fringilla suscipit vitae.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex text-accent items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderbottomeffect">
                <div className="border rounded-lg shadow-sm bg-primary p-8">
                  <div className="flex justify-between items-center mb-16">
                    <h2 className="text-2xl font-bold text-paraSecondary">Broadband Base</h2>
                  </div>
                  <p className="text-base font-regular text-paraSecondary mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo,
                    tincidunt fringilla suscipit vitae.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex text-accent items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100%] z-[-2]">
          <span className="sr-only">kross-transparent-bakgrund</span>
          <Image
            alt="kross-transparent-bakgrund"
            src="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
            className="w-full h-full"
            width={1200}
            height={600}
            quality={100}
            priority
          />
        </div>
      </div>
      <ContentBlock
        title="Lorem ipsum dolor sit amet."
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium."
        imageUrl="https://internetportcom.b-cdn.net/se/img/smart-stad-natverk-uppkoppling-natt.jpg"
        alt="smart-stad-natverk-uppkoppling-natt"
      />
      <ForetagCompanyPartner
        {...ContentMap}
        somestyle1="md:col-span-6"
        somestyle2="md:col-span-6"
        gridJustifyCenter="h-full justify-center"
      />

      <FaqSection
        title="Lorem Ipsum Dolor Sit Amet."
        faqs={faqData}
        image="https://internetportcom.b-cdn.net/se/img/man-telefon-headset.png"
        alt="man-telefon-headset"
        link="/kunskapsbas"
        linkLabel="Browse Knowledge Base"
      />
      <div className="relative">
        <Image
          src="https://internetportcom.b-cdn.net/se/img/calltoaction-transparent-bakgrund.png"
          alt="calltoaction-transparent-bakgrund"
          width={1920}
          height={400}
          className="w-full h-[400px] object-cover"
          quality={100}
        />
        <div className="absolute inset-0 z-[1] flex justify-center items-center w-full">
          <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
            <CallToAction
              title="Lorem Ipsum is simply dummy text"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"
              link="/address-sok-bredband"
              linkLabel="Get Business Broadband"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
