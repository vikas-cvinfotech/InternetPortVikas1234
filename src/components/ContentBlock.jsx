'use client';
import Image from 'next/image';

export default function ContentBlock({ title, desc, link, linkLabel, imageUrl, alt }) {
  return (
    <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24">
      <div className="grid grid-cols-1  gap-x-16 gap-y-10 lg:grid-cols-2 px-4 ">
        <div>
          <h2 className="text-2xl lg:text-[32px] font-bold tracking-tight text-darkGray">
            {title}
          </h2>
          <p className="text-base mt-[20px] lg:mt-[30px] text-paraSecondary lg:pr-[30px]">{desc}</p>
          {link && linkLabel ? (
            <button className="bg-accent text-white px-4 py-4 rounded-md text-base font-semibold hover:bg-hoveraccent mt-4">
              Lorem Ipsum
            </button>
          ) : (
            ''
          )}
        </div>
        <Image
          alt={alt}
          src={imageUrl}
          width={1360}
          height={760}
          quality={100}
          className="w-full bg-primary/10 object-cover "
        />
      </div>
    </div>
  );
}
