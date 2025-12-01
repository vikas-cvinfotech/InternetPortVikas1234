'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Image from 'next/image';
import FeatureCard from '@/components/FeatureCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';

export default function NetworkToolPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');
  const NetworkFeatureCard = [
    {
      title: '100 MB file',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.99967 12.9792C9.88856 12.9792 9.7844 12.9619 9.68717 12.9275C9.58995 12.8931 9.49967 12.8339 9.41634 12.75L6.41634 9.75C6.24967 9.58333 6.16967 9.38889 6.17634 9.16667C6.18301 8.94445 6.26301 8.75 6.41634 8.58333C6.58301 8.41667 6.78106 8.33 7.01051 8.32333C7.23995 8.31667 7.43773 8.39639 7.60384 8.5625L9.16634 10.125V4.16667C9.16634 3.93056 9.24634 3.73278 9.40634 3.57334C9.56634 3.41389 9.76412 3.33389 9.99967 3.33333C10.2352 3.33278 10.4333 3.41278 10.5938 3.57334C10.7544 3.73389 10.8341 3.93167 10.833 4.16667V10.125L12.3955 8.5625C12.5622 8.39583 12.7602 8.31584 12.9897 8.3225C13.2191 8.32917 13.4169 8.41611 13.583 8.58333C13.7358 8.75 13.8158 8.94445 13.823 9.16667C13.8302 9.38889 13.7502 9.58333 13.583 9.75L10.583 12.75C10.4997 12.8333 10.4094 12.8925 10.3122 12.9275C10.215 12.9625 10.1108 12.9797 9.99967 12.9792ZM4.99967 16.6667C4.54134 16.6667 4.14912 16.5036 3.82301 16.1775C3.4969 15.8514 3.33356 15.4589 3.33301 15V13.3333C3.33301 13.0972 3.41301 12.8994 3.57301 12.74C3.73301 12.5806 3.93079 12.5006 4.16634 12.5C4.4019 12.4994 4.59995 12.5794 4.76051 12.74C4.92106 12.9006 5.00079 13.0983 4.99967 13.3333V15H14.9997V13.3333C14.9997 13.0972 15.0797 12.8994 15.2397 12.74C15.3997 12.5806 15.5975 12.5006 15.833 12.5C16.0686 12.4994 16.2666 12.5794 16.4272 12.74C16.5877 12.9006 16.6675 13.0983 16.6663 13.3333V15C16.6663 15.4583 16.5033 15.8508 16.1772 16.1775C15.8511 16.5042 15.4586 16.6672 14.9997 16.6667H4.99967Z"
            fill="#BE1823"
          />
        </svg>
      ),
    },
    {
      title: '1 GB file',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.99967 12.9792C9.88856 12.9792 9.7844 12.9619 9.68717 12.9275C9.58995 12.8931 9.49967 12.8339 9.41634 12.75L6.41634 9.75C6.24967 9.58333 6.16967 9.38889 6.17634 9.16667C6.18301 8.94445 6.26301 8.75 6.41634 8.58333C6.58301 8.41667 6.78106 8.33 7.01051 8.32333C7.23995 8.31667 7.43773 8.39639 7.60384 8.5625L9.16634 10.125V4.16667C9.16634 3.93056 9.24634 3.73278 9.40634 3.57334C9.56634 3.41389 9.76412 3.33389 9.99967 3.33333C10.2352 3.33278 10.4333 3.41278 10.5938 3.57334C10.7544 3.73389 10.8341 3.93167 10.833 4.16667V10.125L12.3955 8.5625C12.5622 8.39583 12.7602 8.31584 12.9897 8.3225C13.2191 8.32917 13.4169 8.41611 13.583 8.58333C13.7358 8.75 13.8158 8.94445 13.823 9.16667C13.8302 9.38889 13.7502 9.58333 13.583 9.75L10.583 12.75C10.4997 12.8333 10.4094 12.8925 10.3122 12.9275C10.215 12.9625 10.1108 12.9797 9.99967 12.9792ZM4.99967 16.6667C4.54134 16.6667 4.14912 16.5036 3.82301 16.1775C3.4969 15.8514 3.33356 15.4589 3.33301 15V13.3333C3.33301 13.0972 3.41301 12.8994 3.57301 12.74C3.73301 12.5806 3.93079 12.5006 4.16634 12.5C4.4019 12.4994 4.59995 12.5794 4.76051 12.74C4.92106 12.9006 5.00079 13.0983 4.99967 13.3333V15H14.9997V13.3333C14.9997 13.0972 15.0797 12.8994 15.2397 12.74C15.3997 12.5806 15.5975 12.5006 15.833 12.5C16.0686 12.4994 16.2666 12.5794 16.4272 12.74C16.5877 12.9006 16.6675 13.0983 16.6663 13.3333V15C16.6663 15.4583 16.5033 15.8508 16.1772 16.1775C15.8511 16.5042 15.4586 16.6672 14.9997 16.6667H4.99967Z"
            fill="#BE1823"
          />
        </svg>
      ),
    },
    {
      title: '10 GB file',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.99967 12.9792C9.88856 12.9792 9.7844 12.9619 9.68717 12.9275C9.58995 12.8931 9.49967 12.8339 9.41634 12.75L6.41634 9.75C6.24967 9.58333 6.16967 9.38889 6.17634 9.16667C6.18301 8.94445 6.26301 8.75 6.41634 8.58333C6.58301 8.41667 6.78106 8.33 7.01051 8.32333C7.23995 8.31667 7.43773 8.39639 7.60384 8.5625L9.16634 10.125V4.16667C9.16634 3.93056 9.24634 3.73278 9.40634 3.57334C9.56634 3.41389 9.76412 3.33389 9.99967 3.33333C10.2352 3.33278 10.4333 3.41278 10.5938 3.57334C10.7544 3.73389 10.8341 3.93167 10.833 4.16667V10.125L12.3955 8.5625C12.5622 8.39583 12.7602 8.31584 12.9897 8.3225C13.2191 8.32917 13.4169 8.41611 13.583 8.58333C13.7358 8.75 13.8158 8.94445 13.823 9.16667C13.8302 9.38889 13.7502 9.58333 13.583 9.75L10.583 12.75C10.4997 12.8333 10.4094 12.8925 10.3122 12.9275C10.215 12.9625 10.1108 12.9797 9.99967 12.9792ZM4.99967 16.6667C4.54134 16.6667 4.14912 16.5036 3.82301 16.1775C3.4969 15.8514 3.33356 15.4589 3.33301 15V13.3333C3.33301 13.0972 3.41301 12.8994 3.57301 12.74C3.73301 12.5806 3.93079 12.5006 4.16634 12.5C4.4019 12.4994 4.59995 12.5794 4.76051 12.74C4.92106 12.9006 5.00079 13.0983 4.99967 13.3333V15H14.9997V13.3333C14.9997 13.0972 15.0797 12.8994 15.2397 12.74C15.3997 12.5806 15.5975 12.5006 15.833 12.5C16.0686 12.4994 16.2666 12.5794 16.4272 12.74C16.5877 12.9006 16.6675 13.0983 16.6663 13.3333V15C16.6663 15.4583 16.5033 15.8508 16.1772 16.1775C15.8511 16.5042 15.4586 16.6672 14.9997 16.6667H4.99967Z"
            fill="#BE1823"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="tangentbord-narbild"
        imageSrc="https://internetportcom.b-cdn.net/se/img/tangentbord-narbild.png"
        titlePart1="Network Tools"
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna."
        link="https://portal.internetport.com/cart/anycastdns/"
        linkLabel="Get AnycastDNS"
      />
      <ContentBlock
        title="Network Info AS49770"
        desc="We provide a number of resources to test performance between our network and other points on the Internet. If you find a problem or feel performance is below expectations, please let us know, and we'll do our best to find and fix the issue. The ping and traceroute info follows below."
        imageUrl="https://internetportcom.b-cdn.net/se/img/tekniker-natverk-kablar.png"
        alt="tekniker-natverk-kablar"
      />

      <div className="relative mt-[96px]">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-secondary translate-y-[-50px] lg:translate-y-[-90px] z-[2]"></div>

        {/* Foreground Content */}
        <div className="relative px-4 sm:px-6 lg:px-[50px] xl:px-[80px] xxl:px-[135px] z-10">
          <div className="-mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-primary p-5 lg:p-10 rounded-md shadow-sm gap-x-[60px] gap-y-4">
              <div className="relative mx-auto flex flex-col items-start justify-center gap-30">
                <h2 className="text-3xl md:text-[32px] font-bold text-secondary capitalize">
                  Looking Glass Internetport
                </h2>
                <p className="text-base text-paraSecondary">
                  Our test files are served from 1000 Mbit/sec links. The files contain randomized
                  data to prevent compression and are large enough to prevent caching and allow the
                  transfer rate to settle. Please note that factors other than your Internet
                  connection may limit throughput, including conditions on your computer or server.
                  If your connection is faster than 50 Mbit/sec, we recommend testing with the 1 GB
                  file.
                </p>
              </div>

              <div>
                <Image
                  alt="falttekniker-laptop-server"
                  src="https://internetportcom.b-cdn.net/se/img/falttekniker-laptop-server.png"
                  className="object-cover rounded-md h-full"
                  width={646}
                  height={400}
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
          className="w-full h-[350px] object-cover"
          quality={100}
        />
        <div className="absolute inset-0 z-[1] flex justify-center items-center w-full">
          <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-30">
              {NetworkFeatureCard.map((item, index) => {
                return <FeatureCard key={index} {...item} paddX="5" />;
              })}
            </div>
          </div>
        </div>
      </div>
      <ContentBlock
        title="Test IPs"
        desc="The following IP addresses are located on Internetport´s public network and can be used for remote ping testing, traceroutes, and other network testing diagnostics."
        desc1="Internetport Datacenter Stockholm Sweden"
        desc3={`
            <ul class="list-disc ps-4 list-inside">
            <li>IPv4 – 95.143.192.1</li>
            <li>IPv4 – 185.154.110.1</li>
            <li>IPv6 – 2A03:D780::1</li>
            </ul>
        `}
        imageUrl="https://internetportcom.b-cdn.net/se/img/elektriker-sakringsskåp.png"
        alt="elektriker-sakringsskåp"
        directionReverse="true"
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
          <AdvisorContactCard
            title="Lorem ipsum dolor sit amet."
            desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna."
            link="https://internetport.se/en/kontakta-oss"
            linkLabel="Talk to Our Team"
            paddingBottom="pb-0"
            gap="gap-[20]"
          />
        </div>
      </div>
    </div>
  );
}
