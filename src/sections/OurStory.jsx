import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function OurStory() {
  const t = useTranslations('ourStory');

  return (
    <div className="relative">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-secondary translate-y-[-50px] lg:translate-y-[-90px] z-0"></div>

      {/* Foreground Content */}
      <div className="relative px-4 sm:px-6 lg:px-[50px] xl:px-[80px] xxl:px-[135px] z-10">
        <div className="-mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-primary p-5 lg:p-10 rounded-md shadow-sm gap-x-[60px] gap-y-4">
            <div className="relative mx-auto flex flex-col items-start justify-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-secondary sm:text-4xl capitalize">
                {t('title1')}
                <b className="text-accent"> {t('title2')}</b> <br />
                <b className="text-accent"> {t('title3')}</b>
              </h2>
              <p className="mt-3 text-lg text-secondary">{t('paragraph')}</p>
              <a
                href="/om-oss"
                className="my-4 lg:mt-8 lg:mb-0 flex items-center gap-2  rounded-md border border-transparent bg-accent hover:bg-hoveraccent transition-colors duration-300 px-8 py-3 text-sm font-medium text-primary capitalize"
              >
                {t('button')}
                <svg
                  width="17"
                  height="15"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 1.27751C6.19425 0.441149 4.67563 -0.00228778 3.125 8.87611e-06C2.20249 -0.000934088 1.28658 0.155475 0.416667 0.462509C0.294826 0.505586 0.189335 0.585373 0.114715 0.690884C0.040096 0.796396 1.83998e-05 0.922444 0 1.05168V12.9267C1.42343e-05 13.0267 0.0240141 13.1252 0.0699846 13.214C0.115955 13.3027 0.182555 13.3792 0.264192 13.4369C0.34583 13.4946 0.440123 13.5319 0.539156 13.5457C0.638189 13.5594 0.739071 13.5492 0.833333 13.5158C1.56944 13.2562 2.34445 13.124 3.125 13.125C4.7875 13.125 6.31083 13.7142 7.5 14.6967V1.27751ZM8.75 14.6967C9.98033 13.6785 11.528 13.1225 13.125 13.125C13.93 13.125 14.7 13.2633 15.4167 13.5167C15.511 13.55 15.612 13.5602 15.7111 13.5465C15.8101 13.5327 15.9045 13.4953 15.9861 13.4375C16.0678 13.3797 16.1344 13.3031 16.1803 13.2142C16.2262 13.1253 16.2501 13.0267 16.25 12.9267V1.05168C16.25 0.922444 16.2099 0.796396 16.1353 0.690884C16.0607 0.585373 15.9552 0.505586 15.8333 0.462509C14.9634 0.155475 14.0475 -0.000934088 13.125 8.87611e-06C11.5744 -0.00228778 10.0557 0.441149 8.75 1.27751V14.6967Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>

            <div>
              <Image
                alt="skrattande-kvinna-video-samtal"
                src="https://internetportcom.b-cdn.net/se/img/skrattande-kvinna-video-samtal.webp"
                className="object-cover rounded-md h-full"
                width={1220}
                height={600}
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
