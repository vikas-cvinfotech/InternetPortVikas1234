import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { lazy, Suspense } from 'react';

// Lazy load icons to reduce initial bundle size
const AcademicCapIcon = lazy(() => import('@heroicons/react/20/solid').then(module => ({ default: module.AcademicCapIcon })));
const HandRaisedIcon = lazy(() => import('@heroicons/react/20/solid').then(module => ({ default: module.HandRaisedIcon })));
const RocketLaunchIcon = lazy(() => import('@heroicons/react/20/solid').then(module => ({ default: module.RocketLaunchIcon })));
const SparklesIcon = lazy(() => import('@heroicons/react/20/solid').then(module => ({ default: module.SparklesIcon })));
const SunIcon = lazy(() => import('@heroicons/react/20/solid').then(module => ({ default: module.SunIcon })));
const UserGroupIcon = lazy(() => import('@heroicons/react/20/solid').then(module => ({ default: module.UserGroupIcon })));

const values = [
  {
    nameKey: 'sustainable',
    descriptionKey: 'sustainableDescription',
    icon: SunIcon,
  },
  {
    nameKey: 'costEffective',
    descriptionKey: 'costEffectiveDescription',
    icon: RocketLaunchIcon,
  },
  {
    nameKey: 'committed',
    descriptionKey: 'committedDescription',
    icon: UserGroupIcon,
  },
  {
    nameKey: 'responsive',
    descriptionKey: 'responsiveDescription',
    icon: HandRaisedIcon,
  },
  {
    nameKey: 'curious',
    descriptionKey: 'curiousDescription',
    icon: AcademicCapIcon,
  },
  {
    nameKey: 'innovative',
    descriptionKey: 'innovativeDescription',
    icon: SparklesIcon,
  },
];

export default function AboutUsPage() {
  const t = useTranslations('aboutUs');

  return (
    <div className="bg-primary">
      <main className="relative isolate">
        {/* Background */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-4 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
            className="aspect-1108/632 w-[69.25rem] flex-none bg-gradient-to-r from-accent/20 to-info opacity-25"
          />
        </div>

        {/* Header section */}
        <div className="px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl pt-16 text-center sm:pt-24">
            <h1 className="text-5xl font-semibold tracking-tight text-secondary sm:text-7xl">
              {t('title')}
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-secondary sm:text-xl/8">
              {t('intro')}
            </p>
          </div>
        </div>

        {/* Content section */}
        <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 text-base/7 text-secondary lg:max-w-none lg:grid-cols-2">
              <div>
                <p>{t('mainContent1')}</p>
                <p className="mt-8">{t('mainContent2')}</p>
                <p className="mt-8">{t('mainContent3')}</p>
              </div>
              <div>
                <p>{t('mainContent4')}</p>
                <p className="mt-8">{t('mainContent5')}</p>
                <p className="mt-8">{t('mainContent6')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
          <Image
            alt=""
            src="https://internetportcom.b-cdn.net/se/img/moljen-hudiksvall.webp?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2894&q=80"
            width={2400}
            height={1067}
            className="aspect-9/4 w-full object-cover xl:rounded-3xl"
          />
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-secondary sm:text-5xl">
              {t('valuesTitle')}
            </h2>
            <p className="mt-6 text-lg/8 text-secondary">{t('valuesIntro')}</p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-secondary sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16">
            {values.map((value) => (
              <div key={value.nameKey} className="relative pl-9">
                <dt className="inline font-semibold text-secondary">
                  <Suspense fallback={
                    <div className="absolute top-1 left-1 size-5 bg-accent/10 rounded animate-pulse" />
                  }>
                    <value.icon
                      aria-hidden="true"
                      className="absolute top-1 left-1 size-5 text-accent"
                    />
                  </Suspense>
                  {t(`values.${value.nameKey}`)}
                </dt>{' '}
                <dd className="inline text-secondary">{t(`values.${value.descriptionKey}`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </div>
  );
}
