'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import OfferCard from '@/components/OfferCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import Image from 'next/image';
import { internetExchangeFeatures } from '@/components/internetChange/internetexchangeData';

export default function ColocationServerPage() {
  const t = useTranslations('internetExchangePage');

  const translatedFeatures = internetExchangeFeatures.map((icon, index) => ({
    name: t(`features.items.${index}.title`),
    description: t(`features.items.${index}.desc`),
    icon: icon,
  }));

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="server-rack-ljus"
        imageSrc="https://internetportcom.b-cdn.net/se/img/server-rack-ljus.png"
        titlePart1={t('commonBanner.title')}
        desc={t('commonBanner.desc')}
        link="https://portal.internetport.com/cart/colocation/"
        linkLabel={t('commonBanner.linkLabel')}
      />
      <ContentBlock
        mainTitle={t('contentBlock.mainTitle')}
        mainDesc={t('contentBlock.mainDesc')}
        title={t('contentBlock.title')}
        desc={t('contentBlock.desc')} // Renderar strängen med <br/> taggar
        imageUrl="https://internetportcom.b-cdn.net/se/img/jorden-rymden-ljus.png"
        alt="jorden-rymden-ljus"
        padd="pt-24 pb-[60px]"
        link="https://internetport.se/en/kontakta-oss"
        linkLabel={t('contentBlock.linkLabel')}
      />
      <OfferCard
        title="Why Internetport IP CONNECTION IX?"
        offerData={translatedFeatures}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-3"
        zIndex="z-[0]"
      />

      <div className="relative">
        <Image
          src="https://internetportcom.b-cdn.net/se/img/calltoaction-transparent-bakgrund.png"
          alt="calltoaction-transparent-bakgrund"
          width={1920}
          height={400}
          className="w-full h-full md:h-[490px] object-cover absolute md:relative"
          quality={100}
        />
        <div className="static pt-12 md:pt-0 md:absolute inset-0 z-[1] flex justify-center items-center w-full">
          <AdvisorContactCard
            title={t('advisorContact.title')}
            desc={t('advisorContact.desc')}
            link="https://internetport.se/en/kontakta-oss"
            linkLabel={t('advisorContact.linkLabel')}
            paddingBottom="pb-0"
            gap="gap-[20]"
            marginBottom="mb-16 md:mt-16 lg:mb-0 lg:mt-0"
          />
        </div>
      </div>
    </div>
  );
}
