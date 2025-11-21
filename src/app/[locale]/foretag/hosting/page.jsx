'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Link from 'next/link';
import Image from 'next/image';
import FaqSection from '@/components/FaqSection';
import PriceTable from '@/components/PriceTable';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import OfferCard from '@/components/OfferCard';
import CallToAction from '@/components/CallToAction';

export default function HostingPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');
  const features = [
    {
      name: 'Dedicated Server',
      description: 'Dedicated space and resources for an optimal performance.',
      href: '/foretag/hosting/dedikerad-server',
      icon: ` <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26.94 12.1767C26.94 12 27.0566 11.8833 27.2333 11.8833H30.2333L20.5866 6.23667C20.5266 6.17667 20.41 6.17667 20.35 6.12V7.88333C20.35 8.06 20.2333 8.17667 20.0566 8.17667C19.88 8.17667 19.7633 8.06 19.7633 7.88333V6.12C19.7033 6.12 19.6466 6.18 19.5866 6.18L9.8233 11.8233H12.3533C12.53 11.8233 12.6466 11.94 12.6466 12.1167C12.6466 12.2933 12.53 12.41 12.3533 12.41H9.8233L19.41 18.1167C19.47 18.1767 19.5866 18.1767 19.7033 18.2333V15.7033C19.7033 15.5267 19.82 15.41 19.9966 15.41C20.1733 15.41 20.29 15.5267 20.29 15.7033V18.1733C20.35 18.1733 20.4066 18.1133 20.4666 18.1133L30.2333 12.47H27.2333C27.06 12.47 26.94 12.3533 26.94 12.1767Z" fill="#BE1823"/>
    <path d="M38.1766 11.8233L21.06 1.82333C20.53 1.53 19.59 1.53 19.06 1.82333L1.8233 11.8233C1.3533 12.06 1.40997 12.41 1.8233 12.6467C24.3533 25.7633 17.1166 21.53 18.94 22.5867C19.47 22.88 20.41 22.88 20.94 22.5867C44.53 8.94 36.41 13.6467 38.1766 12.6467C38.59 12.3533 38.6466 12.06 38.1766 11.8233ZM30.8233 12.8233L20.7633 18.59C20.2933 18.8267 19.5866 18.8833 19.1166 18.59L9.17664 12.8233C8.58997 12.47 8.64664 11.8833 9.17664 11.53L19.2366 5.76667C19.7066 5.53 20.4133 5.47333 20.8833 5.76667L30.8233 11.53C31.3533 11.8833 31.3533 12.53 30.8233 12.8233Z" fill="#BE1823"/>
    <path d="M29.1766 18.47L21.2366 23.06C21 23.1767 20.65 23.2967 20.2966 23.3533V27.7633C20.5333 27.7033 20.7666 27.6467 20.9433 27.5867C22.7066 26.5867 14.53 31.2933 38.18 17.6467C38.4166 17.53 38.5333 17.3533 38.5333 17.2333V13.1167C37.7633 13.59 41.2366 11.53 29.1766 18.47ZM29 21.53L22.94 25.06C22.88 25.06 22.8233 25.12 22.7633 25.12C22.6466 25.12 22.5866 25.06 22.5266 24.9433C22.4666 24.8267 22.4666 24.65 22.6433 24.53L28.7066 21C28.8233 20.94 29 20.94 29.12 21.1167C29.1766 21.2933 29.1166 21.47 29 21.53ZM32.7066 19.4133C32.3533 19.65 32.06 19.4133 32.06 19.06C32.06 18.7067 32.2966 18.2967 32.59 18.12C32.9433 17.8833 33.2366 18.12 33.2366 18.5333C33.2366 18.8233 33 19.2367 32.7066 19.4133ZM34.7633 18.2367C34.41 18.4733 34.1166 18.2367 34.1166 17.8833C34.1166 17.53 34.3533 17.12 34.6466 16.9433C35 16.7067 35.2933 16.9433 35.2933 17.3567C35.2933 17.6467 35.06 18.06 34.7633 18.2367ZM36.8233 17.06C36.47 17.2967 36.1766 17.06 36.1766 16.7067C36.1766 16.3533 36.4133 15.9433 36.7066 15.7667C37.06 15.53 37.3533 15.7667 37.3533 16.18C37.3533 16.47 37.1166 16.8833 36.8233 17.06Z" fill="#BE1823"/>
    <path d="M18.94 27.59C19.1766 27.7067 19.41 27.7667 19.7033 27.8267V23.4133C19.35 23.4133 18.94 23.2967 18.6433 23.12C18.5833 23.06 1.5833 13.18 1.52664 13.18V17.2967C1.52664 17.4133 1.6433 17.59 1.81997 17.71C3.52997 18.6467 -4.53003 13.94 18.94 27.59Z" fill="#BE1823"/>
    <path d="M20.94 33.1167C44.5866 19.47 36.41 24.1767 38.1766 23.1767C38.59 22.94 38.6466 22.6467 38.1766 22.3533L36.8233 21.59C36.7633 21.8267 36.5866 22.12 36.2366 22.3533L21.1166 31.1167C20.47 31.47 19.47 31.47 18.8233 31.1167L3.70664 22.3533C3.3533 22.1767 3.17664 21.8833 3.17664 21.59L1.8233 22.3533C1.40997 22.59 1.3533 22.94 1.8233 23.1767C3.58664 24.1767 -4.53003 19.47 18.94 33.1167C19.47 33.47 20.4133 33.47 20.94 33.1167Z" fill="#BE1823"/>
    <path d="M3.99997 21.8233L19.06 30.5867C19.53 30.88 20.2966 30.88 20.7666 30.5867L35.9433 21.8233C36.12 21.7067 36.2366 21.5867 36.2366 21.47V19.41C31.2966 22.2933 28.7666 23.7033 21.1766 28.1167C20.47 28.53 19.3533 28.53 18.59 28.1167C-1.82336 16.2367 5.23664 20.3533 3.70664 19.4133V21.4733C3.70664 21.59 3.8233 21.7067 3.99997 21.8233Z" fill="#BE1823"/>
    <path d="M1.46997 23.7067V27.8233C1.46997 27.94 1.58664 28.1167 1.7633 28.2367L18.88 38.1767C19.1166 38.2933 19.41 38.3533 19.7633 38.4133V34C19.35 34 18.94 33.8833 18.5866 33.7067C16.8833 32.6467 25 37.3533 1.46997 23.7067Z" fill="#BE1823"/>
    <path d="M38.1766 28.2367C38.4133 28.12 38.53 27.9433 38.53 27.8233V23.7067H38.47C36.7066 24.7067 44.88 20 21.2333 33.6467C20.9966 33.7633 20.7033 33.8833 20.41 33.94V38.35C20.5866 38.29 20.8233 38.2333 20.94 38.1733L38.1766 28.2367ZM36.7066 26.2933C37.06 26.0567 37.3533 26.2933 37.3533 26.7067C37.3533 27.06 37.1166 27.47 36.8233 27.6467C36.47 27.8833 36.1766 27.6467 36.1766 27.2933C36.1766 26.8833 36.4133 26.47 36.7066 26.2933ZM34.6466 27.47C35 27.2333 35.2933 27.47 35.2933 27.8833C35.2933 28.2367 35.0566 28.6467 34.7633 28.8233C34.41 29.06 34.1166 28.8233 34.1166 28.47C34.1166 28.06 34.3533 27.6467 34.6466 27.47ZM32.59 28.6467C32.9433 28.41 33.2366 28.6467 33.2366 29.06C33.2366 29.4133 33 29.8233 32.7066 30C32.3533 30.2367 32.06 30 32.06 29.6467C32.06 29.2367 32.2933 28.8233 32.59 28.6467ZM22.6466 35.2933L28.7066 31.7633C28.8233 31.7033 29 31.7033 29.12 31.88C29.18 31.9967 29.18 32.1733 29.0033 32.2933L22.9433 35.8233C22.8266 35.8833 22.65 35.8833 22.53 35.7067C22.4133 35.5867 22.47 35.41 22.6466 35.2933Z" fill="#BE1823"/>
    </svg>
    `,
      linkLabel: 'Learn more',
    },
    {
      name: 'VPS',
      description: 'All VPS have SSD storage and performance when you need it',
      href: '/foretag/hosting/virtuell-privat-server',
      icon: ` <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.2933 38.2367C15.2933 38.59 15.1767 38.65 14.8233 38.4733C14.41 38.2367 14.1167 37.65 14.1167 37.2367C14.1167 36.9433 14.2933 36.8233 14.5867 37C14.94 37.1767 15.2933 37.8233 15.2933 38.2367Z" fill="#BE1823"/>
        <path d="M15.8833 38.1167C15.7067 37.41 15.6467 37 14.9433 36.47L19.7667 33.5867C20.7067 33.0567 20.59 33.0567 20.65 33.0567C21.0033 33.0567 21.4133 33.5267 21.5333 33.94C21.5933 34.1167 21.71 34.5267 21.5333 34.7033C21.47 34.7633 15.94 38.1167 15.8833 38.1167Z" fill="#BE1823"/>
        <path d="M22.53 35.6467C22.2933 35.8233 21.8833 35.8233 21.47 35.5867H21.41L21.8233 35.35C22.2933 35.0567 22.2933 34.35 22.06 33.82C21.7667 32.9967 20.9433 32.29 20.2367 32.6433L19.7667 32.9367V32.7C19.7667 32.2867 19.8833 31.9367 20.2367 31.76C20.8833 31.4667 22.06 32.5833 22.3533 33.23C22.3533 33.23 22.3533 33.29 22.4133 33.29C22.94 34.1767 22.94 35.41 22.53 35.6467Z" fill="#BE1823"/>
        <path d="M22.2367 30.53V27.9433L24.12 26.8833V30.59C24.12 30.65 24.06 30.7667 23.8833 30.8267C23.2367 31.1767 22.2367 30.8233 22.2367 30.53Z" fill="#BE1823"/>
        <path d="M26.94 32.2933C26.94 32.7067 26.8233 33.0567 26.5267 33.1767L23.35 35.06C23.5867 33.8233 22.29 31.59 21.0567 31.1767L21.6433 30.8233C21.76 31 21.82 31.06 21.9367 31.1167C22.8767 31.8233 24.6433 31.41 24.6433 30.47V29.1167C25.6467 29.2367 26.94 30.8233 26.94 32.2933Z" fill="#BE1823"/>
        <path d="M32.8233 28.06L27.3533 31.2967C27.1767 30.71 26.8233 30.12 26.4133 29.65L31.8267 26.4133C32.4133 26.1167 33.2933 27.7633 32.8233 28.06Z" fill="#BE1823"/>
        <path d="M5.47001 14.47V10.8833L18.41 18.3533C18.6467 18.47 18.88 18.53 19.1167 18.59V22.4133C19 22.4133 18.88 22.3533 18.6467 22.2367C17.2933 21.4733 23.47 25 5.64668 14.7067C5.53001 14.7067 5.47001 14.59 5.47001 14.47Z" fill="#BE1823"/>
        <path d="M19.1167 24.7067V28.53C18.94 28.47 18.8233 28.47 18.6467 28.3533L5.70668 20.8833C5.53001 20.7667 5.47001 20.7067 5.47001 20.59V17C18.94 24.7633 18.41 24.47 18.47 24.47C18.6467 24.6467 18.94 24.7067 19.1167 24.7067Z" fill="#BE1823"/>
        <path d="M26.3533 9.70668H28.53C19.7067 14.7667 19.8233 14.7667 19.7633 14.7667V13.3533C19.7633 13.1767 19.6467 13.06 19.47 13.06C19.2933 13.06 19.1767 13.1767 19.1767 13.3533V14.8233C19.1167 14.8233 19.06 14.8233 19 14.7633L11.47 10.4133H13.2933C13.47 10.4133 13.5867 10.2967 13.5867 10.12C13.5867 9.94335 13.47 9.82668 13.2933 9.82668H11.53L20.2367 4.71001H20.2967V6.00001C20.2967 6.17668 20.4133 6.29335 20.59 6.29335C20.7667 6.29335 20.8833 6.17668 20.8833 6.00001V4.70668C20.9433 4.70668 20.9433 4.70668 21 4.76668L28.47 9.12001H26.2933C26.1167 9.12001 26 9.23668 26 9.41335C26.06 9.53001 26.1767 9.70668 26.3533 9.70668Z" fill="#BE1823"/>
        <path d="M34.2933 9.11668L21.2933 1.58668C20.88 1.35001 20.1767 1.35001 19.7633 1.58668L5.70335 9.76335C5.41001 9.94001 5.41001 10.1167 5.64335 10.2933C5.87668 10.47 4.29001 9.53001 18.7033 17.8833C19.1167 18.12 19.82 18.12 20.2333 17.8833C21.7033 17.06 14.9967 20.9433 34.2933 9.70668C34.5867 9.53001 34.6467 9.29335 34.2933 9.11668ZM29.1767 9.94001L20.0567 15.2367C19.7033 15.4733 19.0567 15.4733 18.7033 15.2367L10.7633 10.6467C10.5267 10.53 10.41 10.2933 10.41 10.1167C10.41 9.88001 10.5267 9.70335 10.7633 9.53001L19.88 4.23668C20.2333 4.00001 20.82 4.00001 21.2333 4.23668L29.2333 8.82668C29.7067 9.11668 29.7067 9.64668 29.1767 9.94001Z" fill="#BE1823"/>
        <path d="M20.53 24.47C20.2933 24.5867 20 24.7067 19.7067 24.7067V28.53C19.8833 28.53 20.06 28.47 20.2367 28.3533L34.2967 20.1767C34.4133 20.06 34.5333 20 34.5333 19.8833V16.2367C22.2933 23.47 20.59 24.47 20.53 24.47ZM27.1167 23.06L21.06 26.5867C20.8833 26.6467 20.7067 26.5867 20.6467 26.47C20.5867 26.3533 20.5867 26.1767 20.7633 26.0567L26.8233 22.5267C26.94 22.4667 27.1167 22.5267 27.2367 22.6433C27.2933 22.8233 27.2367 23 27.1167 23.06ZM29.06 22.1767C28.7067 22.3533 28.4733 22.1767 28.4733 21.8233C28.4733 21.53 28.71 21.1167 28.9433 21C29.2967 20.8233 29.53 21 29.53 21.3533C29.5867 21.6467 29.3533 22.06 29.06 22.1767ZM31.06 21.06C30.7667 21.2367 30.4733 21.06 30.4733 20.7067C30.4733 20.4133 30.71 20 30.9433 19.8233C31.2367 19.6467 31.53 19.8233 31.53 20.1767C31.5867 20.47 31.3533 20.8833 31.06 21.06ZM33.06 19.8833C32.7067 20.06 32.4733 19.8833 32.4733 19.53C32.4733 19.2367 32.71 18.8233 32.9433 18.6467C33.2967 18.47 33.53 18.6467 33.53 19C33.5867 19.3533 33.3533 19.7067 33.06 19.8833Z" fill="#BE1823"/>
        <path d="M34.2933 15.7633L20.2333 23.94C19.82 24.1767 19.1167 24.1767 18.7033 23.94C18.6433 23.94 17.7033 23.3533 5.70335 16.41C5.41001 16.2333 5.35001 16.0567 5.70335 15.88L6.11668 15.6433C7.35335 16.35 1.53001 12.9967 18.41 22.76C18.94 23.0533 19.8233 23.1133 20.41 22.82C20.7633 22.6433 24.41 20.5267 33.94 14.9967L34.3533 15.2333C34.6467 15.41 34.6467 15.5867 34.2933 15.7633Z" fill="#BE1823"/>
        <path d="M20.53 18.3533C20.2933 18.47 20 18.53 19.7067 18.59V22.4133C19.8833 22.4133 20 22.3533 20.1767 22.2967C20.4133 22.18 21.53 21.5333 34.3533 14.06C34.47 14 34.59 13.8833 34.59 13.7667V10.1767C16.2333 20.8233 22.06 17.47 20.53 18.3533ZM27.1167 16.94L21.06 20.47C20.8833 20.53 20.7067 20.47 20.6467 20.3533C20.5867 20.2367 20.5867 20.06 20.7633 19.94L26.8233 16.41C26.94 16.35 27.1167 16.35 27.2367 16.5267C27.2933 16.7067 27.2367 16.8833 27.1167 16.94ZM29.06 16.06C28.7067 16.2367 28.4733 16.06 28.4733 15.7067C28.4733 15.4133 28.71 15 28.9433 14.8233C29.2967 14.6467 29.53 14.8233 29.53 15.1767C29.5867 15.53 29.3533 15.94 29.06 16.06ZM31.06 14.8833C30.7067 15.06 30.4733 14.8833 30.4733 14.53C30.4733 14.2367 30.71 13.8233 30.9433 13.6467C31.2367 13.47 31.53 13.6467 31.53 14C31.5867 14.3533 31.3533 14.7633 31.06 14.8833ZM33.06 13.7633C32.7067 13.94 32.4733 13.7633 32.4733 13.41C32.4733 13.1167 32.71 12.7033 32.9433 12.5867C33.2967 12.41 33.53 12.5867 33.53 12.94C33.5867 13.2367 33.3533 13.5867 33.06 13.7633Z" fill="#BE1823"/>
        </svg>

    `,
      linkLabel: 'Learn more',
    },
  ];

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
      <OfferCard offerData={features} gridColClass="sm:grid-cols-2 xl:grid-cols-2" />
      <div className="bg-secondary text-primary relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 mb-[96px]">
          <div className="grid grid-cols-1 grid-cols-2 gap-30">
            <div className="flex flex-col gap-30">
              <h2 className="text-[32px]">Bring your own</h2>
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
          <hr className="w-full my-24 border-t border-b-1 border-b-secondaryBg " />
          <div className="flex flex-col  gap-30 justify-center items-center text-center">
            <h2 className="text-[32px]">Are you a website owner?</h2>
            <p className="text-lg font-bold">
              We provide the latest stable version of Plesk on our cloud web hosting platform for
              customers to manage their online presence.
            </p>
            <p className="text-lg font-normal">
              Secure your domains with free unlimited SSL Certificates from LetsEncrypt; managed and
              renewed via your Plesk Control Panel. All your data, including all databases, files
              and emails, are backed up on a daily basis.
            </p>
          </div>
          <div className="absolute bottom-[-70px] left-0 right-0 px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] z-[1]">
            <div className="borderbottomeffect">
              <div className="block flex items-center justify-between gap-30 border shadow-darkShadow rounded-lg p-6 bg-primary border-borderGray h-full">
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
                <dd className="flex flex-auto items-center justify-between text-base/7 text-secondary">
                  <div className="flex flex-col gap-4">
                    <div className="text-2xl/7 font-semibold text-secondary">Web hosting</div>
                    <p className="flex-auto">
                      Host extensive websites and unlimited supplementary domains, aliases, and
                      email accounts under one subscription.
                    </p>
                  </div>

                  <div className="">
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
      </div>
      <ContentBlock
        title="Data center"
        desc="Our data center consists of two physically separate data halls, 150m2 and 400m2, fully equipped for operation of critical IT environments. The data halls are fully redundant and fault tolerant in terms of cooling systems, power supply and internet connections. We are certified according to PCI Data Security Standard (PCI DSS), which is required to handle secure card transactions. Today we host thousands of physical and virtual servers. We have 10Gbit bandwidth to the Internet and our telephony infrastructure is used every day to handle up to 50,000 calls."
        desc1="Our customers are located in Sweden and globally. They experience us as professional, service-oriented and close to hand. We strive for organic growth focusing on long-term customer relations."
        imageUrl="https://internetportcom.b-cdn.net/se/img/it-personal-serverrum.png"
        alt="it-personal-serverrum"
        padd="pt-24 pb-[60px]"
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
              title="Faster. Stronger. Dedicated."
              desc="With a highly accomplished team of professionals, the brilliance of us at Internetport lies in delivering quality products at a reasonable price to our customers."
              link="/"
              linkLabel="Get Expert Advice"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
