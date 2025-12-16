import Image from 'next/image';
import Link from 'next/link';
import { renderDesc } from './renderDescription/renderDesc';

export default function CommonBanner({
  imageAlt,
  imageSrc,
  titlePart1,
  desc,
  link,
  linkLabel,
  objectfit,
}) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-full">
        <div className="relative shadow-xl ">
          <div className="relative h-[600px] 3xl:h-[750px]">
            <Image
              alt={imageAlt}
              src={imageSrc}
              fill
              className={`${objectfit ? objectfit : 'w-full h-full object-cover'}`}
              quality={100}
              priority
            />
            <div className="absolute inset-0 mix-blend-multiply h-full" />
          </div>
          <div className="absolute px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <div className="flex justify-center items-center flex-col gap-8">
              <h1 className="text-4xl font-semibold text-center sm:text-5xl lg:text-6xl">
                <span className="text-primary">{titlePart1}</span>
              </h1>
              <div className="text-base text-primary">{renderDesc(desc)}</div>
              <div>
                <Link
                  href={link}
                  className="rounded-[4px] w-auto bg-accent hover:bg-hoveraccent px-4 py-4 mt-0 text-sm font-semibold text-primary shadow-xs inline-flex items-center gap-2 capitalize"
                  target="_blank"
                >
                  {linkLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
