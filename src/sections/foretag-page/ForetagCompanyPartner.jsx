'use client';

import { renderDesc } from '@/components/renderDescription/renderDesc';
import Image from 'next/image';
import Link from 'next/link';

export default function ForetagCompanyPartner({
  title,
  desc,
  alt,
  link,
  linkLabel,
  imageUrl,
  somestyle1,
  somestyle2,
  gridJustifyCenter,
}) {
  return (
    <div className="py-24">
      <div className="px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start justify-center gap-4 gap-y-6">
          <div
            className={`flex flex-col gap-[30] ${somestyle1} ${
              gridJustifyCenter ? gridJustifyCenter : ''
            }`}
          >
            <h2 className="text-dark text-[32px] font-bold capitalize leading-[1.5]">{title}</h2>
            {desc && renderDesc(desc)}
            {link && linkLabel ? (
              <div>
                <Link
                  href={link}
                  className="rounded-[4px] w-auto bg-mediumlightgray hover:bg-secondaryBg px-8 py-2.5 mt-0 text-sm font-semibold text-paraSecondary shadow-xs inline-flex items-center gap-2 capitalize"
                >
                  {linkLabel}
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
            ) : (
              ''
            )}
          </div>
          <div className={`${somestyle2}`}>
            <Image
              src={imageUrl}
              alt={alt}
              width={3080}
              height={1320}
              className="w-full object-cover"
              quality={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
