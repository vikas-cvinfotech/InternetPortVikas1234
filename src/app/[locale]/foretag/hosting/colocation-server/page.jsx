'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import OfferCard from '@/components/OfferCard';
import FeatureCard from '@/components/FeatureCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import FaqSection from '@/components/FaqSection';
import StorageCard from '@/components/StorageCard';
import {
  features,
  ColacationFeatureCard,
  cardData,
} from '@/components/colocationserver/colocationserverData';

export default function ColocationServerPage() {
  const t = useTranslations('colocationServerPage');
  const cards = cardData(t);
  const featuresCard = ColacationFeatureCard(t);

  // Create the array dynamically (assuming 8 items)
  const colocationFaq = [...Array(8)].map((_, index) => ({
    question: t(`faqs.items.${index}.question`),
    answer: t(`faqs.items.${index}.answer`),
  }));

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="tekniker-datacenter-kontroll"
        imageSrc="https://internetportcom.b-cdn.net/se/img/tekniker-datacenter-kontroll.png"
        titlePart1={t('commonBanner.title')}
        desc={t('commonBanner.desc')}
        link="https://portal.internetport.com/cart/colocation/"
        linkLabel={t('commonBanner.linkLabel')}
      />
      <ContentBlock
        mainTitle={t('contentBlock.mainTitle')}
        mainDesc={t('contentBlock.mainDesc')}
        title={t('contentBlock.title')}
        desc={t('contentBlock.desc')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/server-rack-infrastruktur.png"
        alt="server-rack-infrastruktur"
        padd="pt-24 pb-[60px]"
        link="/kontakta-oss"
        linkLabel={t('contentBlock.linkLabel')}
      />
      <OfferCard
        title={t('features.Title')}
        offerData={features(t)}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-3"
        zIndex="z-[0]"
      />
      <div className="bg-secondary relative z-[0]">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[60px]">
            <h1 className="text-[32px] text-primary font-bold">{t('cards.sectionTitle')}</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-30 gap-y-16">
            {cards.map((data, index) => (
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
      <div className="relative bg-surfaceSecondary">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[60px]">
            <h1 className="text-[32px] text-secondary font-bold">More features</h1>
          </div>
          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-30">
              {featuresCard.map((item, index) => {
                return <FeatureCard key={index} {...item} paddX="5" />;
              })}
            </div>
          </div>
        </div>
      </div>
      <FaqSection
        title={t('faqs.title')}
        faqs={colocationFaq}
        image="https://internetportcom.b-cdn.net/se/img/fragetecken-faq-support.png"
      />
      <AdvisorContactCard
        title={t('advisorContact.title')}
        desc={t('advisorContact.desc')}
        link="/kontakta-oss"
        linkLabel={t('advisorContact.linkLabel')}
        gap="gap-[20]"
        marginBottom={' '}
      />
    </div>
  );
}
