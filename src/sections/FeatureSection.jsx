'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

const features = [
  {
    nameKey: 'getOnline1001',
    descriptionKey:
      "Perfect for browsing, streaming HD content, and staying connected with family and friends. Whether you're working from home or enjoying your favorite online content, our 100 Mbps plan has you covered.",
    speedKey: 'getOnline1002',
    speedUnit: 'getOnline1003',
    subDesc: 'getOnline100SubDesc',
    svgUrl: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.5626 2.44062C29.3582 2.23618 29.0989 2.09519 28.8162 2.03465C28.5334 1.97411 28.2392 1.99658 27.9689 2.09937L2.96702 11.5625H2.96202C2.67375 11.6734 2.42673 11.8705 2.2547 12.1271C2.08267 12.3836 1.99402 12.6869 2.00086 12.9957C2.00769 13.3045 2.10968 13.6037 2.2929 13.8523C2.47611 14.101 2.73162 14.287 3.02452 14.385L3.05014 14.3931L11.6314 18.0575C11.7988 18.1083 11.9765 18.1143 12.147 18.075C12.3174 18.0356 12.4745 17.9522 12.6026 17.8331L26.3751 5C26.4162 4.95896 26.4649 4.92641 26.5185 4.9042C26.5721 4.88199 26.6296 4.87056 26.6876 4.87056C26.7457 4.87056 26.8032 4.88199 26.8568 4.9042C26.9104 4.92641 26.9591 4.95896 27.0001 5C27.0412 5.04104 27.0737 5.08976 27.0959 5.14338C27.1182 5.19699 27.1296 5.25446 27.1296 5.3125C27.1296 5.37054 27.1182 5.428 27.0959 5.48162C27.0737 5.53524 27.0412 5.58396 27.0001 5.625L14.1664 19.3913C14.0473 19.5194 13.9639 19.6765 13.9246 19.8469C13.8852 20.0174 13.8912 20.1951 13.942 20.3625L17.6076 28.9488C17.6114 28.9613 17.6151 28.9725 17.6195 28.9844C17.8195 29.5638 18.3258 29.9725 18.9376 30H19.0001C19.309 30.0018 19.6113 29.9106 19.8677 29.7382C20.1241 29.5659 20.3226 29.3204 20.4376 29.0338L29.8995 4.03875C30.0038 3.7683 30.0274 3.47344 29.9677 3.18982C29.9079 2.9062 29.7672 2.64598 29.5626 2.44062Z" fill="#BE1823"/>
            </svg>`,
  },
  {
    nameKey: 'getMoreSpeed2501',
    descriptionKey:
      'Our 250 Mbps plan offers smooth streaming, quick downloads, and reliable connectivity for larger households or small businesses. Great for multiple devices running at once, perfect for families and remote workers.',
    speedKey: 'getMoreSpeed2502',
    speedUnit: 'getMoreSpeed2503',
    subDesc: 'getMoreSpeed250SubDesc',
    svgUrl: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 10C12.5 14.393 14.353 21.705 14.965 24H17.034C17.646 21.705 19.499 14.393 19.499 10C19.499 4.018 17.689 0 15.999 0C14.309 0 12.5 4.018 12.5 10Z" fill="#4F4F4F"/>
            <path d="M10.5 10C10.5 6.552 11.118 2.957 12.415 0.61C8.103 2.098 5 6.182 5 11C5 15.818 10.365 22.163 11.701 23.669C11.891 23.883 12.158 24 12.444 24H12.894C12.158 21.194 10.5 14.384 10.5 10ZM19.585 0.61C20.882 2.957 21.5 6.552 21.5 10C21.5 14.384 19.841 21.194 19.105 24H19.555C19.6953 24.001 19.8342 23.972 19.9623 23.9149C20.0904 23.8578 20.2049 23.774 20.298 23.669C21.634 22.163 26.999 15.815 26.999 11C26.999 6.185 23.898 2.098 19.585 0.61ZM12 26H20C20.2652 26 20.5196 26.1054 20.7071 26.2929C20.8946 26.4804 21 26.7348 21 27V29C21 30.656 19.656 32 18 32H14C12.344 32 11 30.656 11 29V27C11 26.7348 11.1054 26.4804 11.2929 26.2929C11.4804 26.1054 11.7348 26 12 26Z" fill="#4F4F4F"/>
            </svg>
            `,
    isHighlighted: true,
  },
  {
    nameKey: 'goFaster5001',
    descriptionKey:
      'The 500 Mbps plan gives you ultra-fast speeds for everything you need. Stream in 4K, download large files in seconds, and enjoy seamless video calls and gaming with no lag. This plan is ideal for tech-savvy households and high-demand environments.',
    speedKey: 'goFaster5002',
    speedUnit: 'goFaster5003',
    subDesc: 'goFaster500SubDesc',
    svgUrl: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.55565 10.2222L10.6668 11.6978L16.2845 7.6178L8.22231 7.84891C8.14323 7.8524 8.06651 7.87695 8.00009 7.92002L5.44898 9.38669C5.36962 9.43066 5.30528 9.49742 5.26428 9.57835C5.22328 9.65928 5.20751 9.75064 5.21899 9.84063C5.23048 9.93063 5.26871 10.0151 5.32872 10.0831C5.38874 10.1512 5.46779 10.1996 5.55565 10.2222Z" fill="#BE1823"/>
            <path d="M30.6845 5.65336L25.0845 4.44447C24.6136 4.34222 24.1261 4.34249 23.6553 4.44525C23.1844 4.54801 22.7412 4.75085 22.3556 5.04002L5.44009 17.3334L1.37787 17.1556C1.14519 17.1477 0.915902 17.213 0.722385 17.3425C0.528867 17.4719 0.380896 17.6589 0.299365 17.8769C0.217833 18.095 0.206862 18.3332 0.267999 18.5578C0.329136 18.7825 0.459293 18.9822 0.640091 19.1289L4.59565 22.2667C4.66077 22.3192 4.73828 22.3542 4.82076 22.3682C4.90325 22.3822 4.98795 22.3748 5.06676 22.3467C6.19565 21.9111 10.4001 19.68 15.369 16.9511L16.3645 27.1822C16.373 27.2709 16.4055 27.3555 16.4585 27.427C16.5115 27.4985 16.583 27.5542 16.6653 27.588C16.7477 27.6219 16.8377 27.6326 16.9256 27.619C17.0136 27.6055 17.0962 27.5682 17.1645 27.5111L19.3868 25.6622C19.5084 25.5602 19.5902 25.4186 19.6179 25.2622L21.7245 13.4489C25.2801 11.4756 28.6756 9.56447 31.0668 8.21335C31.3149 8.07833 31.5155 7.87029 31.6415 7.61743C31.7674 7.36456 31.8126 7.07909 31.7709 6.79969C31.7292 6.52029 31.6026 6.26046 31.4083 6.05541C31.2139 5.85037 30.9613 5.71001 30.6845 5.65336Z" fill="#BE1823"/>
            </svg>
            `,
  },
];
const powerFeatures = {
  nameKey: 'powerUp10001',
  descriptionKey: 'powerUp1000Desc',
};

export default function FeatureSection({ powersection }) {
  const t = useTranslations('featureSection');

  return (
    <div>
      <div className="bg-secondary py-16 lg:py-24 pb-[200px] lg:pb-[240px] xxl:pt-[100px] xxl:pb-[240px]">
        <div className="mx-auto">
          <div className="grid grid-cols-1 items-center gap-x-30 gap-y-10 lg:grid-cols-2 px-4 sm:px-6 lg:px-[50px] xl:px-[80px] xxl:px-[135px]">
            <div className="mx-auto  lg:mx-0">
              <h2 className="text-[32px] font-semibold tracking-tight text-primary capitalize">
                {/* {t('findPerfectSpeed1')}{' '} */}
                Why Your Business Needs Secure Broadband
              </h2>
              <p className="mt-6 text-lg/8 text-primary">
                Every minute spent online counts. Secure file transfers, cloud services, video
                conferencing, and smooth communication are essential to your company. Reliable,
                scalable, and high-performance access from Internetport Broadband keeps your teams
                productive and competitive.
              </p>
            </div>
            <Image
              alt="par-surfar-pa-dator"
              // src="https://internetportcom.b-cdn.net/se/img/par-surfar-pa-dator.webp"
              src="https://internetportcom.b-cdn.net/se/img/business_secure_broadband.png"
              width={1140}
              height={760}
              quality={100}
              className="w-full bg-primary/10 object-cover rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="-mt-28">
        {/* UPDATED CARD GRID */}
        <dl className="mx-auto grid grid-cols-1 gap-8 text-base/7 sm:grid-cols-1 lg:grid-cols-3 px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] mb-8 lg:mb-0">
          {features.map((feature) => (
            <div
              key={feature.nameKey}
              className="relative rounded-xl overflow-hidden flex flex-col"
            >
              <div
                // Conditional styling for the card appearance
                className={`
                    p-6 py-8 rounded-lg shadow-lg transition duration-300 ease-in-out justify-between  overflow-hidden min-h-[200px]
                    ${
                      feature.isHighlighted
                        ? 'bg-accent' // Highlighted Card Style
                        : 'bg-cardColor' // Default Card Style
                    }
                  `}
              >
                <div>
                  <dt
                    className={`
                        font-bold text-2xl sm:text-[28px] mb-8 
                        ${feature.isHighlighted ? 'text-primary' : 'text-primary'}
                      `}
                  >
                    {t(feature.nameKey)}
                  </dt>
                  <dd
                    className={`
                        mt-1 text-sm font-normal
                        ${feature.isHighlighted ? 'text-primary' : 'text-primary'}
                        `}
                  >
                    {t(feature.subDesc)}
                  </dd>
                </div>
                <div className="absolute right-[-40px] top-[-60px] sm:top-[-70px] xxl:right-[-30px] xxl:top-[-65px] bg-primary text-lg xxl:text-xl font-bold text-secondary text-accent p-5 rounded-full w-[140px] h-[150px] sm:w-[160px] sm:h-[160px] xxl:w-[160px] xxl:h-[160px] flex items-center flex-col justify-end text-center pr-[30px]">
                  <b className="text-3xl xxl:text-4xl text-accent">{t(feature.speedKey)}</b>
                  {t(feature.speedUnit)}
                </div>
              </div>
              <div className="bg-primary border px-4 sm:px-6 lg:px-8 py-[30px] lg:pt-[60px] lg:pb-[80px] mx-[25px] text-center relative rounded-lg rounded-tl-[0px] rounded-tr-[0px] flex-1 relative">
                <dd className="mt-1 mb-8 text-paraSecondary text-sm">
                  {/* {t(feature.descriptionKey)} */}
                  {feature.descriptionKey}
                </dd>
                <Link
                  href="/address-sok-bredband"
                  className="rounded-md bg-secondary px-3 py-2 mt-4 text-sm font-semibold text-primary shadow-xs hover:opacity-75 inline-flex items-center gap-2 lg:absolute lg:bottom-[0px] lg:left-1/2 lg:-translate-x-1/2 lg:mb-8 capitalize"
                >
                  {t('orderNow')}{' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <div
                  className="absolute top-[-25px] z-10 left-[50%] -translate-x-[50%] p-3 rounded-full bg-primary flex items-center justify-center shadow-primaryShadow"
                  dangerouslySetInnerHTML={{ __html: feature.svgUrl }}
                />
              </div>
            </div>
          ))}
        </dl>
        <div>
          <div className="text-base/7 px-4 sm:px-[30px] lg:px-[50px] xl:px-[80px] xl:mt-[48px] xl:mb-[72px]  xxl:px-[135px] pb-[72px]">
            {powersection ? (
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-y-5 lg:gap-y-0 mx-auto border-4 border-accent mt-[140px] rounded-md">
                <div className="relative">
                  <Image
                    alt="tv-kanaler-utbud-1000-mbit"
                    src="https://internetportcom.b-cdn.net/se/img/broadbandfour.webp"
                    width={1254}
                    height={882}
                    quality={100}
                    className="w-full md:w-[80%] bg-primary/10 object-cover"
                  />
                  <div className="right-0 absolute -top-[170px] bottom-0 lg:-right-[135px] z-[1]">
                    <Image
                      alt="tv-kanaler-utbud-1000-mbit"
                      src="https://internetportcom.b-cdn.net/se/img/broadbandfive.webp"
                      width={1254}
                      height={882}
                      quality={100}
                      className="  bg-primary/10 object-cover h-full"
                    />
                  </div>
                  <div className="hidden md:block bgOverlay"></div>
                </div>
                <div className="p-5 lg:ms-[-20px] lg:ps-0 flex flex-col justify-center items-start pr-10 relative z-[2]">
                  <dt className="font-bold text-[28px] mb-4">{t(powerFeatures.nameKey)}</dt>
                  <dd className="text-darkGray text-sm mb-4">{t(powerFeatures.descriptionKey)}</dd>
                  <Link
                    href="/address-sok-bredband"
                    className="rounded-md w-auto bg-accent hover:bg-hoveraccent px-3 py-2 mt-0 text-sm font-semibold text-primary shadow-xs inline-flex items-center gap-2 capitalize"
                  >
                    {t('orderNow')}{' '}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
                {/* 
                <div className="hidden md:block maskotPosition w-[170px] h-[170px] rounded-md">
                  <Image
                    alt="hund-maskot-1000-mbps"
                    src="https://internetportcom.b-cdn.net/se/img/hund-maskot-1000-mbps.png"
                    width={170}
                    height={170}
                    quality={100}
                    className="w-full bg-primary/10 object-cover"
                  />
                </div> */}
              </div>
            ) : (
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-y-5 lg:gap-y-0 mx-auto">
                <div className="relative">
                  <Image
                    alt="tv-kanaler-utbud-1000-mbit"
                    src="https://internetportcom.b-cdn.net/se/img/tv-kanaler-utbud-1000-mbitt.webp"
                    width={1254}
                    height={882}
                    quality={100}
                    className="w-full bg-primary/10 object-cover"
                  />
                </div>
                <div className="p-5 lg:pb-0 flex flex-col justify-center items-start pr-10">
                  <dt className="font-bold text-[28px] mb-4">{t(powerFeatures.nameKey)}</dt>
                  <dd className="text-darkGray text-sm mb-4">{t(powerFeatures.descriptionKey)}</dd>
                  <Link
                    href="/address-sok-bredband"
                    className="rounded-md w-auto bg-accent hover:bg-hoveraccent px-3 py-2 mt-0 text-sm font-semibold text-primary shadow-xs inline-flex items-center gap-2 capitalize"
                  >
                    {t('orderNow')}{' '}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
                <div className="absolute w-full h-full xl:h-[65%] border-4 border-accent -z-10 rounded-md lg:top-[7px] xl:top-[52%] xl:translate-y-[-45%]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
