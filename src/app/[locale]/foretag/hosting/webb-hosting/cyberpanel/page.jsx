'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import OfferCard from '@/components/OfferCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import FaqSection from '@/components/FaqSection';
import StorageCard from '@/components/StorageCard';
import { features, cardData, PleskFaq, featuresIncluded } from '@/components/plesk/PleskData';

export default function CyberPanelPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="home-cyberPanel"
        imageSrc="https://internetportcom.b-cdn.net/se/img/home-cyberPanel.png"
        titlePart1="Cyber Panel"
        desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text"
        link="https://portal.internetport.com/cart/virtuell-cyberpanel-vps/&step=0"
        linkLabel="Explore Plans"
      />
      <div className="bg-surfaceSecondary">
        <ContentBlock
          title="WordPress Staging"
          desc="Avoid unnecessary risks associated with testing on your live site. Experiment, test and change things on staging before pushing it live."
          imageUrl="https://internetportcom.b-cdn.net/se/img/hand-fiberoptisk-kabel.png"
          alt="hand-fiberoptisk-kabel"
          padd="pt-24 pb-[60px]"
          mainTitle="The Ultimate Web Hosting Control Panel"
          mainDesc="Powered by LiteSpeed, CyberPanel empowers users to perform tasks in a faster, more secure and efficient way."
        />
      </div>
      <ContentBlock
        title="Intuitive Setup"
        desc="Server management is easy and effortless. By utilizing OpenLiteSpeed for the webserver, you have access to all the LiteSpeed features."
        imageUrl="https://internetportcom.b-cdn.net/se/img/kvinna-holografisk-ikon-badge.png"
        alt="kvinna-holografisk-ikon-badge"
        directionReverse="true"
      />
      <div className="bg-secondary text-primary relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] pt-24 pb-[280px] md:py-24 mb-[96px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
            <div className="flex flex-col gap-30">
              <h2 className="text-[32px] font-bold">Bring your own</h2>
              <p className="text-lg font-bold">
                Colocation means that you rent space in our datacenter and place your own hardware
                here and make us of our expertise.
              </p>
              <p className="text-lg font-normal">
                You can connect your infrastructure directly to the public cloud with Internetport
                Cloud Connect, create a private network and connect to other Internetport services
                or connect to the internet with either our top-performing network or by bringing you
                current network provider.
              </p>
            </div>
            <div className="relative z-[1]">dgdsg</div>
          </div>

          <div className="absolute bottom-[-120px] lg:bottom-[-70px] left-0 right-0 px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] z-[1]">
            <div className="borderbottomeffect">
              <div className="block flex flex-col md:flex-row items-start md:items-center justify-between gap-30 border shadow-darkShadow rounded-lg p-6 bg-primary border-borderGray h-full">
                <dt className="text-2xl/7 font-semibold text-secondary">
                  <div className="rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.94 21.3533C10.88 21.2933 9.05664 20.2366 9.11664 20.2366C5.17664 21.2366 1.46997 26.9433 1.46997 31.3533C1.46997 33.1166 2.05664 34.47 3.11664 35.1166L3.93997 35.6466C3.2933 34.41 3.2333 32.7066 3.46997 31.2933C4.17664 27.3533 7.2933 22.7066 10.94 21.3533Z"
                        fill="#BE1823"
                      />
                      <path
                        d="M9.7633 36.2366L32.47 23.12C35.8233 21.18 38.53 16.4733 38.53 12.65C38.53 10.8866 37.9433 9.53331 36.8833 8.94331C36.47 8.64998 35.7066 8.47331 34.8833 8.58998C34.7066 8.58998 34.53 8.47331 34.53 8.29665C34.3533 3.58998 30.1766 3.29665 26.53 7.00331C26.4133 7.11998 26.1166 7.11998 26.06 6.88665C25.4733 5.47331 24.3533 4.59331 22.8233 4.47331C21.6466 4.41331 20.47 4.76665 19.1766 5.47331C13.7666 8.58998 10.2366 16.8233 11.94 21.2966C12 21.4133 12 21.59 11.7033 21.71C7.7633 23 4.7633 27.3533 4.11664 31.4133C3.3533 35.7666 5.8833 38.4733 9.7633 36.2366ZM28.06 10.4733V14.65L16 21.59V17.4133L28.06 10.4733ZM28.06 16.7066V20.8833L16 27.8833V23.7066L28.06 16.7066Z"
                        fill="#BE1823"
                      />
                      <path d="M35.06 7.88331V7.94331H35.1766L35.06 7.88331Z" fill="#BE1823" />
                      <path
                        d="M26.41 6.29331C27.7033 5.05665 29.47 3.93998 31.2333 3.87998L30.35 3.34998C29.29 2.70331 27.82 2.87998 26.2333 3.76331C25.82 3.99998 25.41 4.29331 24.9966 4.58665C25.53 4.99998 26.06 5.58665 26.41 6.29331Z"
                        fill="#BE1823"
                      />
                      <path
                        d="M18.8833 4.99998C20 4.35331 21.2966 3.88331 22.6466 3.88331L21.94 3.46998C20.5266 2.64665 18.7033 2.88331 16.7033 3.99998C11.35 7.05998 7.81997 15.1766 9.46664 19.7633L11.23 20.8233V20.7633C9.93997 15.59 13.8233 7.88331 18.8833 4.99998Z"
                        fill="#BE1823"
                      />
                      <path
                        d="M17.8233 18.53C17.8233 18.1166 18.1166 17.53 18.53 17.3533C18.8833 17.1766 19.1166 17.2933 19.1166 17.7066C19.1166 18.12 18.8233 18.7066 18.41 18.8833C18.06 19.06 17.8233 18.94 17.8233 18.53Z"
                        fill="#BE1823"
                      />
                      <path
                        d="M21.41 16.47C21.41 16.0566 21.7033 15.47 22.1166 15.2933C22.47 15.1166 22.7033 15.2333 22.7033 15.6466C22.7033 16.06 22.41 16.6466 21.9966 16.8233C21.6466 17 21.41 16.8233 21.41 16.47Z"
                        fill="#BE1823"
                      />
                      <path
                        d="M24.94 14.4133C24.94 14 25.2333 13.4133 25.6466 13.2366C26 13.06 26.2333 13.1766 26.2333 13.59C26.2333 14.0033 25.94 14.59 25.5266 14.7666C25.2366 14.94 24.94 14.7633 24.94 14.4133Z"
                        fill="#BE1823"
                      />
                      <path
                        d="M17.8233 24.7633C17.8233 24.35 18.1166 23.7633 18.53 23.5866C18.8833 23.41 19.1166 23.5266 19.1166 23.94C19.1166 24.94 17.8233 25.7633 17.8233 24.7633Z"
                        fill="#BE1823"
                      />
                      <path
                        d="M21.41 22.7066C21.41 22.2933 21.7033 21.7066 22.1166 21.53C22.47 21.3533 22.7033 21.47 22.7033 21.8833C22.7033 22.2966 22.41 22.8833 21.9966 23.06C21.6466 23.2366 21.41 23.1166 21.41 22.7066Z"
                        fill="#BE1823"
                      />
                      <path
                        d="M24.94 20.6466C24.94 20.2333 25.2333 19.6466 25.6466 19.47C26 19.2933 26.2333 19.41 26.2333 19.8233C26.2333 20.2366 25.94 20.8233 25.5266 21C25.2366 21.1766 24.94 21.06 24.94 20.6466Z"
                        fill="#BE1823"
                      />
                    </svg>
                  </div>
                </dt>
                <dd className="flex flex-col lg:flex-row flex-auto gap-y-5 items-start lg:items-center justify-between text-base/7 text-secondary">
                  <div className="flex flex-col gap-4">
                    <div className="text-2xl/7 font-semibold text-secondary">Web hosting</div>
                    <p className="flex-auto">
                      Host extensive websites and unlimited supplementary domains, aliases, and
                      email accounts under one subscription.
                    </p>
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] flex flex-col gap-30 py-24 mb-1">
        <div>
          <h2 className="text-2xl font-bold text-darkGray mb-4">Plesk Obsidian Features</h2>
          <p className="text-base text-lightergray">
            The complete set of tools to build, secure and run your website or applications.
          </p>
        </div>
        <div className="flex flex-col gap-30">
          {featuresIncluded &&
            featuresIncluded.map((item, index) => {
              const isStringIcon = typeof item.icon === 'string';
              const ComponentIcon = isStringIcon ? null : item.icon;
              return (
                <div key={index} className="flex items-start gap-8 rounded-lg bg-primary h-full">
                  <dt className="font-semibold">
                    <div className="rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                      {isStringIcon ? (
                        <div dangerouslySetInnerHTML={{ __html: item.icon }} />
                      ) : (
                        ComponentIcon && <ComponentIcon />
                      )}
                    </div>
                  </dt>
                  <dd className="flex flex-auto flex-col gap-2">
                    <h2 className="text-xl font-bold text-darkGray">{item.title}</h2>
                    <p className="text-base font-normal text-paraSecondary">{item.description}</p>
                  </dd>
                </div>
              );
            })}
        </div>
      </div>
      <div className="bg-secondary relative z-[0]">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
          <div className="text-center mb-[60px]">
            <h1 className="text-[32px] text-primary font-bold">Plesk configurations</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-30 gap-y-16">
            {cardData.map((data, index) => (
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
        faqs={PleskFaq}
        image="https://internetportcom.b-cdn.net/se/img/fragetecken-faq-support.png"
      />
      <AdvisorContactCard
        title="If you are interested in Plesk"
        desc="Get in touch with us for more information and let us help you."
        link="https://portal.internetport.com/cart/webbhotell/"
        linkLabel="Get started"
        gap="gap-[20]"
      />
    </div>
  );
}
