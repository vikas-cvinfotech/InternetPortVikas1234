'use client';
import Image from 'next/image';

export default function ContentBlock({
  title,
  desc,
  desc1,
  link,
  linkLabel,
  imageUrl,
  alt,
  padd,
  mainTitle,
  mainDesc,
}) {
  return (
    <div
      className={`px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] ${
        padd ? padd : 'py-24'
      } sm:pr-0 xl:pr-0 xxl:pr-0`}
    >
      {(mainTitle || mainDesc) && (
        <div className="text-center mb-[80px]">
          <h1 className="text-[32px] text-secondary mb-4 font-bold">{mainTitle}</h1>
          <p className="text-base text-paraSecondary">{mainDesc}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
        <div>
          {title && (
            <h2 className="text-2xl lg:text-[32px] font-bold tracking-tight text-darkGray mb-[20px] lg:mb-[30px]">
              {title}
            </h2>
          )}
          {desc && <p className="text-base text-paraSecondary lg:pr-[30px] mb-4">{desc}</p>}
          {desc1 && <p className="text-base text-paraSecondary lg:pr-[30px]">{desc1}</p>}
          {link && linkLabel ? (
            <button className="bg-accent text-white px-4 py-4 rounded-md text-base font-semibold hover:bg-hoveraccent mt-4">
              Lorem Ipsum
            </button>
          ) : (
            ''
          )}
        </div>
        <div className="ps-10 relative">
          <Image
            alt={alt}
            src={imageUrl}
            width={1360}
            height={760}
            quality={100}
            className="w-full bg-primary/10 object-cover "
          />
          <div className="absolute w-[20px] md:w-[20px] h-[50%] bg-accent top-0 left-0"></div>
        </div>
      </div>
    </div>
  );
}
