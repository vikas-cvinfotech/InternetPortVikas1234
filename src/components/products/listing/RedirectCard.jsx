'use client';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function RedirectCard({
  href,
  title,
  subtitle,
  categoryTitle,
  buttonLabel,
  icon,
  startingPrice,
  locale = 'sv',
  hideCategoryTitle = false,
}) {
  const t = useTranslations('listing.redirectCard');
  const tCommon = useTranslations('common');
  const resolvedHref = href || `/address-sok-bredband`;
  const resolvedTitle = title ?? t('title');
  const resolvedSubtitle = subtitle ?? t('subtitle');
  const resolvedCategoryTitle = categoryTitle ?? t('categoryTitle');
  const resolvedButtonLabel = buttonLabel ?? t('buttonLabel');

  return (
    <div className="group text-sm h-full flex flex-col">
      <Link href={resolvedHref} className="block flex-1 flex flex-col">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-secondary/5 group-hover:opacity-75 relative">
          <div className="flex h-full items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                {icon || (
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="10" cy="10" r="6" fill="currentColor" className="opacity-40" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-sm font-medium text-accent mb-2">{resolvedTitle}</h3>
              <p className="text-xs text-secondary/70">{resolvedSubtitle}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {!hideCategoryTitle && (
            <h3 className="text-sm text-secondary/70">{resolvedCategoryTitle}</h3>
          )}
          {startingPrice != null && startingPrice !== '' && (
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-lg font-medium text-secondary">{startingPrice}</p>
              <span className="text-xs text-secondary/60">{tCommon('inclVAT')}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
