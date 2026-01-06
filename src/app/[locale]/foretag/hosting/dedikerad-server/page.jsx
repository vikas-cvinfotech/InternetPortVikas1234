'use client';

import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Image from 'next/image';
import OfferCard from '@/components/OfferCard';
import FeatureCard from '@/components/FeatureCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import VideoEmbed from '@/components/VideoEmbed';
import {
  features,
  featureCard,
  ServerUses,
} from '@/components/dedicatedserver/dedicatedserverData';

export default function DedicatedServerPage() {
  const t = useTranslations('dedicatedServerPage');
  const tList = useTranslations('dedicatedServerPage.usesSection.list');
  const translatedCards = featureCard(t);

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="server-hardiskar-narbild"
        imageSrc="https://internetportcom.b-cdn.net/se/img/server-hardiskar-narbild.png"
        titlePart1={t('commonBanner.title')}
        desc={t('commonBanner.description')}
        link="https://portal.internetport.com/cart/dedicated-servers/"
        linkLabel={t('commonBanner.linkLabel')}
      />
      <ContentBlock
        title={t('contentBlock.title')}
        desc={t('contentBlock.desc')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/hand-fiberoptisk-kabel.png"
        alt="hand-fiberoptisk-kabel"
        padd="pt-24 pb-[60px]"
        mainTitle={t('contentBlock.mainTitle')}
        mainDesc={t('contentBlock.mainDesc')}
      />
      <OfferCard
        title={t('vpsFeatures.title')}
        offerData={features(t)}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-3"
        zIndex="z-[0]"
      />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
            <div className="flex flex-col gap-30">
              <h2 className="text-[32px] font-bold capitalize">{t('usesSection.title')}</h2>
              <p className="text-base">{t('usesSection.p1')}</p>
              <p className="text-base">{t('usesSection.p2')}</p>
            </div>
            <div className="relative z-[1]">
              <div className="borderbottomeffect ">
                <div className="flex flex-col border shadow-darkShadow rounded-lg px-6 py-12 bg-primary border-borderGray h-full">
                  {ServerUses(tList).map((item, index) => {
                    return (
                      <dt
                        key={index}
                        className="text-base font-normal text-paraSecondary flex gap-4 mb-5"
                      >
                        <div className="rounded-md inline-flex items-start">{item.icon}</div>
                        <div>{item.title}</div>
                      </dt>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-[96px]">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-secondary translate-y-[-50px] lg:translate-y-[-90px] z-[2]"></div>

        {/* Foreground Content */}
        <div className="relative px-4 sm:px-6 lg:px-[50px] xl:px-[80px] xxl:px-[135px] z-10">
          <div className="-mb-24">
            <div className="grid grid-cols-1 bg-primary p-5 lg:p-10 rounded-md shadow-sm gap-x-[60px] gap-y-[40px] lg:gap-y-[60px]">
              <div className="relative mx-auto flex flex-col items-center justify-center gap-30 text-center lg:text-start">
                <h2 className="text-3xl md:text-[32px] font-bold text-secondary capitalize">
                  {t('controlPanel.title')}
                </h2>
                <p className="text-base text-paraSecondary">{t('controlPanel.description')}</p>
              </div>

              <div className="video-container">
                <VideoEmbed />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mt-8 md:mt-[60px] my-[60px]">
            <h1 className="text-[32px] text-secondary font-bold">Other Features</h1>
          </div>
          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-30">
              {translatedCards.map((item, index) => {
                return <FeatureCard key={index} {...item} />;
              })}
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
            title={t('advisorContact.title')}
            link="https://internetport.se/en/kontakta-oss"
            linkLabel={t('advisorContact.linkLabel')}
            paddingBottom="pb-0"
            gap="gap-[20]"
          />
        </div>
      </div>
    </div>
  );
}
