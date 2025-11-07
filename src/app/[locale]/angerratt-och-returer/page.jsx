'use client';
import { useTranslations } from 'next-intl';

export default function RightOfWithdrawalAndReturnsPage() {
  const t = useTranslations('rightOfWithdrawalAndReturns');

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

          {/* Content */}
          <div className="space-y-6">
            <p className="text-lg text-secondary/80 leading-relaxed">{t('paragraph1')}</p>
            <p className="text-secondary/80 leading-relaxed">{t('paragraph2')}</p>
            <p className="text-secondary/80 leading-relaxed">{t('paragraph3')}</p>
            <p className="text-secondary/80 leading-relaxed">{t('paragraph4')}</p>
            <p className="text-secondary/80 leading-relaxed">{t('paragraph5')}</p>
            <p className="text-secondary/80 leading-relaxed">{t('paragraph6')}</p>
            <p className="text-secondary/80 leading-relaxed">{t('paragraph7')}</p>
            <p className="text-secondary/80 leading-relaxed">{t('paragraph8')}</p>
            <p className="text-secondary/80 leading-relaxed">{t('paragraph9')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
