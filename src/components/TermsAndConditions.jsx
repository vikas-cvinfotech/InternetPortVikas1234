'use client';
import { useTranslations } from 'next-intl';

export default function TermsAndConditions() {
  const t = useTranslations('termsAndConditions');

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

          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-secondary/5 rounded-xl p-6 border-l-4 border-accent">
              <p className="text-lg text-secondary/80 leading-relaxed mb-4">{t('introduction')}</p>
              <p className="text-lg text-secondary/80 leading-relaxed">{t('privacy')}</p>
            </div>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section1Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section1Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section1Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section1Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section1Text4')}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section2Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section2Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section2Text2')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-secondary/80">
                <li className="leading-relaxed">{t('section2List1')}</li>
                <li className="leading-relaxed">{t('section2List2')}</li>
                <li className="leading-relaxed">{t('section2List3')}</li>
              </ul>
              <p className="text-secondary/80 leading-relaxed">{t('section2Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section2Text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section2Text5')}</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section3Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section3Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section3Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section3Text3')}</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section4Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section4Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section4Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section4Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section4Text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section4Text5')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section4Text6')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section4Text7')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section4Text8')}</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section5Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section5Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section5Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section5Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section5Text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section5Text5')}</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section6Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section6Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section6Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section6Text3')}</p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section7Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section7Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section7Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section7Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section7Text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section7Text5')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section7Text6')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section7Text7')}</p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section8Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section8Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text5')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text6')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text7')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text8')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text9')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text10')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text11')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section8Text12')}</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section9Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section9Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section9Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section9Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section9Text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section9Text5')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section9Text6')}</p>
            </div>
          </section>

          {/* Section 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section10Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section10Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section10Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section10Text3')}</p>
            </div>
          </section>

          {/* Section 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section11Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section11Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section11Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section11Text3')}</p>
            </div>
          </section>

          {/* Section 12 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section12Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section12Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text5')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text6')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text7')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text8')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text9')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section12Text10')}</p>
            </div>
          </section>

          {/* Section 13 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section13Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section13Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section13Text2')}</p>
            </div>
          </section>

          {/* Section 14 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section14Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section14Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section14Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section14Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section14Text4')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section14Text5')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section14Text6')}</p>
            </div>
          </section>

          {/* Section 15 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section15Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section15Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section15Text2')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section15Text3')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section15Text4')}</p>
            </div>
          </section>

          {/* Section 16 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section16Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section16Text1')}</p>
            </div>
          </section>

          {/* Section 17 */}
          <section className="mb-0">
            <h2 className="text-2xl font-semibold text-secondary mb-6 flex items-center">
              <span className="w-2 h-8 bg-accent mr-4 rounded-full flex-shrink-0"></span>
              {t('section17Title')}
            </h2>
            <div className="ml-6 space-y-4">
              <p className="text-secondary/80 leading-relaxed">{t('section17Text1')}</p>
              <p className="text-secondary/80 leading-relaxed">{t('section17Text2')}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}