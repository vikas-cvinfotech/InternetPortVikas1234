'use client';

import { useParams } from 'next/navigation';
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
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="server-hardiskar-narbild"
        imageSrc="https://internetportcom.b-cdn.net/se/img/server-hardiskar-narbild.png"
        titlePart1="Dedicated Server"
        desc="A dedicated server gives you, the customer the maximum force."
        link="https://portal.internetport.com/cart/dedicated-servers/"
        linkLabel="View Server Options"
      />
      <ContentBlock
        title="Dedicated server configurations"
        desc="We offer a number of dedicated server plans for you."
        desc1="You are free to choose any plan as per your requirement. Meanwhile, we add new features on a regular basis to our dedicated server to keep it upgraded to equip you in a better way to face the heat of the increased competition over the web. You are also free to customize your dedicated server to meet your specific needs in a hassle free manner"
        imageUrl="https://internetportcom.b-cdn.net/se/img/hand-fiberoptisk-kabel.png"
        alt="hand-fiberoptisk-kabel"
        padd="pt-24 pb-[60px]"
        mainTitle="Maximum force"
        mainDesc="Provider of Web Hosting, Cloud Vps, Dedicated Servers and many more solutions, we are a Swedish Company in operation since 2008."
      />
      <OfferCard
        title="Under the hood"
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-3"
        zIndex="z-[0]"
      />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
            <div className="flex flex-col gap-30">
              <h2 className="text-[32px] font-bold capitalize">
                There are many uses for a dedicated server
              </h2>
              <p className="text-base">
                A dedicated server gives you, the customer the maximum force. Internetport offers
                the most complete server solutions, this along with a technical support team
                consisting of senior engineers who are always available for you. Infrastructure is
                of the highest quality and strength, and all components in the network is monitored
                around the clock every day.
              </p>
              <p className="text-base">
                All our servers within Xeon supply has ilo4 interface so you can provision, reboot,
                debug, see the hardware status, etc. InternetPorts dedicated server customers have
                the opportunity to report errors and call for qualified technical expertise around
                the clock (24/7/365).
              </p>
            </div>
            <div className="relative z-[1]">
              <div className="borderbottomeffect ">
                <div className="flex flex-col border shadow-darkShadow rounded-lg px-6 py-12 bg-primary border-borderGray h-full">
                  {ServerUses &&
                    ServerUses.map((item, index) => {
                      return (
                        <dt
                          key={index}
                          className="text-base font-normal text-paraSecondary flex gap-4 mb-5"
                        >
                          <div className="rounded-md inline-flex items-center">{item.icon}</div>
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
                  Easy manage your server with our online control panel
                </h2>
                <p className="text-base text-paraSecondary">
                  Restart - Reinstall - Troubleshoot &rarr; Watch video here
                </p>
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
            title="Easy manage your server with our online control pane"
            link="https://internetport.se/en/kontakta-oss"
            linkLabel="Discuss Your Requirements"
            paddingBottom="pb-0"
            gap="gap-[20]"
          />
        </div>
      </div>
    </div>
  );
}
