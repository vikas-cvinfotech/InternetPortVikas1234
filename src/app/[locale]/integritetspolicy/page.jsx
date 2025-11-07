'use client';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacyPolicy');

  return (
    <div className="bg-primary min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <div className="bg-primary border border-divider rounded-2xl shadow-xl p-8 sm:p-12">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
              {t('title')}
            </h1>
            <div className="h-1 w-20 bg-accent rounded-full"></div>
          </header>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section1Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section1Paragraph1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section1Paragraph2')}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section2Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section2Paragraph1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section2Paragraph2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section2Paragraph3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section2Paragraph4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section2Paragraph5')}</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section3Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section3Paragraph1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section3Paragraph2')}</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section4Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section4Paragraph1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section4Paragraph2')}</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section5Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section5Paragraph1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section5Paragraph2')}</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-0">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section6Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section6Paragraph1')}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
