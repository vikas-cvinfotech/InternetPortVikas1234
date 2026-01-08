'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import FaqSection from '@/components/FaqSection';
import StorageCard from '@/components/StorageCard';
import Image from 'next/image';
import { CyberPanelFaq, getCyberCardData } from '@/components/cyberpanel/cyberPanelData';

export default function CyberPanelPage() {
  const t = useTranslations('cyberPanel');
  const cyberCardData = getCyberCardData(t);

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="webbhotell-kontrollpanel-dashboard"
        imageSrc="https://internetportcom.b-cdn.net/se/img/webbhotell-kontrollpanel-dashboard.jpg"
        titlePart1={t('commonBanner.title')}
        desc={t('commonBanner.desc')}
        linkLabel={t('commonBanner.linkLabel')}
        link="https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0"
        objectfit="w-full h-full object-cover lg:object-fill"
      />
      <div className="bg-surfaceSecondary">
        <div className="pe-4">
          <ContentBlock
            title={t('contentBlocks.wpStaging.title')}
            desc={t('contentBlocks.wpStaging.desc')}
            imageUrl="https://internetportcom.b-cdn.net/se/img/cyberpanel-wordpress-hantering.jpg"
            alt="cyberpanel-wordpress-hantering"
            padd="pt-24 pb-[60px]"
            mainTitle={t('contentBlocks.ultimatePanel.mainTitle')}
            mainDesc={t('contentBlocks.ultimatePanel.mainDesc')}
          />
        </div>
      </div>
      <div className="ps-4">
        <ContentBlock
          title={t('contentBlocks.intuitiveSetup.title')}
          desc={t('contentBlocks.intuitiveSetup.desc')}
          imageUrl="https://internetportcom.b-cdn.net/se/img/cyberpanel-skapa-doman-webbhotell.jpg"
          alt="cyberpanel-skapa-doman-webbhotell"
          directionReverse="true"
        />
      </div>
      <div className="lg:bg-secondary text-primary relative pb-[30px] lg:pb-[90px] mb-[200px]">
        <div className="px-4 bg-secondary lg:bg-transparent sm:px-[50px] xl:px-[80px] xxl:px-[135px] pt-24 pb-[250px] md:pb-[450px] lg:pb-[80px] lg:py-24 mb-[96px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] justify-center">
            <div className="flex flex-col gap-30 justify-center">
              <h2 className="text-[32px] font-bold">{t('terminalSection.title')}</h2>
              <p className="text-lg font-normal">{t('terminalSection.desc')}</p>
            </div>
            <div className="relative z-[1]">
              <Image
                src="https://internetportcom.b-cdn.net/se/img/cyberpanel-kommandorad-interface.jpg"
                alt="cyberpanel-kommandorad-interface"
                width={680}
                height={380}
                className="w-full object-cover mb-4 rounded-2xl"
              />
            </div>
          </div>

          <div className="absolute bottom-[-200px]  lg:bottom-[-200px] left-0 right-0 px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] z-[1]">
            <div className="block flex flex-col md:flex-row items-start md:items-center justify-between gap-30 border shadow-darkShadow rounded-lg p-6 bg-primary border-borderGray h-full text-secondary">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] justify-center">
                <div>
                  <Image
                    src="https://internetportcom.b-cdn.net/se/img/cyberpanel-dashboard-funktioner.jpg"
                    alt="cyberpanel-dashboard-funktioner"
                    width={680}
                    height={380}
                    className="w-full object-cover mb-4"
                  />
                </div>

                <div className="flex flex-col gap-30 h-full justify-center">
                  <h2 className="text-[32px] font-bold">{t('dockerSection.title')}</h2>
                  <p className="text-base font-normal text-lightergray">
                    {t('dockerSection.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pe-4">
        <ContentBlock
          title={t('contentBlocks.security.title')}
          desc={t('contentBlocks.security.desc')}
          imageUrl="https://internetportcom.b-cdn.net/se/img/cyberpanel-brandvagg-sakerhet.jpg"
          alt="cyberpanel-brandvagg-sakerhet   "
          padd="pt-24 pb-[60px]"
        />
      </div>

      <div className="bg-secondary relative z-[0]">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[60px]">
            <h1 className="text-[32px] text-primary font-bold">
              {t('cyberPanelConfig.mainTitle')}
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-30 gap-y-16">
            {cyberCardData.map((data, index) => (
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
        faqs={CyberPanelFaq(t)}
        image="https://internetportcom.b-cdn.net/se/img/vanliga-fragor-faq.jpg"
        alt="vanliga-fragor-faq"
      />
      <AdvisorContactCard
        title={t('advisorContact.title')}
        desc={t('advisorContact.desc')}
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel={t('advisorContact.linkLabel')}
        gap="gap-[20]"
        marginBottom=" "
      />
    </div>
  );
}
