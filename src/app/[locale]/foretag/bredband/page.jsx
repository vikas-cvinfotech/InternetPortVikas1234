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
import {
  features,
  faqData,
  ContentMap,
  GetBroadbandFeatures,
} from '@/components/broadband/broadbandData';
import { CheckMark } from '@/components/svgicon/SvgIcon';
import { renderTitle } from '@/components/renderDescription/renderTitle';

export default function BroadbandPage() {
  const t = useTranslations('broadbandPage');
  const features = GetBroadbandFeatures(t);

  // Generate the list from the translation array
  const list = (
    <ul className="list-disc ml-5 space-y-1 text-lightergray text-base  ">
      {t.raw('reliabilityContent.items').map((item, index) => (
        <li key={index} className="font-bold">
          {item.bold}
          <span className="font-normal text-paraSecondary">{item.normal}</span>
        </li>
      ))}
    </ul>
  );

  // faq section
  const faqData = t.raw('faqSection.questions').map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <div className="w-full">
      <BroadbandHeroSection
        titlePart1={t('hero.titlePart1')}
        subtitle={t('hero.subtitle')}
        imageSrc="https://internetportcom.b-cdn.net/se/img/broadbandnew.webp"
        imageAlt={t('hero.imageAlt')}
        tooltipText={t('hero.heroTooltip')}
      />
      <ContentBlock
        title={t('contentBlock.title')}
        desc={t('contentBlock.desc')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/team-mote-ovanifra%CC%8An.png"
        alt={t('contentBlock.alt')}
      />
      <OfferCard
        title={t('currentOffer.title')}
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-4"
        paddX=" "
      />
      <FeatureSection powersection={true} />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 border border-solid border-l-0 border-r-0 border-borderGray">
          <div className="text-center">{renderTitle(t('comparisonSection.title'))}</div>
          <div className="mx-auto mt-[60px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="borderbottomeffect">
                <div className="border rounded-lg shadow-sm bg-primary p-8 h-full">
                  <div className="flex justify-between items-center mb-16">
                    <h2 className="text-2xl font-bold text-paraSecondary">
                      {t('comparisonSection.premium.title')}
                    </h2>
                    <Link
                      href="/"
                      className="text-base font-normal bg-lightgreen rounded-lg px-3 py-1 leading-[24px] text-primary capitalize inline-block"
                    >
                      {t('comparisonSection.premium.tag')}
                    </Link>
                  </div>
                  <p className="text-base font-regular text-paraSecondary mb-8">
                    {t('comparisonSection.premium.description')}
                  </p>
                  <div className="flex flex-col gap-4">
                    {t.raw('comparisonSection.premium.features').map((feature, i) => (
                      <div key={i} className="flex text-accent items-center gap-2">
                        <CheckMark />
                        <span className="text-paraSecondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="borderbottomeffect">
                <div className="border rounded-lg shadow-sm bg-primary p-8 h-full">
                  <div className="flex justify-between items-center mb-16">
                    <h2 className="text-2xl font-bold text-paraSecondary">
                      {t('comparisonSection.base.title')}
                    </h2>
                  </div>
                  <p className="text-base font-regular text-paraSecondary mb-8">
                    {t('comparisonSection.base.description')}
                  </p>
                  <div className="flex flex-col gap-4">
                    {t.raw('comparisonSection.base.features').map((feature, i) => (
                      <div key={i} className="flex text-accent items-center gap-2">
                        <CheckMark />
                        <span className="text-paraSecondary">{feature}</span>
                      </div>
                    ))}
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
        title={t('reliabilityContent.title')}
        desc={t('reliabilityContent.description')}
        desc1={list}
        imageUrl="https://internetportcom.b-cdn.net/se/img/smart-stad-natverk-uppkoppling-natt.jpg"
        alt="smart-stad-natverk-uppkoppling-natt"
      />
      {/* <ForetagCompanyPartner
        {...ContentMap}
        somestyle1="md:col-span-6"
        somestyle2="md:col-span-6"
        gridJustifyCenter="h-full justify-center"
      /> */}

      <FaqSection
        title={t('faqSection.title')}
        faqs={faqData}
        image="https://internetportcom.b-cdn.net/se/img/man-telefon-headset.png"
        alt="man-telefon-headset"
        link="/kunskapsbas"
        linkLabel={t('faqSection.linkLabel')}
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
              title={t('ctaSection.title')}
              desc={t('ctaSection.description')}
              link="/address-sok-bredband"
              linkLabel={t('ctaSection.linkLabel')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
