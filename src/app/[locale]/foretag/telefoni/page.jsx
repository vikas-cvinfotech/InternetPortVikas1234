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
import { faqData, featuresIncluded } from '@/components/telephony/telephonyData';

export default function TelephonyPage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="kvinna-telefon-skrivbord"
        imageSrc="https://internetportcom.b-cdn.net/se/img/kvinna-telefon-skrivbord.png"
        titlePart1="Lorem Ipsum dolor sit!"
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium."
        link="/kategori/telefoni"
        linkLabel="Explore Solutions"
      />
      <ContentBlock
        title="Lorem ipsum dolor sit amet."
        desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt fringilla suscipit vitae, elementum in mi. Phasellus lobortis egestas lorem, vel aliquam ligula tincidunt pretium."
        imageUrl="https://internetportcom.b-cdn.net/se/img/kvinna-telefon-skrivbord-glad.png"
        alt="kvinna-telefon-skrivbord-glad"
        padd="pt-24 pb-[60px]"
      />
      {/* features Included section  */}
      <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] flex flex-col gap-30 pb-24 mb-1">
        <h2 className="text-3xl font-bold text-darkGray">Some of the features included</h2>
        <div className="flex flex-col gap-30">
          {featuresIncluded &&
            featuresIncluded.map((item, index) => {
              return (
                <div key={index} className="flex items-start gap-8 rounded-lg bg-primary h-full">
                  <dt className="font-semibold">
                    <div
                      className="rounded-md inline-flex items-center bg-surfaceSecondary p-5"
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    ></div>
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
      {/* call costs section */}
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 relative z-[1]">
          <div className="text-center font-bold mb-[60px] mt-1">
            <h2 className="text-[32px] mb-4">Call Costs</h2>
            <p className="text-base font-normal text-paraSecondary">
              No hidden fees. Only pay for what you call.
            </p>
          </div>
          <div className="mx-auto mt-[60px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="borderbottomeffect h-max">
                <div className="border rounded-lg shadow-sm bg-primary p-8">
                  <div className="flex justify-between items-center mb-16">
                    <h2 className="text-2xl font-bold text-paraSecondary">Call Costs</h2>
                    <Link
                      href="javascript:void(0)"
                      className="text-base font-normal bg-lightgreen rounded-lg px-3 py-1 leading-[24px] text-primary capitalize inline-block"
                    >
                      Popular
                    </Link>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex text-accent justify-between  items-center gap-2">
                      <div className="flex items-center gap-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.08334 8.33336C3.08334 9.09724 3.21195 9.8578 3.46917 10.615C3.72639 11.3722 4.10473 12.07 4.60417 12.7084C4.72917 12.8611 4.79167 13.0384 4.79167 13.24C4.79167 13.4417 4.72223 13.6117 4.58334 13.75C4.44445 13.8884 4.27445 13.9509 4.07334 13.9375C3.87223 13.9242 3.70889 13.8409 3.58334 13.6875C2.94445 12.8959 2.46528 12.0486 2.14584 11.1459C1.82639 10.2431 1.66667 9.30558 1.66667 8.33336C1.66667 7.36113 1.82639 6.42363 2.14584 5.52086C2.46528 4.61808 2.94445 3.77086 3.58334 2.97919C3.70834 2.82641 3.87167 2.74308 4.07334 2.72919C4.27501 2.7153 4.44501 2.7778 4.58334 2.91669C4.72167 3.05558 4.79112 3.22558 4.79167 3.42669C4.79223 3.6278 4.72973 3.80502 4.60417 3.95836C4.10417 4.59724 3.72584 5.2953 3.46917 6.05252C3.21251 6.80974 3.08389 7.57002 3.08334 8.33336ZM5.83334 8.33336C5.83334 8.73613 5.89584 9.14586 6.02084 9.56252C6.14584 9.97919 6.34723 10.3681 6.62501 10.7292C6.73612 10.882 6.79167 11.0556 6.79167 11.25C6.79167 11.4445 6.72223 11.6111 6.58334 11.75C6.44445 11.8889 6.27778 11.955 6.08334 11.9484C5.88889 11.9417 5.72917 11.8617 5.60417 11.7084C5.21528 11.2084 4.92001 10.6703 4.71834 10.0942C4.51667 9.51808 4.41612 8.93113 4.41667 8.33336C4.41723 7.73558 4.51806 7.14863 4.71917 6.57252C4.92028 5.99641 5.21528 5.45836 5.60417 4.95836C5.72917 4.80558 5.88889 4.72558 6.08334 4.71836C6.27778 4.71113 6.44445 4.77724 6.58334 4.91669C6.72223 5.05613 6.78834 5.2228 6.78167 5.41669C6.775 5.61058 6.71584 5.78419 6.60417 5.93752C6.34028 6.28474 6.14584 6.66336 6.02084 7.07336C5.89584 7.48336 5.83334 7.90336 5.83334 8.33336ZM8.06251 16.6667L7.68751 17.7917C7.63195 17.9445 7.53473 18.0731 7.39584 18.1775C7.25695 18.282 7.10417 18.3339 6.93751 18.3334C6.65973 18.3334 6.44445 18.2259 6.29167 18.0109C6.13889 17.7959 6.10417 17.5561 6.18751 17.2917L8.64584 9.89586C8.42362 9.70141 8.24639 9.47224 8.11417 9.20836C7.98195 8.94447 7.91612 8.6528 7.91667 8.33336C7.91667 7.75002 8.11806 7.25697 8.52084 6.85419C8.92362 6.45141 9.41667 6.25002 10 6.25002C10.5833 6.25002 11.0764 6.45141 11.4792 6.85419C11.8819 7.25697 12.0833 7.75002 12.0833 8.33336C12.0833 8.6528 12.0172 8.94447 11.885 9.20836C11.7528 9.47224 11.5758 9.70141 11.3542 9.89586L13.8125 17.2917C13.8958 17.5417 13.8647 17.7778 13.7192 18C13.5736 18.2222 13.3617 18.3334 13.0833 18.3334C12.9167 18.3334 12.7606 18.2847 12.615 18.1875C12.4694 18.0903 12.3686 17.9584 12.3125 17.7917L11.9583 16.6667H8.06251ZM8.60417 15H11.3958L10 10.8334L8.60417 15ZM14.1667 8.33336C14.1667 7.93058 14.1042 7.52085 13.9792 7.10419C13.8542 6.68752 13.6528 6.29863 13.375 5.93752C13.2639 5.78474 13.2083 5.61113 13.2083 5.41669C13.2083 5.22224 13.2778 5.05558 13.4167 4.91669C13.5556 4.7778 13.7256 4.71169 13.9267 4.71836C14.1278 4.72502 14.2842 4.80502 14.3958 4.95836C14.7708 5.45836 15.0556 5.99669 15.25 6.57336C15.4444 7.15002 15.5556 7.73669 15.5833 8.33336C15.5833 8.93058 15.4825 9.51752 15.2808 10.0942C15.0792 10.6709 14.7842 11.2089 14.3958 11.7084C14.2708 11.8611 14.1111 11.9411 13.9167 11.9484C13.7222 11.9556 13.5556 11.8895 13.4167 11.75C13.2778 11.6106 13.2117 11.4439 13.2183 11.25C13.225 11.0561 13.2842 10.8825 13.3958 10.7292C13.6597 10.382 13.8542 10.0036 13.9792 9.59419C14.1042 9.18474 14.1667 8.76447 14.1667 8.33336ZM16.9167 8.33336C16.9167 7.56947 16.7883 6.80891 16.5317 6.05169C16.275 5.29447 15.8964 4.59669 15.3958 3.95836C15.2708 3.80558 15.2083 3.62836 15.2083 3.42669C15.2083 3.22502 15.2778 3.05502 15.4167 2.91669C15.5556 2.77836 15.7258 2.71586 15.9275 2.72919C16.1292 2.74252 16.2922 2.82586 16.4167 2.97919C17.0556 3.77086 17.5347 4.61808 17.8542 5.52086C18.1736 6.42363 18.3333 7.36113 18.3333 8.33336C18.3333 9.30558 18.1842 10.2431 17.8858 11.1459C17.5875 12.0486 17.1047 12.8959 16.4375 13.6875C16.2986 13.8403 16.132 13.9272 15.9375 13.9484C15.7431 13.9695 15.5695 13.9034 15.4167 13.75C15.2778 13.6111 15.2083 13.4411 15.2083 13.24C15.2083 13.0389 15.2708 12.8617 15.3958 12.7084C15.8958 12.0695 16.2744 11.3717 16.5317 10.615C16.7889 9.85836 16.9172 9.0978 16.9167 8.33336Z"
                            fill="#BE1823"
                          />
                        </svg>
                        <span className="text-paraSecondary text-base font-normal">
                          Opening fee (per call)
                        </span>
                      </div>
                      <div className="text-accent font-bold text-base">0,63 kr</div>
                    </div>
                    <div className="flex text-accent justify-between  items-center gap-2">
                      <div className="flex items-center gap-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.66667 4.04758C1.66667 3.41611 1.91752 2.81051 2.36404 2.36399C2.81055 1.91748 3.41616 1.66663 4.04762 1.66663H5.13651C5.81905 1.66663 6.41429 2.13171 6.58016 2.79361L7.45715 6.30393C7.52822 6.58805 7.51386 6.88683 7.41588 7.16284C7.31791 7.43884 7.14066 7.67979 6.90635 7.85552L5.88016 8.62536C5.77302 8.70552 5.75001 8.82298 5.78016 8.90472C6.22808 10.1229 6.9354 11.2291 7.85314 12.1468C8.77088 13.0646 9.87711 13.7719 11.0952 14.2198C11.177 14.25 11.2937 14.2269 11.3746 14.1198L12.1445 13.0936C12.3202 12.8593 12.5611 12.6821 12.8371 12.5841C13.1131 12.4861 13.4119 12.4718 13.696 12.5428L17.2064 13.4198C17.8683 13.5857 18.3333 14.1809 18.3333 14.8642V15.9523C18.3333 16.5838 18.0825 17.1894 17.636 17.6359C17.1895 18.0824 16.5839 18.3333 15.9524 18.3333H14.1667C7.2635 18.3333 1.66667 12.7365 1.66667 5.83329V4.04758Z"
                            fill="#BE1823"
                          />
                        </svg>
                        <span className="text-paraSecondary text-base font-normal">
                          Sweden call (per min)
                        </span>
                      </div>
                      <div className="text-accent font-bold text-base">0,15 kr</div>
                    </div>
                    <div className="flex text-accent justify-between  items-center gap-2">
                      <div className="flex items-center gap-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.1458 17.3334C11.1458 17.0183 11.0336 16.7485 10.8092 16.5241C10.5849 16.2997 10.3151 16.1875 10 16.1875C9.6849 16.1875 9.41515 16.2997 9.19076 16.5241C8.96636 16.7485 8.85417 17.0183 8.85417 17.3334C8.85417 17.6485 8.96636 17.9182 9.19076 18.1426C9.41515 18.367 9.6849 18.4792 10 18.4792C10.3151 18.4792 10.5849 18.367 10.8092 18.1426C11.0336 17.9182 11.1458 17.6485 11.1458 17.3334ZM14.125 15.0417V4.95837C14.125 4.83424 14.0796 4.72682 13.9889 4.63611C13.8982 4.5454 13.7908 4.50004 13.6667 4.50004H6.33333C6.2092 4.50004 6.10178 4.5454 6.01107 4.63611C5.92036 4.72682 5.875 4.83424 5.875 4.95837V15.0417C5.875 15.1658 5.92036 15.2733 6.01107 15.364C6.10178 15.4547 6.2092 15.5 6.33333 15.5H13.6667C13.7908 15.5 13.8982 15.4547 13.9889 15.364C14.0796 15.2733 14.125 15.1658 14.125 15.0417ZM11.375 2.89587C11.375 2.7431 11.2986 2.66671 11.1458 2.66671H8.85417C8.70139 2.66671 8.625 2.7431 8.625 2.89587C8.625 3.04865 8.70139 3.12504 8.85417 3.12504H11.1458C11.2986 3.12504 11.375 3.04865 11.375 2.89587ZM15.5 2.66671V17.3334C15.5 17.8299 15.3186 18.2596 14.9557 18.6224C14.5929 18.9853 14.1632 19.1667 13.6667 19.1667H6.33333C5.83681 19.1667 5.40712 18.9853 5.04427 18.6224C4.68142 18.2596 4.5 17.8299 4.5 17.3334V2.66671C4.5 2.17018 4.68142 1.74049 5.04427 1.37764C5.40712 1.0148 5.83681 0.833374 6.33333 0.833374H13.6667C14.1632 0.833374 14.5929 1.0148 14.9557 1.37764C15.3186 1.74049 15.5 2.17018 15.5 2.66671Z"
                            fill="#BE1823"
                          />
                        </svg>
                        <span className="text-paraSecondary text-base font-normal">
                          Mobile call (per min)
                        </span>
                      </div>
                      <div className="text-accent font-bold text-base">0,75 kr</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderbottomeffect h-max">
                <div className="border rounded-lg shadow-sm bg-primary p-8">
                  <div className="flex justify-between items-center mb-16">
                    <h2 className="text-2xl font-bold text-paraSecondary">
                      Calculation example for total call cost
                    </h2>
                  </div>
                  <p className="text-base font-regular text-paraSecondary mb-8">
                    Calculation example for 50 calls, 25 within Sweden and 25 to mobile numbers
                    within Sweden, all calls are 3 minutes long.
                  </p>
                  <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row text-accent justify-between  items-center gap-2 py-[12px] border-b border-secondaryBg">
                      <div className="flex flex-col md:flex-row items-center gap-2 text-paraSecondary text-base font-normal">
                        <div>Opening fee:</div>
                        <span>50 calls x 0.63 SEK</span>
                      </div>
                      <div className="text-paraSecondary font-normal text-base">31,50 kr</div>
                    </div>
                    <div className="flex flex-col md:flex-row text-accent justify-between  items-center gap-2 py-[12px] border-b border-secondaryBg">
                      <div className="flex flex-col md:flex-row items-center gap-2 text-paraSecondary text-base font-normal">
                        <div>Call cost for regular calls: </div>
                        <span>25 calls x 3 minutes x 0.15 SEK</span>
                      </div>
                      <div className="text-paraSecondary font-normal text-base">11,25 kr</div>
                    </div>
                    <div className="flex flex-col md:flex-row text-accent justify-between  items-center gap-2 py-[12px] border-b border-secondaryBg">
                      <div className="flex flex-col md:flex-row items-center gap-2 text-paraSecondary text-base font-normal">
                        <div>Call cost for mobile calls: </div>
                        <span>25 calls x 3 minutes x 0.75 SEK</span>
                      </div>
                      <div className="text-paraSecondary font-normal text-base">56,25 krr</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-base font-bold mt-8">
                    <div className="text-secondary "> Total call cost</div>
                    <div className="text-accent ">99,00 kr</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100%]">
          <span className="sr-only">kross-transparent-bakgrund</span>
          <Image
            alt="kross-transparent-bakgrund"
            src="https://internetportcom.b-cdn.net/se/img/krosstelephoni-transparent-bakgrund.png"
            className="w-full h-full"
            width={1200}
            height={600}
            quality={100}
            priority
          />
        </div>
      </div>
      {/* International Prices */}
      <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px]">
        <div className="text-center font-bold mb-[60px] mt-1">
          <h2 className="text-[32px] mb-4">International Prices</h2>
          <p className="text-base font-normal text-paraSecondary">
            Find prices for calls to the whole world.
          </p>
        </div>
        <div className="flex items-center justify-center flex-col gap-60">
          <PriceTable />
          <Link
            href="/"
            className="text-sm d-block px-8 py-2.5 rounded-[4px] font-semibold bg-accent text-primary hover:bg-hoveraccent uppercase"
          >
            View All
          </Link>
        </div>
      </div>
      <FaqSection
        title="Lorem Ipsum Dolor Sit Amet."
        faqs={faqData}
        image="https://internetportcom.b-cdn.net/se/img/man-telefon-laptop.png"
      />
      <AdvisorContactCard
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        link="/"
        linkLabel="Contact a business advisor"
        marginBottom=" "
      />
    </div>
  );
}
