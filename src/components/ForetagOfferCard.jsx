import Link from 'next/link';
import Image from 'next/image';

export default function ForetagOfferCard({ title, link, linkLabel, icon, image, alt }) {
  return (
    <div className="borderbottomeffect z-[4]">
      <div className="relative overflow-hidden rounded-lg h-full">
        <div className="px-[30px] py-[30px] md:py-[60px] lg:py-[30px] xxl:py-[60px] flex flex-col justify-between h-full relative z-[2] ">
          <div className="flex flex-col gap-8">
            <div>{icon}</div>
            <h2 className="text-primary text-2xl font-bold capitalize">{title}</h2>
          </div>

          <div className="mt-8">
            <Link
              href={link}
              className="rounded-[4px] w-auto bg-primary hover:bg-hoveraccent px-8 py-2.5 text-sm font-semibold text-accent hover:text-primary shadow-xs inline-flex items-center gap-2 capitalize"
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
        </div>

        <div className="absolute inset-0 w-full z-[0]">
          <span className="sr-only">{alt}</span>
          <Image
            alt={alt}
            src={image}
            className="w-full h-full object-cover"
            fill
            quality={100}
            priority
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-mediumBlack" />
      </div>
    </div>
  );
}
