'use client';

import { useTranslations } from 'next-intl';

export default function CookiesPolicyPage() {
  const t = useTranslations('cookiesPolicy');

  return (
    <div className="bg-primary min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <div className="bg-primary border border-divider rounded-2xl shadow-xl p-8 sm:p-12">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              {t('cookiesTitle')}
            </h1>
            <div className="h-1 w-20 bg-accent rounded-full"></div>
          </header>

          {/* Section 1 - What are Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('whatAreCookiesTitle')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('whatAreCookiesText1')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-secondary/80">
                <li className="leading-relaxed">{t('whatAreCookiesList1')}</li>
                <li className="leading-relaxed">{t('whatAreCookiesList2')}</li>
              </ul>
            </div>
          </section>

          {/* Section 2 - How are Cookies Used */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('howAreCookiesUsedTitle')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('howAreCookiesUsedText1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('howAreCookiesUsedText2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('howAreCookiesUsedText3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('howAreCookiesUsedText4')}</p>
              <div className="bg-accent/10 rounded-xl p-4 border-l-4 border-accent">
                <p className="text-secondary font-semibold leading-relaxed">{t('howAreCookiesUsedText5')}</p>
              </div>
            </div>
          </section>

          {/* Section 3 - How to Delete Cookies */}
          <section className="mb-0">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('howToDeleteCookiesTitle')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('howToDeleteCookiesText1')}</p>
              <p className="text-secondary/80 leading-relaxed">
                {t('howToDeleteCookiesText2')}
                <span className="font-mono bg-secondary/10 px-2 py-1 rounded text-secondary mx-1">{t('shortcut')}</span>
                {t('howToDeleteCookiesText3')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
