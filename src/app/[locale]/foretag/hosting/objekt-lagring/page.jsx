'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CommonBanner from '@/components/CommonBanner';
import ContentBlock from '@/components/ContentBlock';
import Image from 'next/image';
import OfferCard from '@/components/OfferCard';
import AdvisorContactCard from '@/components/AdvisorContactCard';
import PriceComparisonTable from '@/components/PriceComparisonTable';
import StorageCard from '@/components/StorageCard';
import { features, otherFeatures, cardData } from '@/components/objectstorage/objectstorageData';

export default function ObjectStoragePage() {
  const { locale } = useParams();
  const t = useTranslations('telephony');

  return (
    <div className="bg-primary text-secondary">
      <CommonBanner
        imageAlt="natverk-kablar-turkos"
        imageSrc="https://internetportcom.b-cdn.net/se/img/natverk-kablar-turkos.png"
        titlePart1="Object Storage"
        desc="S3-compatible, scalable and affordable storage with high availability"
        link="https://portal.internetport.com/cart/&step=3"
        linkLabel="Start Storing Now"
      />
      <ContentBlock
        title="IpSwarm"
        desc="Store virtually unlimited data in a reliable, efficient and affordable way. The service Internetport Object Storage is a S3-compatible solution, ideal for storing and managing large volumes of static or unstructured data
The cost is €0.045/GiB monthly including free transfers – no strings attached."
        imageUrl="https://internetportcom.b-cdn.net/se/img/it-personal-diskussion-datacenter.png"
        alt="it-personal-diskussion-datacenter"
        padd="pt-24 pb-[60px]"
        mainTitle="Reliable and Secure Object Storage"
        mainDesc="S3-compatible, scalable and affordable storage with high availability."
      />

      <OfferCard
        title="Features & benefits"
        offerData={features}
        bgImage="https://internetportcom.b-cdn.net/se/img/feature-transparent-bakgrund.png"
        gridColClass="sm:grid-cols-2 lg:grid-cols-4"
        border={false}
        paddb="pb-[200px]"
        zIndex="z-[0]"
        paddX=" "
      />

      <div className="-mt-[66]">
        <div className={`px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] pb-24 my-1 w-full`}>
          <div className="relative z-[1]">
            <div className="borderbottomeffect advisorcontactcard">
              <div
                className={`bg-secondary text-primary rounded-lg p-6 flex flex-col md:flex-row gap-30 items-start md:items-center`}
              >
                <div className="bg-lightcream p-5 rounded-md">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.7637 32.3533L24.7037 30.59L17.2337 34.9433L20.3503 36.7066L27.7637 32.3533Z"
                      fill="#BE1823"
                    />
                    <path
                      d="M28.0603 32.8833L20.6503 37.1767V38.4133L28.0603 34.12V32.8833Z"
                      fill="#BE1823"
                    />
                    <path
                      d="M24.4103 28.4133L16.9403 32.7067V34.4133L24.4103 30.12V28.4133Z"
                      fill="#BE1823"
                    />
                    <path
                      d="M33.237 21.2367V20.1767L8.47367 34.47C8.29701 34.5866 8.06034 34.47 8.00367 34.2333L7.94367 17.88C7.94367 16.88 8.59034 15.7633 9.47367 15.2333L31.9403 2.29332C32.0003 2.29332 32.057 2.23332 32.057 2.23332L31.117 1.64665C30.9403 1.52999 30.647 1.64665 30.4103 1.76332L8.00034 14.7067C7.35367 15.12 6.76367 16.06 6.76367 16.8233L6.82367 34.7067C6.82367 35 6.94034 35.2367 7.06034 35.3533L8.82367 36.4133C9.00034 36.53 9.237 36.4733 9.53034 36.2967L32.0003 23.3533C32.647 22.94 33.237 22 33.237 21.2367ZM20.8837 29.06C20.5903 29.2366 20.3537 29.12 20.3537 28.7667C20.3537 28.4133 20.5903 28.0033 20.8837 27.8267C21.177 27.65 21.4137 27.7667 21.4137 28.12C21.4137 28.47 21.177 28.8833 20.8837 29.06Z"
                      fill="#BE1823"
                    />
                    <path
                      d="M20.8837 13.3533C19.8837 13.94 19.0603 15.3533 19.0603 16.53V17.6467L22.707 15.53V14.4133C22.707 13.2367 21.8837 12.7633 20.8837 13.3533Z"
                      fill="#BE1823"
                    />
                    <path
                      d="M31.2937 18.3533C31.3537 18.2367 31.5303 18.1767 31.707 18.2367L33.237 19.12C33.237 17.5333 33.237 24.9433 33.177 3.29665C33.177 3.11999 33.177 3.00332 33.117 2.88332C33.117 2.94332 32.8237 3.41332 31.8803 5.41332C31.8203 5.52999 31.6437 5.58999 31.467 5.52999C31.2903 5.46999 31.2903 5.29332 31.3503 5.11665C31.4103 5.05665 32.6437 2.52999 32.587 2.70332C32.4703 2.70332 32.3503 2.76332 32.2937 2.81999L9.82367 15.7633C9.53034 15.94 9.29367 16.1767 9.11701 16.47H9.17701L11.0003 17.47C11.117 17.53 11.177 17.7067 11.117 17.8833C11.057 18 10.8803 18.06 10.7037 18L8.82034 16.94H8.76034C8.64367 17.2333 8.52367 17.5867 8.52367 17.88L8.58367 33.1167L9.87701 30.5867C9.93701 30.41 10.1137 30.35 10.2903 30.47C10.407 30.53 10.467 30.7067 10.407 30.8833L9.11367 33.4133L32.937 19.65L31.3503 18.7667C31.2337 18.6467 31.2337 18.47 31.2937 18.3533ZM23.7637 21L18.0003 24.2933C17.707 24.47 17.4703 24.3533 17.4703 24V19.1767C17.4703 18.8233 17.707 18.4133 18.0003 18.2367L18.237 18.06V16.9433C18.237 15.2967 19.4137 13.2367 20.8237 12.4133C22.237 11.59 23.4703 12.2367 23.4703 13.8833V15L23.707 14.8233C24.0003 14.6467 24.237 14.7633 24.237 15.1167V19.94C24.3537 20.4133 24.0603 20.8233 23.7637 21Z"
                      fill="#BE1823"
                    />
                    <path
                      d="M21.4103 18.8833C21.4103 18.53 21.1737 18.4133 20.8803 18.59C20.587 18.7667 20.3503 19.1767 20.3503 19.4733C20.3503 19.65 20.4103 19.7666 20.527 19.8266L20.2337 21.0633L21.527 20.3L21.2337 19.4167C21.3537 19.2367 21.4103 19.06 21.4103 18.8833Z"
                      fill="#BE1823"
                    />
                    <path
                      d="M15.5303 33.53V35.7066L20.0603 38.4133V37.1767L16.5303 35.1767C16.4703 35.1167 16.3537 35.1166 16.3537 34.94V33.0567L15.5303 33.53Z"
                      fill="#BE1823"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl font-bold">Your data is safe with us</h2>
                  <p className="text-base text-secondaryBg">
                    Achieve GDPR compliance without disruption to operations. With us, you can
                    safely store sensitive data within the EU.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] pb-24">
        <div className="text-center font-bold mb-[60px] mt-1">
          <h2 className="text-[32px]">Price Comparison</h2>
        </div>
        <div className="flex items-center justify-center flex-col gap-60">
          <PriceComparisonTable />
        </div>
      </div>
      <div className="relative">
        <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 relative z-[1]">
          <div className="text-center font-bold mb-[60px] mt-1">
            <h2 className="text-[32px] mb-4">Object Storage configurations</h2>
            <p className="text-base font-normal text-paraSecondary">
              No hidden fees. Only pay for what you call.
            </p>
          </div>
          <div className="mx-auto mt-[60px] max-w-xl">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              {cardData.map((data, index) => (
                <StorageCard
                  key={index}
                  title={data.title}
                  configData={data.configData}
                  price={data.price}
                  buylink={data.buylink}
                  buyLabel={data.buyLabel}
                  isPopular={data.isPopular}
                  link={data.link}
                  linkLabel={data.linkLabel}
                />
              ))}
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
      <OfferCard
        title="Other Features"
        offerData={otherFeatures}
        gridColClass="sm:grid-cols-2 lg:grid-cols-4"
        zIndex="z-[0]"
        border={false}
      />
      <AdvisorContactCard
        title="Try Object Storage Today!"
        desc="The cost is €0.045/GiB monthly including free transfers – no strings attached."
        link="https://portal.internetport.com/cart/&step=3"
        linkLabel="Get Now"
        gap="gap-[20]"
      />
    </div>
  );
}
