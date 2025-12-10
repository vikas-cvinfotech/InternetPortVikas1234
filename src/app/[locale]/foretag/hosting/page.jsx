'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Link from 'next/link';
import Image from 'next/image';
import OfferCard from '@/components/OfferCard';
import CallToAction from '@/components/CallToAction';
import { features } from '@/components/hosting/hostingData';

export default function HostingPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="kvinna-telefon-skrivbord"
        imageSrc="https://internetportcom.b-cdn.net/se/img/server-datacenter-bla.png"
        titlePart1="Easy And Flexible Cloud Solutions"
        desc="Provider of Web Hosting, Cloud Vps, Dedicated Servers and many more solutions, Internetport are a Swedish Company in operation since 2008."
        link="https://portal.internetport.com/products"
        linkLabel="View Hosting Solutions"
      />
      <ContentBlock
        title=""
        desc="Because a VPS shares finite resources with other virtual instances on the parent, overuse of a VPS can lead to less than optimal performance for any resource-intensive applications, which is why dedicated servers often outperform virtual private servers"
        desc1="VPS and dedicated servers both provide isolated environments, customization, and control. A VPS partitions a physical server into multiple virtual servers, sharing hardware but offering dedicated resources, making it cost-effective and easily scalable. In contrast, a dedicated server offers exclusive use of an entire physical server, ensuring maximum performance and security for high-traffic sites. While VPS is suitable for medium-sized needs, dedicated servers excel in demanding applications despite higher costs."
        imageUrl="https://internetportcom.b-cdn.net/se/img/kvinna-surfplatta-serverrum.png"
        alt="kvinna-telefon-skrivbord-glad"
        padd="pt-24 pb-[60px]"
        mainTitle="VPS or Dedicated server?"
        mainDesc="The difference between a virtual private server (VPS) and a dedicated server is that a VPS is an emulation of a computer that lives within a parent server and shares resources with other virtual servers. A Dedicated Server is a stand-alone, physical server that does not share resources. "
      />
      <OfferCard offerData={features} gridColClass="sm:grid-cols-2 xl:grid-cols-2" border={false} />
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
            <div className="relative z-[1]">
              <div className="borderbottomeffect ">
                <div className="block flex-col border shadow-darkShadow rounded-lg p-6 bg-primary border-borderGray h-full">
                  <dt className="text-2xl/7 font-semibold text-secondary">
                    <div className="mb-7 rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.53 14.94C18.53 20.47 18.47 32.6467 18.47 38.2933L21.1167 36.7633C21.1167 34.35 21.1167 45.47 21.1767 13.41C21.1167 13.47 18.3534 15.06 18.53 14.94ZM20.47 24.3533L19.47 24.94C19.3534 25 19.1767 25 19.0567 24.8233C18.9967 24.7067 18.9967 24.53 19.1734 24.41L20.1734 23.8233C20.29 23.7633 20.4667 23.7633 20.5867 23.94C20.6467 24.06 20.6467 24.2367 20.47 24.3533ZM20.47 21.6467L19.47 22.2333C19.3534 22.2933 19.1767 22.2933 19.0567 22.1167C18.9967 22 18.9967 21.8233 19.1734 21.7033L20.1734 21.1167C20.29 21.0567 20.4667 21.0567 20.5867 21.2333C20.6467 21.4133 20.6467 21.5867 20.47 21.6467ZM20.47 19L19.47 19.5867C19.3534 19.6467 19.1767 19.6467 19.0567 19.47C18.9967 19.3533 18.9967 19.1767 19.1734 19.0567L20.1734 18.47C20.29 18.41 20.4667 18.41 20.5867 18.5867C20.6467 18.7067 20.6467 18.8833 20.47 19ZM20.5867 15.8833C20.6467 16 20.6467 16.1767 20.47 16.2967L19.47 16.8833C19.3534 16.9433 19.1767 16.9433 19.0567 16.7667C18.9967 16.65 18.9967 16.4733 19.1734 16.3533L20.1734 15.7667C20.3534 15.7067 20.53 15.7633 20.5867 15.8833Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M16.2934 30.2933L10.1167 26.7633V31.8233L16.2934 35.3533V30.2933ZM15.2934 33.1167C15.2334 33.2333 15.0567 33.2933 14.88 33.2333L11.2334 31.1167C11.1167 31.0567 11.0567 30.88 11.1167 30.7033C11.1767 30.5867 11.3534 30.5267 11.53 30.5867L15.1767 32.7033C15.3534 32.7633 15.41 32.94 15.2934 33.1167ZM15.2934 31.3533C15.2334 31.47 15.0567 31.53 14.88 31.47L11.2334 29.3533C11.1167 29.2933 11.0567 29.1167 11.1167 28.94C11.1767 28.8233 11.3534 28.7633 11.53 28.8233L15.1767 30.94C15.3534 31 15.41 31.1767 15.2934 31.3533Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M8.53003 32.8833L17.8834 38.2933L17.9434 14.94L8.5867 9.53L8.53003 32.8833ZM9.5867 26.2367C9.5867 26 9.82336 25.8833 10.0567 26L16.82 29.8833C16.9367 29.9433 16.9967 30.06 16.9967 30.12V35.8267C16.9967 36.0633 16.76 36.18 16.5267 36.0633L9.82336 32.1767C9.7067 32.1167 9.6467 32 9.6467 31.94L9.5867 26.2367Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M26.59 31.4133L28.1767 32.3533C28.1767 30.1767 28.2367 12.1167 28.2367 9C28.1767 8.94 26.53 8 26.65 8.06C26.6467 10.47 26.7067 -0.586664 26.59 31.4133Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M31.1767 6.94L22.1167 1.70667V3C22.1167 3.17666 22 3.29333 21.8234 3.29333C21.6467 3.29333 21.53 3.17666 21.53 3V1.70667L9.35336 8.76333H11.06C11.2367 8.76333 11.3534 8.88 11.3534 9.05666C11.3534 9.23333 11.2367 9.35 11.06 9.35H9.41336C10.8267 10.1733 17.65 14.1133 18.2967 14.4667L20.9434 12.9367L19.2367 11.9367C19.12 11.8767 19.06 11.76 19.06 11.7C19.06 11.5833 19.12 11.5233 19.1767 11.4633C28.8834 5.81666 25.53 7.75666 26.2934 7.34666C26.3534 7.28666 26.47 7.28666 26.5867 7.34666L28.5867 8.52333L31.1767 6.94Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M21.7067 33.94L26 31.41C26 28.9967 26 40.0567 26.06 8.05666C25.4134 8.41 28.3534 6.70333 19.8234 11.6467L21.53 12.6467C21.6467 12.7067 21.7067 12.8233 21.7067 12.8833C21.7634 15.0567 21.7634 5.11666 21.7067 33.94ZM23.47 31.0567C23.1167 31.2933 22.7067 31.1167 22.6467 30.5867C22.6467 30.1733 22.94 29.6467 23.2934 29.41C23.7067 29.1733 24.1167 29.35 24.1167 29.88C24.1167 30.2933 23.8234 30.8233 23.47 31.0567ZM22.59 11.94L24.7067 10.7033C24.8234 10.6433 25 10.6433 25.12 10.82C25.18 10.9367 25.18 11.1133 25.0034 11.2333L22.8867 12.47C22.77 12.53 22.5934 12.53 22.4734 12.3533C22.4134 12.2333 22.4134 12.0567 22.59 11.94ZM22.59 14.7633L24.7067 13.5267C24.8234 13.4667 25 13.4667 25.12 13.6433C25.18 13.76 25.18 13.9367 25.0034 14.0567L22.8867 15.2933C22.77 15.3533 22.5934 15.3533 22.4734 15.1767C22.4134 15.0567 22.4134 14.88 22.59 14.7633ZM22.59 17.5867L24.7067 16.35C24.8234 16.29 25 16.29 25.12 16.4667C25.18 16.5833 25.18 16.76 25.0034 16.88L22.8867 18.1167C22.77 18.1767 22.5934 18.1767 22.4734 18C22.4134 17.88 22.4134 17.7033 22.59 17.5867ZM22.59 20.41L24.7067 19.1733C24.8234 19.1133 25 19.1133 25.12 19.29C25.18 19.4067 25.18 19.5833 25.0034 19.7033L22.8867 20.94C22.77 21 22.5934 21 22.4734 20.8233C22.4134 20.7033 22.4134 20.5267 22.59 20.41Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M31.47 7.41333C31.41 7.47333 28.6467 9.06 28.8234 8.94333C28.8234 14.4733 28.7634 26.65 28.7634 32.2967L31.41 30.7667L31.47 7.41333ZM30.8234 18.3533L29.8234 18.94C29.7067 19 29.53 19 29.41 18.8233C29.35 18.7067 29.35 18.53 29.5267 18.41L30.5267 17.8233C30.6434 17.7633 30.82 17.7633 30.94 17.94C31 18.06 30.94 18.2367 30.8234 18.3533ZM30.8234 15.6467L29.8234 16.2333C29.7067 16.2933 29.53 16.2933 29.41 16.1167C29.35 16 29.35 15.8233 29.5267 15.7033L30.5267 15.1167C30.6434 15.0567 30.82 15.0567 30.94 15.2333C31 15.4133 30.94 15.5867 30.8234 15.6467ZM30.8234 13L29.8234 13.5867C29.7067 13.6467 29.53 13.6467 29.41 13.47C29.35 13.3533 29.35 13.1767 29.5267 13.0567L30.5267 12.47C30.6434 12.41 30.82 12.41 30.94 12.5867C31 12.7067 30.94 12.8833 30.8234 13ZM30.8234 10.2933L29.8234 10.88C29.7067 10.94 29.53 10.94 29.41 10.7633C29.35 10.6467 29.35 10.47 29.5267 10.35L30.5267 9.76333C30.6434 9.70333 30.82 9.70333 30.94 9.88C31 10.06 30.94 10.2367 30.8234 10.2933Z"
                          fill="#BE1823"
                        />
                      </svg>
                    </div>
                    <div>Colocation server</div>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base/7 text-secondary">
                    <p className="flex-auto">
                      Colocation is available in 2 datacenter Hudiksvall and Interxion Stockholm and
                      we are cooperating with Interxion in other locations all across World.
                    </p>

                    <div className="mt-6">
                      <Link
                        href="/"
                        className="text-base font-semibold text-accent hover:text-hoveraccent uppercase"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
          <hr className="w-full mt-24 mb-16 md:my-24 border-t border-b-1 border-b-secondaryBg " />
          <div className="flex flex-col  gap-30 justify-center items-center text-center">
            <h2 className="text-[32px] font-bold">Are you a website owner?</h2>
            <p className="text-lg font-bold">
              We provide the latest stable version of Plesk on our cloud web hosting platform for
              customers to manage their online presence.
            </p>
            <p className="text-lg font-normal leading-[3]">
              Secure your domains with free unlimited SSL Certificates from LetsEncrypt; managed and
              renewed via your Plesk Control Panel. All your data, including all databases, files
              and emails, are backed up on a daily basis.
            </p>
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
                    <h2 className="text-2xl/7 font-semibold text-secondary ">Web hosting</h2>
                    <p className="flex-auto">
                      Host extensive websites and unlimited supplementary domains, aliases, and
                      email accounts under one subscription.
                    </p>
                  </div>

                  <div className="">
                    <Link
                      href="/foretag/hosting/colocation-server"
                      className="text-base font-semibold text-accent hover:text-hoveraccent uppercase"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContentBlock
        title="Data center"
        desc="Our data center consists of two physically separate data halls, 150m2 and 400m2, fully equipped for operation of critical IT environments. The data halls are fully redundant and fault tolerant in terms of cooling systems, power supply and internet connections. We are certified according to PCI Data Security Standard (PCI DSS), which is required to handle secure card transactions. Today we host thousands of physical and virtual servers. We have 10Gbit bandwidth to the Internet and our telephony infrastructure is used every day to handle up to 50,000 calls."
        desc1="Our customers are located in Sweden and globally. They experience us as professional, service-oriented and close to hand. We strive for organic growth focusing on long-term customer relations."
        imageUrl="https://internetportcom.b-cdn.net/se/img/it-personal-serverrum.png"
        alt="it-personal-serverrum"
        padd="pt-24 pb-[60px]"
      />
      <div className="relative bg-secondary">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px]">
          <div className="bg-primary p-10 relative top-[98px] rounded-md z-[1]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col gap-60">
                <h2 className="text-[32px] font-bold text-secondary">What We Offer</h2>
                <div className="block flex flex-col md:flex-row items-start justify-between gap-30 rounded-lg">
                  <dt>
                    <div className="rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.12 25.145C17.12 25.41 16.945 25.585 16.68 25.585L13.505 25.32C13.24 25.32 13.065 25.055 13.15 24.88C13.15 24.615 13.415 24.44 13.59 24.44L16.765 24.705C17.03 24.705 17.205 24.97 17.12 25.145Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M37.675 6.70503L39.53 2.03003C39.62 1.76503 39.885 1.67503 40.06 1.76503C40.325 1.85503 40.415 2.12003 40.325 2.29503L38.56 7.06003C38.47 7.23503 38.205 7.41503 38.03 7.32503C37.765 7.23503 37.59 6.97003 37.675 6.70503Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M29.91 8.73503V4.50003C29.91 4.23503 30.085 4.06003 30.35 4.06003C30.615 4.06003 30.79 4.23503 30.79 4.50003V8.73503C30.79 9.00003 30.615 9.17503 30.35 9.17503C30.175 9.17503 29.91 9.00003 29.91 8.73503Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M20.38 13.06C20.205 12.885 20.29 12.62 20.47 12.44C20.645 12.265 20.91 12.35 21.09 12.53L22.945 15.09C23.12 15.265 23.035 15.53 22.855 15.71C22.68 15.885 22.415 15.8 22.235 15.62L20.38 13.06Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M49.41 16.59C45.705 18.71 45.705 18.795 45.53 18.795C45.09 18.795 44.91 18.175 45.265 18L48.885 15.88C49.06 15.79 49.415 15.79 49.505 16.055C49.765 16.235 49.675 16.5 49.41 16.59Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M43.325 10.145L46.5 6.17503C46.675 6.00003 46.94 5.91003 47.12 6.08503C47.295 6.26003 47.385 6.52503 47.21 6.70503C43.945 10.675 44.12 10.765 43.68 10.765C43.325 10.855 43.06 10.41 43.325 10.145Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M14.825 35.12C14.915 35.295 14.915 35.56 14.65 35.74L11.03 37.86C10.855 37.95 10.59 37.95 10.41 37.685C10.32 37.51 10.32 37.245 10.585 37.065L14.205 34.945C14.47 34.855 14.735 34.94 14.825 35.12Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M26.295 45.97C25.15 47.56 26.03 49.145 27.795 50.115C30.09 51.44 33.97 51.79 36.97 50.645C39.35 49.765 41.03 47.91 39.705 45.97C38.825 50.825 27.265 51.09 26.295 45.97Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M32.91 24.97C30.97 26.115 29.47 28.765 29.47 30.97C29.47 33.175 31.06 34.06 32.91 32.91C34.85 31.85 36.35 29.115 36.35 26.91C36.35 24.705 34.855 23.825 32.91 24.97Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M29.295 54.97C29.47 56.825 31.06 58.235 32.915 58.235C34.77 58.235 36.355 56.825 36.535 54.97C34.325 55.675 31.5 55.675 29.295 54.97Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M38.115 53.38C39.44 52.585 40.145 51.615 40.145 50.645V49.675L40.055 49.765C36.965 53.205 28.675 53.12 25.76 49.675V50.645C25.765 54.175 33.62 55.94 38.115 53.38Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M31.41 15.265C25.235 15.97 20.29 21.09 19.94 27.44C19.765 30.705 20.82 33.97 22.94 36.53C24.97 39 26.38 41.825 27 44.91C27.09 45.175 27.09 45.35 27.09 45.615C27.09 47.47 29.56 48.525 31.5 48.79C34.41 49.23 36.615 48.17 36.53 48.17C37.59 47.73 38.825 46.76 38.825 45.61C38.825 45.52 38.915 45.08 38.915 44.905C39.535 41.905 40.945 38.905 43.06 36.345C44.915 34.05 45.97 31.14 45.97 28.14C45.97 20.645 39.44 14.295 31.41 15.265ZM39.175 26.56C39 27.705 38.645 28.94 38.115 30.09L38.995 30.62L37.495 33.265L36.615 32.735C35.91 33.795 35.025 34.675 34.055 35.47V36.97L31.85 38.205V36.705C30.88 37.06 30.085 37.145 29.29 36.97L28.41 38.56L26.82 37.68L27.7 36.09C27.17 35.56 26.82 34.765 26.64 33.795L25.325 34.5V32.03L26.65 31.325C26.825 30.18 27.18 28.945 27.71 27.795L26.83 27.265L28.33 24.62L29.21 25.15C29.915 24.09 30.8 23.21 31.77 22.415V20.915L33.975 19.68V21.18C34.945 20.825 35.74 20.74 36.535 20.915L37.415 19.325L39.005 20.205L38.125 21.795C38.655 22.325 39.005 23.12 39.185 24.09L40.51 23.385V25.855L39.175 26.56Z"
                          fill="#BE1823"
                        />
                      </svg>
                    </div>
                  </dt>
                  <dd className="flex flex-auto items-center justify-between text-base/7 text-secondary">
                    <div className="flex flex-col gap-4">
                      <div className="text-2xl/7 font-semibold text-secondary">
                        Technical Excellence
                      </div>
                      <p className="flex-auto">
                        Our technical expertise, as well as wallet-friendly prices, influence our
                        clients in partnering with Internetport.
                      </p>
                    </div>
                  </dd>
                </div>
                <div className="block flex  flex-col md:flex-row items-start justify-between gap-30 rounded-lg">
                  <dt>
                    <div className="rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M30.5299 3.79502C29.5599 4.32502 28.6749 5.82502 28.6749 6.97002C28.6749 7.94002 29.2049 8.20502 30.0849 7.76502C31.0549 7.14502 31.9399 5.73502 31.9399 4.59002C31.8549 3.62002 31.3249 3.26502 30.5299 3.79502Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M45.0899 2.47002C44.0299 3.00002 43.2349 4.41002 43.2349 5.56002C43.2349 6.53002 43.7649 6.79502 44.6449 6.35502C45.6149 5.73502 46.4999 4.32502 46.4999 3.18002C46.4999 2.20502 45.8849 1.94002 45.0899 2.47002Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M31.8549 17.205C25.3249 21 19.9399 30.265 19.9399 37.94C19.9399 45.085 24.8799 48.35 31.4999 44.555C38.1149 40.76 43.4999 31.41 43.4999 23.82C43.4999 16.235 38.2049 13.59 31.8549 17.205ZM36.4399 31.675C35.2949 32.38 28.4999 36.265 27.0849 37.06C25.5849 37.94 24.3499 37.235 24.3499 35.47C24.3499 34.06 25.1449 32.38 26.2899 31.325V30.795C26.2899 28.675 27.7899 26.12 29.5549 25.15C30.9649 24.355 32.1149 24.62 32.6449 25.77C32.9999 25.33 33.5249 24.89 33.9699 24.625C35.2049 23.92 36.2649 24.27 36.6149 25.33C38.0249 24.625 39.1749 25.33 39.1749 27.005C39.0899 28.675 37.9399 30.795 36.4399 31.675Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M15.5299 19.145C14.5599 19.675 13.6749 21.175 13.6749 22.32C13.6749 23.2 14.2049 23.645 15.0849 23.115C16.1449 22.495 16.9399 21.085 16.9399 19.94C16.8549 18.88 16.3249 18.705 15.5299 19.145Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M20.1199 43.5L20.4749 43.675C19.7699 42.44 19.1499 40.41 19.0649 37.94C18.9749 30.085 24.5349 20.38 31.4199 16.41C33.1849 15.44 35.2999 14.645 37.2449 14.645C37.0699 14.555 35.9199 13.675 33.8899 13.675C26.0349 13.675 16.6849 25.85 16.6849 36C16.7649 39.62 17.9099 42.265 20.1199 43.5Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M9.17495 39.885C8.20495 40.415 7.31995 41.915 7.31995 43.06C7.31995 44.03 7.84995 44.295 8.72995 43.855C9.69995 43.325 10.5849 41.825 10.5849 40.68C10.5899 39.705 9.96995 39.44 9.17495 39.885Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M29.9999 55.94C30.9699 55.41 31.8549 53.91 31.8549 52.765C31.8549 51.795 31.3249 51.53 30.4449 51.97C29.4749 52.5 28.5899 54 28.5899 55.145C28.5899 56.115 29.1199 56.38 29.9999 55.94Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M16.0599 38.295C15.9699 37.94 15.9699 37.675 15.9699 37.325L11.3799 39.97C11.5549 40.41 11.4699 40.675 11.4699 40.94L16.0599 38.295Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M44.7349 40.325C45.7949 39.705 46.5899 38.295 46.5899 37.15C46.5899 36.18 45.9699 35.915 45.1799 36.355C44.2099 36.885 43.3249 38.385 43.3249 39.53C43.3249 40.59 43.9399 40.855 44.7349 40.325Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M48.5299 19.06L44.2049 21.53C44.2949 21.885 44.2949 22.15 44.2949 22.5L48.7049 19.94C48.6199 19.675 48.5299 19.41 48.5299 19.06Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M30.3549 51V46.06C30.0899 46.15 29.7349 46.325 29.4749 46.415V51.53C29.8249 51.265 30.0899 51.09 30.3549 51Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M43.1449 37.235L40.7649 35.91C40.5899 36.175 40.4999 36.44 40.3249 36.705L42.7049 38.115C42.9699 37.59 43.0599 37.41 43.1449 37.235Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M52.59 16.675C52.59 15.705 51.9699 15.44 51.1799 15.88C50.2099 16.41 49.3249 17.91 49.3249 19.055C49.3249 20.025 49.8549 20.29 50.7349 19.85C51.7949 19.235 52.68 17.825 52.59 16.675Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M20.7349 44.91L16.3249 52.585C16.5899 52.675 16.8549 52.76 17.0299 53.025L21.4399 45.35L20.7349 44.91Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M29.8249 8.73502V13.765C30.0899 13.675 30.4449 13.5 30.7049 13.41V8.29502C30.6199 8.38502 30.3549 8.64502 29.8249 8.73502Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M39.5299 14.91L43.8549 7.41002C43.3249 7.41002 43.1499 7.23502 43.0599 7.05502L38.8249 14.465L39.5299 14.91Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M16.8549 22.5L19.4149 23.91C19.5899 23.645 19.6799 23.38 19.8549 23.115L17.2949 21.705C17.1199 22.145 17.1199 22.235 16.8549 22.5Z"
                          fill="#BE1823"
                        />
                        <path
                          d="M14.8249 57.53C15.7949 57 16.6799 55.5 16.6799 54.355C16.6799 53.385 16.0599 53.12 15.2699 53.56C14.2999 54.09 13.4149 55.59 13.4149 56.735C13.4099 57.705 13.9399 58.06 14.8249 57.53Z"
                          fill="#BE1823"
                        />
                      </svg>
                    </div>
                  </dt>
                  <dd className="flex flex-auto items-center justify-between text-base/7 text-secondary">
                    <div className="flex flex-col gap-4">
                      <div className="text-2xl/7 font-semibold text-secondary">
                        Overall Supplier
                      </div>
                      <p className="flex-auto">
                        To live up to today's many requirements, we deliver everything from
                        customer-owned solutions to cloud services to components and organizations.
                      </p>
                    </div>
                  </dd>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <Image
                  src="https://internetportcom.b-cdn.net/se/img/it-tekniker-datacenter-surfplatta.png"
                  alt="it-tekniker-datacenter-surfplatta"
                  className="object-cover"
                  quality={100}
                  width={560}
                  height={456}
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
          className="w-full h-full object-cover absolute z-[0] lg:relative"
          quality={100}
        />
        <div className="relative lg:absolute inset-0 z-[1] flex justify-center items-center w-full">
          <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 pt-48">
            <CallToAction
              title="Faster. Stronger. Dedicated."
              desc="With a highly accomplished team of professionals, the brilliance of us at Internetport lies in delivering quality products at a reasonable price to our customers."
              link="/kontakta-oss"
              linkLabel="Get Expert Advice"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
