'use client';

import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import AdvisorContactCard from '@/components/AdvisorContactCard';

export default function WebHostingPage() {
  const t = useTranslations('webhostingPage');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="kvinna-webbhotell-arbete"
        imageSrc="https://internetportcom.b-cdn.net/se/img/kvinna-webbhotell-arbete.png"
        titlePart1={t('commonBanner.titlePart1')}
        desc={t('commonBanner.description')}
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel={t('commonBanner.linkLabel')}
      />
      {/* Plesk Block */}
      <ContentBlock
        title={t('plesk.title')}
        desc={t('plesk.description')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/plesk-kontrollpanel-skarmen.png"
        alt="plesk-kontrollpanel-skarmen"
        link="/foretag/hosting/webb-hosting/konfigurera-plesk"
        linkLabel={t('plesk.linkLabel')}
        padd="pt-16 pb-16 lg:py-24"
      />

      {/* Cyberpanel Block */}
      <ContentBlock
        title={t('cyberpanel.title')}
        desc={t('cyberpanel.description')}
        imageUrl="https://internetportcom.b-cdn.net/se/img/kvinna-holografisk-ikon-badge.png"
        alt="kvinna-holografisk-ikon-badge"
        link="/foretag/hosting/webb-hosting/cyberpanel"
        linkLabel={t('cyberpanel.linkLabel')}
        directionReverse="true"
      />

      {/* Advisor Contact Card */}
      <AdvisorContactCard
        title={t('advisor.title')}
        link="https://internetport.se/en/kontakta-oss" // Du kan byta ut denna länk beroende på språk om det behövs
        linkLabel={t('advisor.linkLabel')}
        marginBottom=" "
      />
    </div>
  );
}
