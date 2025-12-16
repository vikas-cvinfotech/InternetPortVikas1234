'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Link from 'next/link';
import Image from 'next/image';
import OfferCard from '@/components/OfferCard';
import CallToAction from '@/components/CallToAction';
import { AddressSearchBox } from '@/components/AddressSearchBox';
import { DomainSearchBox } from '@/components/DomainSearchBox';

export default function DomainPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="person-sokfalt-url"
        imageSrc="https://internetportcom.b-cdn.net/se/img/person-sokfalt-url.png"
        titlePart1="Register Your Domain in Minutes"
        desc="From .se to .com – secure your perfect domain with instant activation and free DNS management."
        link="https://portal.internetport.com/cart/domains/"
        linkLabel="Search domains"
      />
      <ContentBlock
        imageUrl="https://internetportcom.b-cdn.net/se/img/doman-namnutrymmen.png"
        alt="doman-namnutrymmen"
        mainTitle="Get your dream domain"
        layoutSecond="true"
      />

      <div className="relative mt-[96px]">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-secondary translate-y-[-50px] lg:translate-y-[-90px] z-[2]"></div>

        {/* Foreground Content */}
        <div className="relative px-4 sm:px-6 lg:px-[50px] xl:px-[80px] xxl:px-[135px] z-10">
          <div className="-mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-primary p-5 lg:p-10 rounded-md shadow-sm gap-x-[60px] gap-y-8">
              <div className="relative mx-auto flex flex-col items-start justify-center gap-30">
                <h2 className="text-3xl md:text-[32px] font-bold text-secondary capitalize">
                  All features are available via API
                </h2>
                <p className="text-base text-paraSecondary">
                  Automate your DNS entry management to the max. All of DNS Console's features are
                  also available via our developer-friendly REST-API. Our detailed documentation
                  includes programming examples and helps you get started.
                </p>
                <Link
                  href="https://portal.internetport.com/userapi?bash#dns-91"
                  className="flex items-center gap-2  rounded-md border border-transparent bg-accent hover:bg-hoveraccent transition-colors duration-300 px-8 py-3 text-sm font-medium text-primary capitalize"
                >
                  API Docs
                </Link>
              </div>

              <div>
                <Image
                  alt="kvinna-programmerare-kod"
                  src="https://internetportcom.b-cdn.net/se/img/kvinna-programmerare-kod.png"
                  className="object-cover rounded-md h-full"
                  width={1220}
                  height={600}
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
          className="w-full h-[670px] object-cover"
          quality={100}
        />
        <div className="absolute inset-0 z-[1] flex justify-center items-center w-full">
          <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 pt-48">
            <div className="flex flex-col justify-center items-center gap-30">
              <h1 className="text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-secondary capitalize">Is your domain name available?</span>
              </h1>
              <p className="text-base text-paraSecondary">
                Check if your domain name is available. Just fill in your wanted domain below and
                click the button.
              </p>

              <div className="w-full max-w-md sm:max-w-lg relative">
                <DomainSearchBox btn_bg_color="red" />
              </div>
              <div className="mt-8 flex flex-col items-center gap-4 text-sm text-paraSecondary font-normal">
                <h4 className="font-semibold">Allocating terms</h4>
                <p className="mx-auto max-w-lg text-center sm:max-w-3xl">
                  The various top level domains (“domain suffixes”) are administered by a multitude
                  of different, mostly national, organizations. Each of the organizations which
                  allocate domains has different terms and conditions for the registration and
                  administration of top level domains, their respective sub level domains and the
                  procedures for domain disputes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
