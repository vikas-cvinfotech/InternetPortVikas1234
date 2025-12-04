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
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="server-rack-ljus"
        imageSrc="https://internetportcom.b-cdn.net/se/img/server-rack-ljus.png"
        titlePart1="Internet Exchange"
        desc="Use our DNS Console and API to view your DNS entries, add to them, edit them, or delete them. All completely free of cost."
        link="https://portal.internetport.com/cart/colocation/"
        linkLabel="Get Colocation"
      />
      <ContentBlock
        title="Internet Exchange"
        desc="Access on-demand Internet Exchanges locally and remotely"
        desc1="Internet Exchanges allow the distribution of data across a single point. Thus enabling public networks to interconnect directly, via the IX, rather than connect through expensive third-party networks."
        desc2="IX's provide a rich ecosystem of platforms and services. Facilitating mutual peering to enrich IP architectures and provide lower latencies for eyeball traffic."
        desc3="With a single Cloud Access Port, leverage multiple Internet Exchanges from a single location across all of EMEA"
        imageUrl="https://internetportcom.b-cdn.net/se/img/jorden-rymden-ljus.png"
        alt="jorden-rymden-ljus"
        padd="pt-24 pb-[60px]"
        link="https://internetport.se/en/kontakta-oss"
        linkLabel="Request Quote"
        mainTitle="IP CONNECTION IX"
        mainDesc="Provider of internet connection since 2008"
      />
      <OfferCard
        title="Why InternetPort IP CONNECTION IX?"
        offerData={internetExchangeFeatures}
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
          className="w-full h-full md:h-[400px] object-cover absolute md:relative"
          quality={100}
        />
        <div className="static pt-12 md:pt-0 md:absolute inset-0 z-[1] flex justify-center items-center w-full">
          <AdvisorContactCard
            title="Let us help you get started"
            desc="If you have colocation on interxion and want a primary or backup connection to the internet, we can offer it. We have connections with interxion with the capacity to offer 100/1000/10GB/40GB/100GB capacity at a good price! If you have your own ASN, we can offer free bgp, alternatively you can rent IP addresses from us."
            link="https://internetport.se/en/kontakta-oss"
            linkLabel="Request Quote"
            paddingBottom="pb-0"
            gap="gap-[20]"
          />
        </div>
      </div>
    </div>
  );
}
