'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import OfferCard from '@/components/OfferCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import FaqSection from '@/components/FaqSection';
import StorageCard from '@/components/StorageCard';
import { features, PleskFaq, featuresIncluded, pleskCardData } from '@/components/plesk/PleskData';

export default function PleskPage() {
  const t = useTranslations('pleskPage');
  const getPleskFeatures = featuresIncluded(t);
  const getPleskCardData = pleskCardData(t);

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="sakerhet-cybersakerhet-online"
        imageSrc="https://internetportcom.b-cdn.net/se/img/sakerhet-cybersakerhet-online.jpg"
        titlePart1={t('commonBanner.title')}
        desc={t('commonBanner.desc')}
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel={t('commonBanner.linkLabel')}
      />
      <ContentBlock
        title={t('contentBlock.title')}
        desc={t('contentBlock.desc')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/plesk-webbhotell-server.jpg"
        alt="plesk-webbhotell-server"
        padd="pt-24 pb-[60px]"
      />
      <OfferCard
        title={t('moreFeatures.title')}
        offerData={features(t)}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-4"
        zIndex="z-[0]"
        addClass="featurebenefit"
        paddX=" "
      />
      <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] flex flex-col gap-30 py-24 mb-1">
        <div>
          <h2 className="text-3xl font-bold text-darkGray mb-4">{t('pleskFeatures.mainTitle')}</h2>
          <p className="text-base text-lightergray">{t('pleskFeatures.mainSubtitle')}</p>
        </div>
        <div className="flex flex-col gap-30">
          {getPleskFeatures.map((item, index) => {
            const isStringIcon = typeof item.icon === 'string';
            const ComponentIcon = isStringIcon ? null : item.icon;
            return (
              <div key={index} className="flex items-start gap-8 rounded-lg bg-primary h-full">
                <dt className="font-semibold">
                  <div className="rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                    {isStringIcon ? (
                      <div dangerouslySetInnerHTML={{ __html: item.icon }} />
                    ) : (
                      ComponentIcon && <ComponentIcon />
                    )}
                  </div>
                </dt>
                <dd className="flex flex-auto flex-col gap-2">
                  <h2 className="text-xl font-bold text-darkGray">{item.title}</h2>
                  <p className="text-base font-normal text-paraSecondary">{item.description}</p>
                </dd>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-secondary relative z-[0]">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[60px]">
            <h1 className="text-[32px] text-primary font-bold">{t('pleskConfig.mainTitle')}</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-30 gap-y-16">
            {getPleskCardData.map((data, index) => (
              <StorageCard
                key={index}
                title={data.title}
                configData={data.configData}
                price={data.price}
                buylink={data.buylink}
                buyLabel={data.buyLabel}
                isPopular={data.isPopular}
              />
            ))}
          </div>
        </div>
      </div>

      <FaqSection
        title={t('pleskFaq.title')}
        faqs={PleskFaq(t)}
        image="https://internetportcom.b-cdn.net/se/img/faq-support-kundservice.jpg"
        alt="faq-support-kundservice"
      />
      <AdvisorContactCard
        title={t('advisorContact.title')}
        desc={t('advisorContact.desc')}
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel={t('advisorContact.linkLabel')}
        gap="gap-[20]"
        marginBottom=" "
      />
    </div>
  );
}
