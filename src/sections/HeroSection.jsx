'use client';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/Container';
import { AddressSearchBox } from '@/components/AddressSearchBox';
import Image from 'next/image';
import { useState } from 'react';

export default function HeroSection() {
  const t = useTranslations('hero');
  const [isImageVisible, setIsImageVisible] = useState(true); // Add this state

  const handleClick = () => {
    setIsImageVisible(false);
    setTimeout(() => setIsImageVisible(true), 1000);
  };

  return (
    <div className="relative">
      <Container className="flex flex-col justify-center pt-5 pb-0 text-center sm:pt-20 sm:pb-0 lg:pt-16 relative">
        <div
          className="group flex flex-col justify-center relative z-[2] hover:cursor-pointer clickable-div"
          onClick={handleClick}
        >
          <h1 className="relative test-bg hover:cursor-pointer  mx-auto max-w-4xl font-display text-3xl font-semibold tracking-tight text-secondary xs:text-4xl sm:text-5xl md:text-6xl lg:text-[64px] capitalize">
            {t('hassleFree')}{' '}
            <span className="relative font-bold whitespace-nowrap bg-[radial-gradient(circle_at_center,_#BE1823_0%,_#F3404C_47.17%,_#9C1821_100%)] bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
              {t('connectivity')}
            </span>
            <br className="hidden lg:block" />
            <div className="flex justify-center gap-x-1 ">
              {t('forYourHome1')}{' '}
              {isImageVisible && (
                <div className="hidden md:block w-[85px] h-[64px] relative">
                  {/* image container toggles display */}
                  <div className="transition-all duration-500  absolute ">
                    <Image
                      alt="internetport-maskot"
                      src="https://internetportcom.b-cdn.net/se/img/internetport-maskot.webp"
                      width={85}
                      height={85}
                      className="transition-all duration-500 ease-in-out animate-doubleBounce"
                    />
                  </div>
                </div>
              )}{' '}
              {t('forYourHome2')}
            </div>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm tracking-tight text-secondary xs:text-base sm:mt-[30px] sm:text-base lg:text-lg ">
            {t('enjoyText')} <b className="font-semibold">{t('fastReliableBroadband')}</b>.{' '}
            {t('customizedForYourHome')} <br className="hidden lg:block" />
            <b className="font-semibold">{t('totalFlexibility')}</b>.
          </p>

          {/* Integrated Email Signup and Reviews Section */}
          <div className="mt-8 flex justify-center sm:mt-8 lg:mt-10">
            <div className="w-full max-w-md sm:max-w-lg">
              {/* Use the new AddressSearchBox component */}
              <AddressSearchBox />

              {/* 5-Star Reviews */}
              <div className="mt-6">
                <div className="inline-flex items-center gap-1 lg:flex-row divide-x divide-divider !divide-[#B0B0B0]">
                  <div className="flex shrink-0 pr-3 xs:pr-3 sm:pr-5">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 6.41731C19.5333 6.41731 20 6.61731 20.4 7.01731C20.8 7.41731 21 7.88398 21 8.41731V10.4173C21 10.534 20.9875 10.659 20.9625 10.7923C20.9375 10.9256 20.9 11.0506 20.85 11.1673L17.85 18.2173C17.7 18.5506 17.45 18.834 17.1 19.0673C16.75 19.3006 16.3833 19.4173 16 19.4173H8C7.45 19.4173 6.97917 19.2215 6.5875 18.8298C6.19583 18.4381 6 17.9673 6 17.4173V7.24231C6 6.97564 6.05417 6.72147 6.1625 6.47981C6.27083 6.23814 6.41667 6.02564 6.6 5.84231L12.025 0.442308C12.275 0.208974 12.5708 0.0673077 12.9125 0.0173077C13.2542 -0.0326923 13.5833 0.025641 13.9 0.192308C14.2167 0.358974 14.4458 0.592308 14.5875 0.892308C14.7292 1.19231 14.7583 1.50064 14.675 1.81731L13.55 6.41731H19ZM2 19.4173C1.45 19.4173 0.979167 19.2215 0.5875 18.8298C0.195833 18.4381 0 17.9673 0 17.4173V8.41731C0 7.86731 0.195833 7.39647 0.5875 7.00481C0.979167 6.61314 1.45 6.41731 2 6.41731C2.55 6.41731 3.02083 6.61314 3.4125 7.00481C3.80417 7.39647 4 7.86731 4 8.41731V17.4173C4 17.9673 3.80417 18.4381 3.4125 18.8298C3.02083 19.2215 2.55 19.4173 2 19.4173Z"
                        fill="#BE1823"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1 text-center pl-3 xs:py-1 xs:pl-3 xs:text-left sm:pl-6 text-xs xs:text-sm sm:text-base text-secondary/75">
                    <span className="font-medium text-secondary">{t('trusted')}</span> {t('byOver')}{' '}
                    <span className="font-medium text-accent whitespace-nowrap">
                      22,900 {t('customers')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="top-gradient-glow">
          <span className="sr-only">Internetport banner</span>
          <Image
            alt="familj-anvander-bredband"
            src="https://internetportcom.b-cdn.net/se/img/familj-anvander-bredband.webp"
            width={600}
            height={400}
            className="w-full"
          />
        </div>
        <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[100%] z-[-1]">
          <span className="sr-only">cirklar-transparent-bakgrund</span>
          <Image
            alt="cirklar-transparent-bakgrund"
            src="https://internetportcom.b-cdn.net/se/img/cirklar-transparent-bakgrund.webp"
            className="w-full h-auto"
            width={1200}
            height={600}
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={95}
            priority
          />
        </div>
      </Container>
      <div className="absolute top-0 right-0 w-fit z-[-2]">
        <span className="sr-only">suddig-bakgrund</span>
        <Image
          alt="suddig-bakgrund"
          src="https://internetportcom.b-cdn.net/se/img/suddig-bakgrund.webp"
          className="w-full h-auto opacity-[0.3]"
          width={1200}
          height={600}
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={95}
          priority
        />
      </div>
    </div>
  );
}
