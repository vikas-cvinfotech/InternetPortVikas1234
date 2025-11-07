'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function KnowledgeBaseButton() {
  const t = useTranslations('knowledgeBase');
  return (
    <div className="text-center py-12">
      <Link
        href="/kunskapsbas"
        className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded hover:bg-secondary/20"
      >
        {t('noResultsLink')}
      </Link>
    </div>
  );
}
