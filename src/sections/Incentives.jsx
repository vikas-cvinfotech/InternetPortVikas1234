import { useTranslations } from 'next-intl';
import {
  GlobeAltIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';

export default function Incentives() {
  const t = useTranslations('incentives');

  const incentives = [
    {
      name: t('flexibleContractFreePlans.name'),
      icon: ClipboardDocumentListIcon,
      description: t('flexibleContractFreePlans.description'),
    },
    {
      name: t('reliableAndHighSpeedConnectivity.name'),
      icon: GlobeAltIcon,
      description: t('reliableAndHighSpeedConnectivity.description'),
    },
    {
      name: t('localSupportYouCanTrust.name'),
      icon: ChatBubbleOvalLeftEllipsisIcon,
      description: t('localSupportYouCanTrust.description'),
    },
  ];

  return (
    <div className="relative">
      <div className="mx-auto max-w-full py-16 sm:py-16 lg:py-24 sm:pl-2 sm:py-32 lg:pl-0">
        <div className="mx-auto max-w-full  lg:max-w-none">
          <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2 px-4 lg:pl-[50px] xl:pl-[80px] xxl:pl-[135px] ">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#4F4F4F]">
                <span className="text-accent">{t('simpleFast')}</span> {t('discoverNewEra')} <br />{' '}
                {t('broadband')}
              </h2>
              <p className="text-lg mt-[20px] lg:mt-[30px] text-[#4F4F4F] lg:pr-[30px]">
                {t('sayGoodbye')} {t('introText1')} {t('broadbandSimple')} {t('introText2')}{' '}
                {t('streamWorkConnect')} {t('introText3')} {t('reliableNetwork')} {t('introText4')}{' '}
                {t('smootherExperience')}, {t('introText5')} {t('topTierPerformance')}{' '}
                {t('introText6')} {t('supportYouCanTrust')}.
              </p>
            </div>
            <Image
              alt=""
              src="https://internetportcom.b-cdn.net/se/img/broadband.webp"
              width={600}
              height={400}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-3/2 w-full bg-primary/10 object-cover"
            />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 px-4 sm:px-[50px] xl:px-[80px] xxl:px-[135px]">
            {incentives.map((incentive) => (
              <div key={incentive.name} className="sm:flex lg:block">
                <div className="sm:shrink-0">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary shadow-[0px_6px_14px_0px_#0000001A]">
                    <incentive.icon className="size-8 text-[#4F4F4F]" />
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                  <h3 className="text-normal font-bold text-[#1D1D1D]">{incentive.name}</h3>
                  <p className="mt-2 text-normal text-[#4F4F4F]">{incentive.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[100%] z-[-1]">
        <span className="sr-only">Cruve background image</span>
        <Image
          alt="Cruve background image"
          src="https://internetportcom.b-cdn.net/se/img/broadbandbackup.webp"
          className="w-full h-full"
          width={1200}
          height={600}
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={95}
          priority
        />
      </div>
    </div>
  );
}
