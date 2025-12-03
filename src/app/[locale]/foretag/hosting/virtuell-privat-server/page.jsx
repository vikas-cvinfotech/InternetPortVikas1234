'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Image from 'next/image';
import OfferCard from '@/components/OfferCard';
import FeatureCard from '@/components/FeatureCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import { features, featureCard } from '@/components/vps/vpsData';

export default function VPSPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="server-rack-utrustning"
        imageSrc="https://internetportcom.b-cdn.net/se/img/server-rack-utrustning.png"
        titlePart1="Cost-effective hosting solution"
        desc="A VPS not only provides peace of mind, but also offers a robust combination of additional benefits"
        link="https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0"
        linkLabel="Buy Now"
      />
      <ContentBlock
        title=""
        desc="There are a few ways you can choose the right VPS solution for your needs. You don’t have to hire an expert to find a VPS option that is right for you. Your current hosting provider can provide details about your operating system (OS), central processing unit (CPU), random access memory (RAM), and disk usage to help you make an informed decision. Also, any current traffic logs can help narrow down your choice even further!"
        desc1="If you are new to hosting or don’t know your current setup, contact our helpful staff and get used to a group of experts, dedicated to be on your side!"
        imageUrl="https://internetportcom.b-cdn.net/se/img/ung-man-laptop-datacenter.png"
        alt="ung-man-laptop-datacenter"
        padd="pt-24 pb-[60px]"
        mainTitle="Virtual Private Servers"
        mainDesc="The difference between a virtual private server (VPS) and a dedicated server is that a VPS is an emulation of a computer that lives within a parent server and shares resources with other virtual servers. A Dedicated Server is a stand-alone, physical server that does not share resources. "
      />
      <OfferCard
        title="VPS platforms at Internetport"
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-3"
        zIndex="z-[0]"
      />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[80px]">
            <h1 className="text-[32px] text-secondary mb-4 font-bold">Benefits of VPS hosting</h1>
            <p className="text-base text-paraSecondary">
              A VPS not only provides peace of mind, but also offers a robust combination of
              additional benefits, including:
            </p>
          </div>
          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-30">
              {featureCard.map((item, index) => {
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
            title="Need help selecting the perfect VPS configuration?"
            link="https://internetport.se/en/kontakta-oss"
            linkLabel="Get expert guidance"
            paddingBottom="pb-0"
          />
        </div>
      </div>
    </div>
  );
}
