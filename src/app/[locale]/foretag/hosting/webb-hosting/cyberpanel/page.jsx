'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import FaqSection from '@/components/FaqSection';
import StorageCard from '@/components/StorageCard';
import Image from 'next/image';
import { cyberCardData, CyberPanelFaq } from '@/components/cyberpanel/cyberPanelData';

export default function CyberPanelPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="webbhotell-kontrollpanel-dashboard"
        imageSrc="https://internetportcom.b-cdn.net/se/img/webbhotell-kontrollpanel-dashboard.jpg"
        titlePart1="Cyber Panel"
        desc="Visibility, resilience, and response—your complete cyber defense architecture."
        link="https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0"
        linkLabel="Explore Plans"
        objectfit="w-full h-full object-cover lg:object-fill"
      />
      <div className="bg-surfaceSecondary">
        <div className="pe-4">
          <ContentBlock
            title="WordPress Staging"
            desc="Avoid unnecessary risks associated with testing on your live site. Experiment, test and change things on staging before pushing it live."
            imageUrl="https://internetportcom.b-cdn.net/se/img/cyberpanel-wordpress-hantering.jpg"
            alt="cyberpanel-wordpress-hantering"
            padd="pt-24 pb-[60px]"
            mainTitle="The Ultimate Web Hosting Control Panel"
            mainDesc="Powered by LiteSpeed, CyberPanel empowers users to perform tasks in a faster, more secure and efficient way."
          />
        </div>
      </div>
      <div className="ps-4">
        <ContentBlock
          title="Intuitive Setup"
          desc="Server management is easy and effortless. By utilizing OpenLiteSpeed for the webserver, you have access to all the LiteSpeed features."
          imageUrl="https://internetportcom.b-cdn.net/se/img/cyberpanel-skapa-doman-webbhotell.jpg"
          alt="cyberpanel-skapa-doman-webbhotell"
          directionReverse="true"
        />
      </div>
      <div className="lg:bg-secondary text-primary relative pb-[30px] lg:pb-[90px] mb-[200px]">
        <div className="px-4 bg-secondary lg:bg-transparent sm:px-[50px] xl:px-[80px] xxl:px-[135px] pt-24 pb-[250px] md:pb-[450px] lg:pb-[80px] lg:py-24 mb-[96px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] justify-center">
            <div className="flex flex-col gap-30 justify-center">
              <h2 className="text-[32px] font-bold">Web Based Terminal & Command Line Interface</h2>
              <p className="text-lg font-normal">
                For those that like to work in a terminal, the CyberPanel affords you the luxury of
                a command line interface. That allows you to replicate the work you do in the
                control panel via CLI. With Web Based Terminal, you can access your VPS SSH server
                and perform tasks from your browser with ease.
              </p>
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
                  <h2 className="text-[32px] font-bold">Docker Manager</h2>
                  <p className="text-lg font-normal">
                    Docker manager simplifies Docker Container and image management. Search and pull
                    images from Docker Hub or create Containers from available/pulled images in a
                    few clicks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pe-4">
        <ContentBlock
          title="Embedded Security"
          desc="CyberPanel comes with SpamAssassin to stop email spam and a default FirewallD installation for a heightened sense of protection and security."
          imageUrl="https://internetportcom.b-cdn.net/se/img/cyberpanel-wordpress-hantering.jpg"
          alt="cyberpanel-wordpress-hantering"
          padd="pt-24 pb-[60px]"
        />
      </div>

      <div className="bg-secondary relative z-[0]">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[60px]">
            <h1 className="text-[32px] text-primary font-bold">Cyberpanel configurations</h1>
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
        faqs={CyberPanelFaq}
        image="https://internetportcom.b-cdn.net/se/img/vanliga-fragor-faq.jpg"
        alt="vanliga-fragor-faq"
      />
      <AdvisorContactCard
        title="If you are interested in Cyber Panel"
        desc="Get in touch with us for more information and let us help you."
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel="Talk to Our Team"
        gap="gap-[20]"
        marginBottom=" "
      />
    </div>
  );
}
