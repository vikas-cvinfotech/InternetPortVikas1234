import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function CareerPage() {
  const t = useTranslations('career');

  return (
    <div className="relative bg-primary">
      <div className="mx-auto max-w-7xl lg:flex lg:justify-between lg:px-8 xl:justify-end">
        <div className="lg:flex lg:w-1/2 lg:shrink lg:grow-0 xl:absolute xl:inset-y-0 xl:right-1/2 xl:w-1/2">
          <div className="relative h-80 lg:-ml-8 lg:h-auto lg:w-full lg:grow xl:ml-0">
            <Image
              alt={t('imageAlt')}
              src="https://internetportcom.b-cdn.net/se/img/leende-man-mote.webp?w=2560&h=3413&q=80"
              fill
              className="bg-secondary/5 object-cover object-top md:object-[50%_20%] lg:object-center"
            />
          </div>
        </div>
        <div className="px-6 lg:contents">
          <div className="mx-auto max-w-2xl pt-16 pb-24 sm:pt-20 sm:pb-32 lg:mr-0 lg:ml-8 lg:w-full lg:max-w-lg lg:flex-none lg:pt-32 xl:w-1/2">
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-secondary sm:text-5xl">
              {t('careerTitle')}
            </h1>
            <div className="mt-10 max-w-xl text-base/7 text-secondary lg:max-w-none">
              <h2 className="text-2xl font-bold tracking-tight text-secondary">
                {t('workingAtInternetportTitle')}
              </h2>
              <p className="mt-6">{t('workingAtInternetportPara1')}</p>
              <p className="mt-6">{t('workingAtInternetportPara2')}</p>

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-secondary">
                {t('attractiveEmployerTitle')}
              </h2>
              <p className="mt-6">{t('attractiveEmployerPara1')}</p>
              <p className="mt-6">{t('attractiveEmployerPara2')}</p>

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-secondary">
                {t('livingInHudiksvallTitle')}
              </h2>
              <p className="mt-6">{t('livingInHudiksvallPara')}</p>

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-secondary">
                {t('workWithUsTitle')}
              </h2>
              <p className="mt-6">
                {t('workWithUsPara')}{' '}
                <a href="mailto:jobb@internetport.se" className="text-accent hover:opacity-75">
                  {t('email')}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
