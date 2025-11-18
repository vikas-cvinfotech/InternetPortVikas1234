'use client';
import Image from 'next/image';

const ForetagConnectSection = () => {
  return (
    <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 relative border border-solid border-l-0 border-r-0 border-borderGray">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[30px] ">
        <div className="borderbottomeffect companycard z-[4]">
          <div className="bg-lightbrown text-primary rounded-lg flex flex-col items-center text-center p-[30px]">
            <Image
              src="https://internetportcom.b-cdn.net/se/img/telephone.webp"
              alt="telephone"
              width={120}
              height={120}
              className="object-cover"
            />
            <h2 className="text-2xl font-bold my-[30px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>
            <p className="text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt
              fringilla suscipit vitae.
            </p>
          </div>
        </div>
        <div className="borderbottomeffect lightcompanycard z-[4]">
          <div className="bg-darkbrown text-primary rounded-lg flex flex-col items-center text-center p-[30px]">
            <Image
              src="https://internetportcom.b-cdn.net/se/img/wifi.webp"
              alt="wifi"
              width={120}
              height={120}
              className="object-cover"
            />
            <h2 className="text-2xl font-bold my-[30px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>
            <p className="text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt
              fringilla suscipit vitae.
            </p>
          </div>
        </div>
        <div className="borderbottomeffect companycard z-[4]">
          <div className="bg-lightbrown text-primary rounded-lg flex flex-col items-center text-center p-[30px]">
            <Image
              src="https://internetportcom.b-cdn.net/se/img/tag.webp"
              alt="tag"
              width={120}
              height={120}
              className="object-cover"
            />
            <h2 className="text-2xl font-bold my-[30px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h2>
            <p className="text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, tincidunt
              fringilla suscipit vitae.
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
