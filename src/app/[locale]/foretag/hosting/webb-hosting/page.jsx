'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Link from 'next/link';
import Image from 'next/image';
import OfferCard from '@/components/OfferCard';
import CallToAction from '@/components/CallToAction';
import AdvisorContactCard from '@/components/AdvisorContactCard';

export default function WebHostingPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="kvinna-webbhotell-arbete"
        imageSrc="https://internetportcom.b-cdn.net/se/img/kvinna-webbhotell-arbete.png"
        titlePart1="Web Hosting"
        desc="Host extensive websites and unlimited supplementary domains, aliases, and email accounts under one subscription."
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel="Buy Now"
      />
      <ContentBlock
        title="Carefree web hosting with Plesk"
        desc="Plesk is a popular web hosting control panel which offers next-level management of websites and domains from a single dashboard. We provide the latest stable version of Plesk on our cloud web hosting platform for customers to manage their online presence."
        imageUrl="https://internetportcom.b-cdn.net/se/img/plesk-kontrollpanel-skarmen.png"
        alt="plesk-kontrollpanel-skarmen"
        link="/"
        linkLabel="Configure Plesk"
      />
      <ContentBlock
        title="Take your hosting to the next level with Cyberpanel"
        desc="CyberPanel is a web hosting control panel powered by OpenLiteSpeed, with a lineup of notable features such as auto-backups, auto-SSL, FTP server, PHP management and more.
We offer VPS configurations with Cyberpanel preinstalled."
        imageUrl="https://internetportcom.b-cdn.net/se/img/kvinna-holografisk-ikon-badge.png"
        alt="kvinna-holografisk-ikon-badge"
        link="/"
        linkLabel="Read More"
        directionReverse="true"
      />
      <AdvisorContactCard
        title="Unsure which hosting solution fits your business?"
        link="https://internetport.se/en/kontakta-oss"
        linkLabel="Contact a business advisor"
      />
    </div>
  );
}
