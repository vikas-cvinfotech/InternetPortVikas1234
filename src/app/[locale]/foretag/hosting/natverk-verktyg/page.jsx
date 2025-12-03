'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Image from 'next/image';
import FeatureCard from '@/components/FeatureCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import { NetworkFeatureCard } from '@/components/network/networktoolData';

export default function NetworkToolPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="tangentbord-narbild"
        imageSrc="https://internetportcom.b-cdn.net/se/img/tangentbord-narbild.png"
        titlePart1="Network Tools"
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna."
        link="https://portal.internetport.com/cart/anycastdns/"
        linkLabel="Get AnycastDNS"
      />
      <ContentBlock
        title="Network Info AS49770"
        desc="We provide a number of resources to test performance between our network and other points on the Internet. If you find a problem or feel performance is below expectations, please let us know, and we'll do our best to find and fix the issue. The ping and traceroute info follows below."
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
                  Looking Glass Internetport
                </h2>
                <p className="text-base text-paraSecondary">
                  Our test files are served from 1000 Mbit/sec links. The files contain randomized
                  data to prevent compression and are large enough to prevent caching and allow the
                  transfer rate to settle. Please note that factors other than your Internet
                  connection may limit throughput, including conditions on your computer or server.
                  If your connection is faster than 50 Mbit/sec, we recommend testing with the 1 GB
                  file.
                </p>
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
          className="w-full h-[470px] md:h-[450px] lg:h-[350px] object-cover"
          quality={100}
        />
        <div className="absolute top-[150px] md:top-[50px] lg:top-0 inset-0 z-[1] flex justify-center items-center w-full">
          <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-30">
              {NetworkFeatureCard.map((item, index) => {
                return <FeatureCard key={index} {...item} paddX="5" />;
              })}
            </div>
          </div>
        </div>
      </div>
      <ContentBlock
        title="Test IPs"
        desc="The following IP addresses are located on Internetport´s public network and can be used for remote ping testing, traceroutes, and other network testing diagnostics."
        desc1="Internetport Datacenter Stockholm Sweden"
        desc3={`
            <ul class="list-disc ps-4 list-inside">
            <li>IPv4 – 95.143.192.1</li>
            <li>IPv4 – 185.154.110.1</li>
            <li>IPv6 – 2A03:D780::1</li>
            </ul>
        `}
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
            title="Lorem ipsum dolor sit amet."
            desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna."
            link="https://internetport.se/en/kontakta-oss"
            linkLabel="Talk to Our Team"
            paddingBottom="pb-0"
            gap="gap-[20]"
          />
        </div>
      </div>
    </div>
  );
}
