import { useTranslations } from 'next-intl';

export default function NotFoundSection() {
  const t = useTranslations('notFoundSection');

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="grid min-h-full place-items-center bg-primary px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-accent">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-secondary sm:text-7xl">
            {t('pageNotFound')}
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-secondary sm:text-xl/8">
            {t('description')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-primary shadow-xs hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('goBackHome')}
            </a>
            <a
              href="/kontakta-oss"
              className="text-sm font-semibold text-secondary hover:text-accent"
            >
              {t('contactSupport')} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
