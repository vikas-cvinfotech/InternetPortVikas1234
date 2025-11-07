'use client';
import { useTranslations } from 'next-intl';

export default function ServiceSpecificTerms() {
  const t = useTranslations('serviceSpecificTerms');

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
              {t('s1.title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('s1.text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('s1.text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('s1.text3')}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('s2.title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('s2.text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('s2.text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('s2.text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('s2.text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('s2.text5')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('s2.text6')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('s2.text7')}</p>
            </div>
          </section>

          {/* Purchase Terms Section */}
          <section className="mb-0">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('purchaseTerms.title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('purchaseTerms.text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('purchaseTerms.text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('purchaseTerms.text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('purchaseTerms.text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('purchaseTerms.text5')}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}