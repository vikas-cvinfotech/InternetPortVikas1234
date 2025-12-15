'use client';
import Image from 'next/image';

const ForetagConnectSection = () => {
  return (
    <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 relative border border-solid border-l-0 border-r-0 border-borderGray">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-[60px] lg:gap-[30px] lg:gap-y-[30px] ">
        <div className="borderbottomeffect companycard z-[4]">
          <div className="bg-lightbrown text-primary rounded-lg h-full flex flex-col items-center text-center p-[30px]">
            <Image
              src="https://internetportcom.b-cdn.net/se/img/rated.png"
              alt="telephone"
              width={120}
              height={120}
              className="object-cover"
            />
            <h2 className="text-2xl font-bold my-[30px] capitalize">Best rated by customers</h2>
            <p className="text-base">
              We are proud to have the highest rating on Trustpilot among the largest suppliers in
              Sweden.
            </p>
          </div>
        </div>
        <div className="borderbottomeffect lightcompanycard z-[4]">
          <div className="bg-darkbrown text-primary rounded-lg h-full flex flex-col items-center text-center p-[30px]">
            <Image
              src="https://internetportcom.b-cdn.net/se/img/wifi.webp"
              alt="wifi"
              width={120}
              height={120}
              className="object-cover"
            />
            <h2 className="text-2xl font-bold my-[30px] capitalize">
              Sweden's largest fiber provider
            </h2>
            <p className="text-base">
              A leading fibre provider serving hundreds of thousands of customers who rely on our
              standard internet services.
            </p>
          </div>
        </div>
        <div className="borderbottomeffect companycard z-[4]">
          <div className="bg-lightbrown text-primary rounded-lg h-full flex flex-col items-center text-center p-[30px]">
            <Image
              src="https://internetportcom.b-cdn.net/se/img/tag.webp"
              alt="tag"
              width={120}
              height={120}
              className="object-cover"
            />
            <h2 className="text-2xl font-bold my-[30px] capitalize">
              Always reliable and affordable solutions
            </h2>
            <p className="text-base">
              We help businesses communicate, grow and reach new customers securely and stably. Our
              corporate fiber includes free DDoS protection to protect your business.
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100%] z-[-1]">
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
  );
};

export default ForetagConnectSection;
