'use client';
import ContentBlock from '@/components/ContentBlock';
import FaqSection from '@/components/FaqSection';
import OfferCard from '@/components/OfferCard';
import BroadbandHeroSection from '@/sections/broadband-page/broadbandHeroSection';
import FeatureSection from '@/sections/FeatureSection';
import ForetagCompanyPartner from '@/sections/foretag-page/ForetagCompanyPartner';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { title } from 'process';

export default function BroadbandPage() {
  const t = useTranslations('header');

  const features = [
    {
      name: 'Lorem Ipsum',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
      href: '/bredband',
      icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.33333 34.9999C7.41667 34.9999 6.63222 34.6738 5.98 34.0216C5.32778 33.3694 5.00111 32.5844 5 31.6666V24.9999C5 24.0833 5.32667 23.2988 5.98 22.6466C6.63333 21.9944 7.41778 21.6677 8.33333 21.6666H25V16.6666C25 16.1944 25.16 15.7988 25.48 15.4799C25.8 15.161 26.1956 15.001 26.6667 14.9999C27.1378 14.9988 27.5339 15.1588 27.855 15.4799C28.1761 15.801 28.3356 16.1966 28.3333 16.6666V21.6666H31.6667C32.5833 21.6666 33.3683 21.9933 34.0217 22.6466C34.675 23.2999 35.0011 24.0844 35 24.9999V31.6666C35 32.5833 34.6739 33.3683 34.0217 34.0216C33.3694 34.6749 32.5844 35.001 31.6667 34.9999H8.33333ZM11.6667 29.9999C12.1389 29.9999 12.535 29.8399 12.855 29.5199C13.175 29.1999 13.3344 28.8044 13.3333 28.3333C13.3322 27.8621 13.1722 27.4666 12.8533 27.1466C12.5344 26.8266 12.1389 26.6666 11.6667 26.6666C11.1944 26.6666 10.7989 26.8266 10.48 27.1466C10.1611 27.4666 10.0011 27.8621 10 28.3333C9.99889 28.8044 10.1589 29.2005 10.48 29.5216C10.8011 29.8427 11.1967 30.0021 11.6667 29.9999ZM17.5 29.9999C17.9722 29.9999 18.3683 29.8399 18.6883 29.5199C19.0083 29.1999 19.1678 28.8044 19.1667 28.3333C19.1656 27.8621 19.0056 27.4666 18.6867 27.1466C18.3678 26.8266 17.9722 26.6666 17.5 26.6666C17.0278 26.6666 16.6322 26.8266 16.3133 27.1466C15.9944 27.4666 15.8344 27.8621 15.8333 28.3333C15.8322 28.8044 15.9922 29.2005 16.3133 29.5216C16.6344 29.8427 17.03 30.0021 17.5 29.9999ZM23.3333 29.9999C23.8056 29.9999 24.2017 29.8399 24.5217 29.5199C24.8417 29.1999 25.0011 28.8044 25 28.3333C24.9989 27.8621 24.8389 27.4666 24.52 27.1466C24.2011 26.8266 23.8056 26.6666 23.3333 26.6666C22.8611 26.6666 22.4656 26.8266 22.1467 27.1466C21.8278 27.4666 21.6678 27.8621 21.6667 28.3333C21.6656 28.8044 21.8256 29.2005 22.1467 29.5216C22.4678 29.8427 22.8633 30.0021 23.3333 29.9999ZM26.6667 12.4999C26.3611 12.4999 26.0833 12.5277 25.8333 12.5833C25.5833 12.6388 25.3333 12.7221 25.0833 12.8333C24.6389 13.0277 24.1878 13.111 23.73 13.0833C23.2722 13.0555 22.8761 12.8749 22.5417 12.5416C22.2072 12.2083 22.0472 11.8055 22.0617 11.3333C22.0761 10.861 22.2778 10.5138 22.6667 10.2916C23.25 9.93047 23.8822 9.6527 24.5633 9.45825C25.2444 9.26381 25.9456 9.16658 26.6667 9.16658C27.4167 9.16658 28.125 9.26381 28.7917 9.45825C29.4583 9.6527 30.0833 9.93047 30.6667 10.2916C31.0556 10.5138 31.2572 10.861 31.2717 11.3333C31.2861 11.8055 31.1261 12.2083 30.7917 12.5416C30.4572 12.8749 30.0544 13.0555 29.5833 13.0833C29.1122 13.111 28.6539 13.0277 28.2083 12.8333C27.9861 12.7221 27.7433 12.6388 27.48 12.5833C27.2167 12.5277 26.9456 12.4999 26.6667 12.4999ZM26.6667 6.66659C25.5833 6.66659 24.5489 6.82659 23.5633 7.14659C22.5778 7.46659 21.6678 7.93159 20.8333 8.54158C20.4444 8.81936 20.0206 8.94436 19.5617 8.91658C19.1028 8.88881 18.7211 8.72214 18.4167 8.41659C18.0833 8.08325 17.9167 7.69436 17.9167 7.24992C17.9167 6.80547 18.0972 6.44436 18.4583 6.16659C19.5972 5.2777 20.8611 4.58325 22.25 4.08325C23.6389 3.58325 25.1111 3.33325 26.6667 3.33325C28.2222 3.33325 29.6944 3.58325 31.0833 4.08325C32.4722 4.58325 33.7361 5.2777 34.875 6.16659C35.2361 6.44436 35.4167 6.80547 35.4167 7.24992C35.4167 7.69436 35.25 8.08325 34.9167 8.41659C34.6111 8.72214 34.2289 8.88881 33.77 8.91658C33.3111 8.94436 32.8878 8.81936 32.5 8.54158C31.6667 7.93047 30.7567 7.46547 29.77 7.14659C28.7833 6.8277 27.7489 6.6677 26.6667 6.66659Z" fill="#BE1823"/>
    </svg>
    `,
      linkLabel: 'Discover offer',
    },
    {
      name: 'Lorem Ipsum',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
      href: '/telefoni',
      icon: ` <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4874_974)">
            <path d="M32.8906 24.6875H32.4889C31.5105 21.9215 28.86 20 25.8594 20C22.8393 20 20.1751 21.9466 19.2115 24.7402C16.7395 25.0743 14.7517 26.9569 14.2585 29.375H14.1406C11.5554 29.375 9.45312 31.4773 9.45312 34.0625C9.45312 36.6477 11.5554 38.75 14.1406 38.75H32.8906C36.7679 38.75 40 35.596 40 31.7188C40 27.8415 36.7679 24.6875 32.8906 24.6875ZM30.5469 1.25H0V10.625H30.5469V1.25ZM7.10938 8.28125H4.76562V5.9375H7.10938V8.28125ZM11.7969 8.28125H9.45312V5.9375H11.7969V8.28125ZM16.4844 8.28125H14.1406V5.9375H16.4844V8.28125ZM25.8594 17.6562C27.5432 17.6562 29.151 18.1124 30.5469 18.9202V12.9688H0V20H19.6855C21.3588 18.5317 23.5296 17.6562 25.8594 17.6562ZM7.10938 17.6562H4.76562V15.3125H7.10938V17.6562ZM11.7969 17.6562H9.45312V15.3125H11.7969V17.6562ZM16.4844 17.6562H14.1406V15.3125H16.4844V17.6562ZM12.4984 27.2247C13.4494 25.0789 15.285 23.4309 17.5326 22.7226C17.6011 22.5902 17.6887 22.472 17.763 22.3438H0V31.7188H7.51266C8.30117 29.4955 10.1768 27.7823 12.4984 27.2247ZM9.45312 24.6875H11.7969V27.0312H9.45312V24.6875ZM7.10938 27.0312H4.76562V24.6875H7.10938V27.0312Z" fill="#BE1823"/>
            </g>
            <defs>
            <clipPath id="clip0_4874_974">
            <rect width="40" height="40" fill="white"/>
            </clipPath>
            </defs>
            </svg>
    `,
      linkLabel: 'Discover offer',
    },
    {
      name: 'Lorem Ipsum',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
      href: '/tv',
      icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4874_1861)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M24.2355 6.06236C23.8404 7.7947 23.5951 9.83681 23.5517 12.0402H30.9819C30.9386 9.83689 30.6933 7.79478 30.2982 6.06236C28.3012 6.34931 26.2325 6.34931 24.2355 6.06236ZM19.5183 29.8649L22.4526 28.1654C23.3676 27.6356 24.441 27.6841 25.3044 28.2943L30.183 31.743C31.3195 32.5464 31.5664 34.1066 30.7333 35.2215C29.9 36.3369 29.0515 37.323 27.7587 38.5869C27.2929 39.0424 26.6836 39.2211 26.0456 39.0892C15.1616 36.8355 3.17514 24.8488 0.921235 13.9649C0.789126 13.3267 0.967797 12.7177 1.42327 12.2517C2.68733 10.9589 3.67334 10.1105 4.78873 9.27705C5.90381 8.444 7.46389 8.69087 8.26725 9.82744L11.7159 14.706C12.3263 15.5694 12.3748 16.6427 11.845 17.5577L10.1455 20.4921C12.6019 23.902 16.1084 27.4085 19.5183 29.8649ZM34.5923 22.0906C33.5511 21.6146 32.4471 21.2685 31.328 21.0309C30.9904 22.1724 30.5317 23.3552 29.8542 24.3356C31.612 23.945 33.2232 23.165 34.5923 22.0906ZM24.6794 24.3356C24.0019 23.3552 23.5431 22.1724 23.2056 21.0309C22.0864 21.2686 20.9827 21.6147 19.9413 22.0906C21.3105 23.1649 22.9216 23.945 24.6794 24.3356ZM18.8074 21.0774C20.0797 20.4303 21.4601 19.9735 22.8537 19.6724C22.4428 17.8509 22.1887 15.7245 22.1453 13.4466H15.4125C15.5858 16.4143 16.8488 19.0894 18.8074 21.0774ZM15.4125 12.0402H22.1453C22.1888 9.76244 22.443 7.63627 22.8537 5.81462C21.4601 5.51353 20.0795 5.05673 18.8074 4.40962C16.849 6.39751 15.5858 9.07244 15.4125 12.0402ZM19.9413 3.39642C21.3105 2.32205 22.9216 1.54205 24.6794 1.15142C24.0019 2.13173 23.5431 3.31462 23.2056 4.45619C22.0864 4.21845 20.9827 3.87236 19.9413 3.39642ZM29.8542 1.15142C30.5317 2.13181 30.9905 3.31462 31.328 4.45619C32.4468 4.21892 33.5515 3.87212 34.5922 3.3965C33.2232 2.32205 31.612 1.54205 29.8542 1.15142ZM35.7262 4.40962C37.6847 6.39751 38.9478 9.07252 39.1212 12.0402H32.3883C32.3447 9.76244 32.0906 7.63619 31.6799 5.81462C33.0735 5.51345 34.454 5.05673 35.7262 4.40962ZM39.1212 13.4465C38.948 16.4144 37.6848 19.0895 35.7262 21.0774C34.4538 20.4302 33.0737 19.9736 31.6799 19.6724C32.0907 17.8509 32.3447 15.7245 32.3883 13.4466L39.1212 13.4465ZM29.936 20.7912C28.1797 20.5567 26.354 20.5567 24.5976 20.7912C24.9392 21.9068 25.9176 24.6185 27.2669 24.6185C28.6163 24.6185 29.5945 21.9069 29.936 20.7912ZM24.2355 19.4246C26.2326 19.1377 28.301 19.1377 30.2983 19.4246C30.6933 17.6922 30.9387 15.6499 30.982 13.4464H23.5518C23.5949 15.6499 23.8402 17.6922 24.2355 19.4246ZM27.2669 0.86853C25.9176 0.86853 24.939 3.58017 24.5977 4.69572C26.354 4.93033 28.1797 4.93033 29.936 4.69572C29.5947 3.58017 28.6161 0.86853 27.2669 0.86853Z" fill="#BE1823"/>
</g>
<defs>
<clipPath id="clip0_4874_1861">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>

    `,
      linkLabel: 'Discover offer',
    },
    {
      name: 'Lorem Ipsum',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
      href: '/vpn',
      icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.27999 32H14.08L13.28 35.2H9.75999C8.79999 35.2 8.15999 35.84 8.15999 36.8C8.15999 37.6 8.79999 38.4 9.75999 38.4H30.24C31.2 38.4 31.84 37.6 31.84 36.8C31.84 35.84 31.2 35.2 30.24 35.2H26.88L26.08 32H34.88C37.28 32 39.36 29.92 39.36 27.52V6.24C39.36 3.84 37.28 1.76 34.88 1.76H5.27999C2.87999 1.6 0.799988 3.68 0.799988 6.08V27.36C0.799988 29.92 2.71999 32 5.27999 32ZM3.99999 6.08C3.99999 5.44 4.63999 4.8 5.27999 4.8H34.72C35.36 4.8 36 5.44 36 6.08V22.4H3.99999V6.08Z" fill="#BE1823"/>
<path d="M29.6 16.64C28.8 16.64 28.32 16.16 28 15.68C27.68 15.04 27.84 14.4 28.32 13.92L28.48 13.76C29.12 13.12 29.12 12.16 28.48 11.52L27.36 10.4C26.72 9.76 25.76 9.76 25.12 10.4L24.96 10.56C24.64 11.2 24 11.2 23.36 11.04H23.2C22.56 10.88 22.24 10.24 22.24 9.6V9.44C22.24 8.64 21.6 7.84 20.64 7.84H19.2C18.4 7.84 17.6 8.48 17.6 9.44V9.6C17.6 10.24 17.28 10.88 16.64 11.04H16.48C16 11.2 15.36 11.2 14.88 10.72V10.56C14.24 9.92 13.28 9.92 12.64 10.56L11.52 11.68C10.88 12.32 10.88 13.28 11.52 13.92L11.68 14.08C12.16 14.4 12.32 15.04 12 15.68C11.68 16.32 11.2 16.64 10.56 16.64H10.4C9.59999 16.64 8.79999 17.28 8.79999 18.24V19.2H15.2V19.04C15.2 16.32 17.28 14.24 20 14.24C22.72 14.24 24.8 16.32 24.8 19.04V19.2H31.2V18.24C31.2 17.44 30.4 16.64 29.6 16.64Z" fill="#BE1823"/>
</svg>
    `,
      linkLabel: 'Discover offer',
    },
  ];
  const faqData = [
    {
      question: 'Lorem Ipsum Dolor Sit Amet.',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
    },
    {
      question: 'Lorem Ipsum Dolor Sit Amet.',
      answer: 'Vivamus dictum velit at mauris feugiat, et aliquet ligula placerat.',
    },
    {
      question: 'Lorem Ipsum Dolor Sit Amet.',
      answer: 'Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
    },
    {
      question: 'Lorem Ipsum Dolor Sit Amet.',
      answer: 'Vestibulum non justo in elit tempus volutpat eu nec lectus.',
    },
  ];
  const ContentBox = {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
    link: '/',
    linkLabel: 'Lorem Ipsum',
    imageUrl: 'https://internetportcom.b-cdn.net/se/img/partnercompany.webp',
  };
  const ContentMap = {
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium.',
    link: '/',
    linkLabel: 'Lorem Ipsum',
    imageUrl: 'https://internetportcom.b-cdn.net/se/img/broadbandsix.webp',
  };

  return (
    <div className="w-full">
      <BroadbandHeroSection heroData="ddsf" />
      <ContentBlock
        title="Lorem ipsum dolor sit amet."
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium."
        link="/"
        linkLabel="Lorem Ipsum"
        imageUrl="https://internetportcom.b-cdn.net/se/img/broadbandtwo.webp"
        alt="broadbandtwo"
      />
      <OfferCard
        title="Current Offers"
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/kross-transparent-bakgrund.webp"
      />
      <FeatureSection powersection={true} />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 border border-solid border-l-0 border-r-0 border-borderGray">
          <div className="text-[32px] text-center font-bold mb-[60px] mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          <div className="mx-auto mt-[60px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="border rounded-lg shadow-sm bg-primary p-8">
                <div className="flex justify-between items-center mb-16">
                  <h2 className="text-2xl font-bold text-paraSecondary">Broadband Premium</h2>
                  <Link
                    href="/"
                    className="text-base font-semibold bg-lightgreen rounded-lg px-3 py-1 leading-[24px] text-primary uppercase inline-block"
                  >
                    Popular
                  </Link>
                </div>
                <p className="text-base font-regular text-paraSecondary mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo,
                  tincidunt fringilla suscipit vitae.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex text-accent items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                  </div>
                  <div className="flex text-accent items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                  </div>
                  <div className="flex text-accent items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                  </div>
                  <div className="flex text-accent items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg shadow-sm bg-primary p-8">
                <div className="flex justify-between items-center mb-16">
                  <h2 className="text-2xl font-bold text-paraSecondary">Broadband Base</h2>
                </div>
                <p className="text-base font-regular text-paraSecondary mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo,
                  tincidunt fringilla suscipit vitae.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex text-accent items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                  </div>
                  <div className="flex text-accent items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                  </div>
                  <div className="flex text-accent items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
                  </div>
                  <div className="flex text-accent items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-paraSecondary">Lorem ipsum dolor sit amet.</span>
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
      <ForetagCompanyPartner
        {...ContentBox}
        somestyle1="md:col-span-4"
        somestyle2="md:col-span-8"
      />
      <ForetagCompanyPartner
        {...ContentMap}
        somestyle1="md:col-span-6"
        somestyle2="md:col-span-6"
      />
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 border border-solid border-l-0 border-r-0 border-borderGray">
          <div className="text-[32px] text-center font-bold mb-[60px] mt-1">Read More</div>
          <div className="mx-auto mt-[60px] ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="borderbottomeffect">
                <div className="relative rounded-lg overflow-hidden h-full">
                  <span className="sr-only">kross-transparent-bakgrund</span>
                  <Image
                    alt="kross-transparent-bakgrund"
                    src="https://internetportcom.b-cdn.net/se/img/broadbandseven.webp"
                    className="w-full h-full"
                    width={1200}
                    height={600}
                    quality={100}
                    priority
                  />
                  <div className="absolute text-center text-xl  md:text-2xl font-bold text-primary bottom-[30px] left-1/2 -translate-x-1/2 w-[100%] z-[2]">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-secondary z-[0] opacity-[0.5]"></div>
                </div>
              </div>
              <div className="borderbottomeffect">
                <div className="relative rounded-lg overflow-hidden h-full">
                  <span className="sr-only">kross-transparent-bakgrund</span>
                  <Image
                    alt="kross-transparent-bakgrund"
                    src="https://internetportcom.b-cdn.net/se/img/broadbandeight.webp"
                    className="w-full h-full"
                    width={1200}
                    height={600}
                    quality={100}
                    priority
                  />
                  <div className="absolute text-center text-xl md:text-2xl font-bold text-primary bottom-[30px] left-1/2 -translate-x-1/2 w-[100%] z-[2]">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-secondary z-[0] opacity-[0.5]"></div>
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
      <FaqSection
        title="Lorem Ipsum Dolor Sit Amet."
        faqs={faqData}
        image="https://internetportcom.b-cdn.net/se/img/broadbandnine.webp"
      />
    </div>
  );
}
