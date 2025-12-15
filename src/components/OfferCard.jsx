'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const OfferCard = ({
  title,
  offerData,
  bgImage,
  gridColClass,
  zIndex,
  border,
  paddb,
  paddX,
  addClass,
}) => {
  const t = useTranslations('featureFourColumns');

  return (
    <div className="relative">
      <div
        className={`px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px] py-24 ${
          bgImage
            ? 'border border-solid border-l-0 border-r-0 border-borderGray'
            : 'pt-[20px] relative z-[1]'
        }  
      ${zIndex ? 'relative z-[2]' : ''}
      ${
        border === false
          ? 'border-0'
          : 'border border-solid border-l-0 border-r-0 border-borderGray'
      }
      ${paddb ? paddb : ''} 
      `}
      >
        {title && <h2 className="text-[32px] text-center font-bold mb-[60px] mt-1">{title}</h2>}
        <div className="mx-auto">
          <dl
            className={`grid grid-cols-1 ${
              gridColClass && gridColClass
            } gap-y-12 lg:gap-y-10 lg:max-w-none relative z-[1] ${paddX ? 'gap-[30]' : ''}`}
          >
            {offerData &&
              offerData.map((feature, idx) => (
                <div
                  key={idx}
                  className={`borderbottomeffect ${paddX ? paddX : 'px-[14px]'} ${
                    addClass && addClass
                  }`}
                >
                  <div className="block flex flex-col border shadow-darkShadow rounded-lg p-6 bg-primary border-borderGray h-full">
                    <dt className="text-2xl/7 font-semibold text-secondary">
                      {typeof feature.icon === 'string' ? (
                        <div
                          className="mb-7 rounded-md inline-flex items-center bg-surfaceSecondary p-5"
                          dangerouslySetInnerHTML={{ __html: feature.icon }}
                        ></div>
                      ) : (
                        <div className="mb-7 rounded-md inline-flex items-center bg-surfaceSecondary p-5">
                          {feature.icon}
                        </div>
                      )}
                      <div className="capitalize">{feature.name}</div>
                    </dt>
                    <dd className="mt-4 flex flex-col flex-grow text-base/7 text-secondary">
                      <p className="flex-grow">{feature.description}</p>
                      {feature.href && (
                        <p className="mt-6">
                          <Link
                            href={feature.href}
                            className="text-base font-semibold text-accent hover:text-hoveraccent uppercase"
                          >
                            {feature.linkLabel} <span aria-hidden="true">→</span>
                          </Link>
                        </p>
                      )}
                    </dd>
                  </div>
                </div>
              ))}
          </dl>
        </div>
      </div>
      {bgImage && (
        <div
          className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100%] ${
            zIndex ? zIndex : 'z-[-2]'
          } `}
        >
          <span className="sr-only">kross-transparent-bakgrund</span>
          <Image
            alt="kross-transparent-bakgrund"
            src={bgImage}
            className="w-full h-full"
            width={1200}
            height={600}
            quality={100}
            priority
          />
        </div>
      )}
    </div>
  );
};

export default OfferCard;
