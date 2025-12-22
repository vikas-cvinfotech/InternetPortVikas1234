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
  colocationFaq,
  cardData,
} from '@/components/colocationserver/colocationserverData';

export default function ColocationServerPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="tekniker-datacenter-kontroll"
        imageSrc="https://internetportcom.b-cdn.net/se/img/tekniker-datacenter-kontroll.png"
        titlePart1="Colocation Server"
        desc="Colocation is available in 2 datacenter Hudiksvall and Interxion Stockholm and we are cooperating with Interxion in other locations all across the world."
        link="https://portal.internetport.com/cart/colocation/"
        linkLabel="View Colocation Options"
      />
      <ContentBlock
        title="Colocation configurations"
        desc="Internetport offer security and flexibility. Clients have personal access to our data centers around the clock. All comings-and-goings are logged and monitored. Help for emergencies is available at all times, both for consultation and remote help."
        desc1="Colocation is available in 2 datacenter Hudiksvall and Interxion Stockholm  and we are cooperating with Interxion in other locations all across the World."
        desc2="If you are intresting in colocation – get in touch with us for more information and let us help you."
        imageUrl="https://internetportcom.b-cdn.net/se/img/server-rack-infrastruktur.png"
        alt="server-rack-infrastruktur"
        padd="pt-24 pb-[60px]"
        link="/kontakta-oss"
        linkLabel="Contact Colocation Team"
        mainTitle="Easy management"
        mainDesc="If you are intrested in colocation – get in touch with us for more information and let us help you."
      />
      <OfferCard
        title="Why Choose Internetport Colocation?"
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-3"
        zIndex="z-[0]"
      />
      <div className="bg-secondary relative z-[0]">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[60px]">
            <h1 className="text-[32px] text-primary font-bold">Colocation Server configurations</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-30 gap-y-16">
            {cardData.map((data, index) => (
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
              {ColacationFeatureCard.map((item, index) => {
                return <FeatureCard key={index} {...item} paddX="5" />;
              })}
            </div>
          </div>
        </div>
      </div>
      <FaqSection
        title="Frequently asked questions"
        faqs={colocationFaq}
        image="https://internetportcom.b-cdn.net/se/img/fragetecken-faq-support.png"
      />
      <AdvisorContactCard
        title="If you are interested in colocation"
        desc="Get in touch with us for more information and let us help you."
        link="/kontakta-oss"
        linkLabel="Request Custom Quote"
        gap="gap-[20]"
        marginBottom={' '}
      />
    </div>
  );
}
