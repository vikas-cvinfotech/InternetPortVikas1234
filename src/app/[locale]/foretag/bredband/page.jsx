'use client';
import CallToAction from '@/components/CallToAction';
import ContentBlock from '@/components/ContentBlock';
import FaqSection from '@/components/FaqSection';
import OfferCard from '@/components/OfferCard';
import BroadbandHeroSection from '@/sections/broadband-page/broadbandHeroSection';
import FeatureSection from '@/sections/FeatureSection';
import ForetagCompanyPartner from '@/sections/foretag-page/ForetagCompanyPartner';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { features, faqData, ContentMap } from '@/components/broadband/broadbandData';
import { CheckMark } from '@/components/svgicon/SvgIcon';

export default function BroadbandPage() {
  const t = useTranslations('header');

  const list = (
    <ul className="list-disc ml-5 space-y-1 text-lightergray text-base mt-6">
      <li className="font-bold">
        Exceptional Network Reliability:{' '}
        <span className="font-normal text-paraSecondary">
          Experience uninterrupted connectivity backed by a robust and resilient network.
        </span>
      </li>
      <li className="font-bold">
        Rapid Deployment:{' '}
        <span className="font-normal text-paraSecondary">
          Get your business online faster with our streamlined and quick installation process.
        </span>
      </li>
      <li className="font-bold">
        Comprehensive Business Coverage:{' '}
        <span className="font-normal text-paraSecondary">
          We ensure your growing enterprise is connected wherever you operate.
        </span>
      </li>
    </ul>
  );

  return (
    <div className="w-full">
      <BroadbandHeroSection
        titlePart1="Broadband for"
        titlePart2="Business"
        subtitle="Fast, secure, and reliable connectivity designed to keep your business productive—whether it’s cloud tools, VoIP, video meetings, or large file transfers."
        imageSrc="https://internetportcom.b-cdn.net/se/img/broadbandnew.webp"
        imageAlt="Abstrakt bakgrundsbild för teknik och anslutning"
      />
      <ContentBlock
        title="Business Broadband Options to <br/> Maintain Your Company’s <br/> Connection"
        desc="Greetings from Internetport Broadband, the foundation of your company’s internet access. Every minute spent online counts in the modern digital environment. For everything from VoIP calls to cloud services, your company needs reliable, scalable, and quick internet. Stable connectivity is also necessary for massive file transfers and video conferences. That's precisely what we offer."
        // link="/"
        // linkLabel="Lorem Ipsum"
        imageUrl="https://internetportcom.b-cdn.net/se/img/team-mote-ovanifra%CC%8An.png"
        alt="broadbandtwo"
      />
      <OfferCard
        title="Current Offers"
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
        gridColClass="sm:grid-cols-2 xl:grid-cols-4"
        paddX=" "
      />
      <FeatureSection powersection={true} />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 border border-solid border-l-0 border-r-0 border-borderGray">
          <h2 className="text-[32px] text-center font-bold mb-[60px] mt-1">
            Want to see which plans align with Dedicated Capacity vs. <br /> Shared Connection?
          </h2>
          <div className="mx-auto mt-[60px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="borderbottomeffect">
                <div className="border rounded-lg shadow-sm bg-primary p-8 h-full">
                  <div className="flex justify-between items-center mb-16">
                    <h2 className="text-2xl font-bold text-paraSecondary">Broadband Premium</h2>
                    <Link
                      href="/"
                      className="text-base font-normal bg-lightgreen rounded-lg px-3 py-1 leading-[24px] text-primary capitalize inline-block"
                    >
                      Popular
                    </Link>
                  </div>
                  <p className="text-base font-regular text-paraSecondary mb-8">
                    This popular solution offers your business broadband via dedicated fiber with
                    guaranteed speeds of up to 10,000 Mbit/s.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">
                        Dedicated fiber that isolates your company's traffic.
                      </span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">
                        Guaranteed speeds of up to 10,000 Mbit/s. From 1,000 to 10,000 Mbit/s.
                        Equally high speed for upload and download.
                      </span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">
                        Guarantees uptime (SLA) of over 99.8%.
                      </span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">
                        Proactive monitoring and feedback. Possibility of 24/7 prioritized support.
                      </span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">
                        Provides business with dedicated fiber.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderbottomeffect">
                <div className="border rounded-lg shadow-sm bg-primary p-8 h-full">
                  <div className="flex justify-between items-center mb-16">
                    <h2 className="text-2xl font-bold text-paraSecondary">Broadband Base</h2>
                  </div>
                  <p className="text-base font-regular text-paraSecondary mb-8">
                    This solution provides your company with cost-effective broadband using shared
                    capacity in open networks. Speeds are not guaranteed and can vary depending on
                    the load on the network.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">Shared capacity in open networks.</span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">
                        Speeds vary depending on load. Performance is affected by the load on the
                        network. Varying speed depending on the number of connected users.
                      </span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">
                        "Best effort" without guaranteed uptime.
                      </span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">
                        Standard support during business hours with longer response times.
                      </span>
                    </div>
                    <div className="flex text-accent items-center gap-2">
                      <CheckMark />
                      <span className="text-paraSecondary">Cost-effective broadband.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100%] z-[-2]">
          <span className="sr-only">kross-transparent-bakgrund</span>
          <Image
            alt="kross-transparent-bakgrund"
            src="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
            className="w-full h-full"
            width={1200}
            height={600}
            quality={100}
            priority
          />
        </div>
      </div>
      <ContentBlock
        title="Strong Network Reliability and Wide Business Coverage"
        desc="Internetport Broadband provides the essential, reliable infrastructure you need to seamlessly connect your headquarters, remote teams, and branch locations across all our coverage zones."
        desc1={list}
        imageUrl="https://internetportcom.b-cdn.net/se/img/smart-stad-natverk-uppkoppling-natt.jpg"
        alt="smart-stad-natverk-uppkoppling-natt"
      />
      {/* <ForetagCompanyPartner
        {...ContentMap}
        somestyle1="md:col-span-6"
        somestyle2="md:col-span-6"
        gridJustifyCenter="h-full justify-center"
      /> */}

      <FaqSection
        title="Frequently asked questions"
        faqs={faqData}
        image="https://internetportcom.b-cdn.net/se/img/man-telefon-headset.png"
        alt="man-telefon-headset"
        link="/kunskapsbas"
        linkLabel="Browse Knowledge Base"
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
          <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
            <CallToAction
              title="Are You All Set to Connect?"
              desc="This is where fast, dependable broadband begins. Select the plan that best suits your company, review your coverage, and go online quickly."
              link="/address-sok-bredband"
              linkLabel="Get Business Broadband"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
