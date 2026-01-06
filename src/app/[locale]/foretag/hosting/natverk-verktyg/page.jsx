'use client';

import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Image from 'next/image';
import FeatureCard from '@/components/FeatureCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import { DownloadIcon } from '@/components/network/networktoolData';

export default function NetworkToolPage() {
  const t = useTranslations('networkToolsPage');

  const networkFeatureItems = [
    { title: t('lookingGlass.files.mb100'), icon: <DownloadIcon /> },
    { title: t('lookingGlass.files.gb1'), icon: <DownloadIcon /> },
    { title: t('lookingGlass.files.gb10'), icon: <DownloadIcon /> },
  ];

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="tangentbord-narbild"
        imageSrc="https://internetportcom.b-cdn.net/se/img/tangentbord-narbild.png"
        titlePart1={t('commonBanner.title')}
        desc={t('commonBanner.desc')}
        link="https://portal.internetport.com/cart/anycastdns/"
        linkLabel={t('commonBanner.linkLabel')}
      />
      <ContentBlock
        title={t('contentBlock.title')}
        desc={t('contentBlock.desc')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/tekniker-natverk-kablar.png"
        alt="tekniker-natverk-kablar"
      />

      <div className="relative mt-[96px]">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-secondary translate-y-[-50px] lg:translate-y-[-90px] z-[2]"></div>

        {/* Foreground Content */}
        <div className="relative px-4 sm:px-6 lg:px-[50px] xl:px-[80px] xxl:px-[135px] z-10">
          <div className="-mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-primary p-5 lg:p-10 rounded-md shadow-sm gap-x-[60px] gap-y-4">
              <div className="relative mx-auto flex flex-col items-start justify-center gap-30">
                <h2 className="text-3xl md:text-[32px] font-bold text-secondary capitalize">
                  {t('lookingGlass.title')}
                </h2>
                <p className="text-base text-paraSecondary">{t('lookingGlass.desc')}</p>
              </div>

              <div>
                <Image
                  alt="falttekniker-laptop-server"
                  src="https://internetportcom.b-cdn.net/se/img/falttekniker-laptop-server.png"
                  className="object-cover rounded-md w-full h-full"
                  width={646}
                  height={400}
                  quality={100}
                />
              </div>
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
          className="w-full h-[550px] md:h-[450px] lg:h-[300px] object-cover"
          quality={100}
        />
        <div className="absolute top-[90px] md:top-[50px] lg:top-[40px] inset-0 z-[1] flex justify-center items-center w-full">
          <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-30">
              {networkFeatureItems.map((item, index) => {
                return <FeatureCard key={index} {...item} paddX="5" />;
              })}
            </div>
          </div>
        </div>
      </div>
      <ContentBlock
        title={t('testIPsBlock.title')}
        desc={t.raw('testIPsBlock.desc')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/elektriker-sakringsskåp.png"
        alt="elektriker-sakringsskåp"
        directionReverse="true"
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
          <AdvisorContactCard
            title={t('advisorBlock.title')}
            desc={t('advisorBlock.desc')}
            link="https://internetport.se/en/kontakta-oss"
            linkLabel={t('advisorBlock.linkLabel')}
            paddingBottom="pb-0"
            gap="gap-[20]"
            marginBottom={' '}
          />
        </div>
      </div>
    </div>
  );
}
