'use client';

import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Image from 'next/image';
import OfferCard from '@/components/OfferCard';
import FeatureCard from '@/components/FeatureCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import { features, featureCard } from '@/components/vps/vpsData';

export default function VPSPage() {
  const t = useTranslations('vpshostingPage');

  const translatedCards = featureCard(t);

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="server-rack-utrustning"
        imageSrc="https://internetportcom.b-cdn.net/se/img/server-rack-utrustning.png"
        titlePart1={t('commonBanner.title')}
        desc={t('commonBanner.description')}
        link="https://portal.internetport.com/cart/ipv-virtuell/"
        linkLabel={t('commonBanner.linkLabel')}
      />
      <ContentBlock
        mainTitle={t('contentBlock.mainTitle')}
        mainDesc={t('contentBlock.mainDesc')}
        title={t('contentBlock.title')}
        desc={t('contentBlock.description')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/ung-man-laptop-datacenter.png"
        alt="ung-man-laptop-datacenter"
        padd="pt-24 pb-[60px]"
      />
      <OfferCard
        title={t('offerCard.title')}
        offerData={features(t)} // Här anropas funktionen med t
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-3"
        zIndex="z-[0]"
      />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[80px]">
            <h1 className="text-[32px] text-secondary mb-4 font-bold">{t('benefits.title')}</h1>
            <p className="text-base text-paraSecondary">{t('benefits.description')}</p>
          </div>
          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-30">
              {translatedCards.map((item, index) => (
                <FeatureCard key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>

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
          <AdvisorContactCard
            title={t('advisor.title')}
            link="https://internetport.se/en/kontakta-oss"
            linkLabel={t('advisor.linkLabel')}
            paddingBottom="pb-0"
            marginBottom=" "
          />
        </div>
      </div>
    </div>
  );
}
