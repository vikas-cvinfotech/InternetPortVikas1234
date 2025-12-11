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
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="sakerhet-cybersakerhet-online"
        imageSrc="https://internetportcom.b-cdn.net/se/img/sakerhet-cybersakerhet-online.jpg"
        titlePart1="Plesk webhosting"
        desc="Plesk is a popular web hosting control panel which offers next-level management of websites and domains from a single dashboard."
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel="Choose Package"
      />
      <ContentBlock
        title="Plesk webhosting configurations"
        desc="We provide the latest stable version of Plesk on our cloud web hosting platform for customers to manage their online presence."
        imageUrl="https://internetportcom.b-cdn.net/se/img/plesk-webbhotell-server.jpg"
        alt="plesk-webbhotell-server"
        padd="pt-24 pb-[60px]"
      />
      <OfferCard
        title="Features & benefits"
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-4"
        zIndex="z-[0]"
      />
      <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] flex flex-col gap-30 py-24 mb-1">
        <div>
          <h2 className="text-2xl font-bold text-darkGray mb-4">Plesk Obsidian Features</h2>
          <p className="text-base text-lightergray">
            The complete set of tools to build, secure and run your website or applications.
          </p>
        </div>
        <div className="flex flex-col gap-30">
          {featuresIncluded &&
            featuresIncluded.map((item, index) => {
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
            <h1 className="text-[32px] text-primary font-bold">Plesk configurations</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-30 gap-y-16">
            {pleskCardData.map((data, index) => (
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
        title="Frequently asked questions"
        faqs={PleskFaq}
        image="https://internetportcom.b-cdn.net/se/img/faq-support-kundservice.jpg"
        alt="faq-support-kundservice"
      />
      <AdvisorContactCard
        title="If you are interested in Plesk"
        desc="Get in touch with us for more information and let us help you."
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel="Talk to Our Team"
        gap="gap-[20]"
        marginBottom=" "
      />
    </div>
  );
}
