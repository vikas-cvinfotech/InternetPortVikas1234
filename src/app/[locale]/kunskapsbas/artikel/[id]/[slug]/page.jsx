'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
// Import DOMPurify dynamically to avoid SSR issues
import SearchArticles from '@/components/SearchArticles';
import { ArticleSkeleton } from '@/components/skeletons';
import LoadingWrapper from '@/components/LoadingWrapper';
import KnowledgeBaseButton from '@/components/KnowledgeBaseButton';

export default function KBArticlePage() {
  const t = useTranslations('knowledgeBase');
  const commonT = useTranslations('common');
  const locale = useLocale();

  // Get language key from environment variables
  const getLangKey = (currentLocale) => {
    switch (currentLocale) {
      case 'sv':
        return process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_SV || '9';
      case 'en':
        return process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_EN || '2';
      default:
        return process.env.NEXT_PUBLIC_HOSTBILL_LANG_KEY_SV || '9'; // Default to Swedish
    }
  };

  const langKey = getLangKey(locale);
  const { id: rawId } = useParams();
  const id = Number(rawId);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hostbill/get-article-by-id?id=${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setArticle(json.article ?? null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const title = article?.tag_title?.[langKey] ?? article?.title ?? '';
  const body = article?.tag_body?.[langKey] ?? article?.body ?? '';

  // Simple HTML sanitization function
  const sanitizeHTML = (html) => {
    if (typeof window === 'undefined') return html; // Server-side: return as-is

    // Client-side: use browser's built-in DOMParser for basic sanitization
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.innerHTML;
  };

  const loadingSkeleton = (
    <div className="container mx-auto p-6 bg-primary">
      <div className="mt-8">
        <SearchArticles />
      </div>
      <section className="bg-primary px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-secondary">
          <ArticleSkeleton />
        </div>
      </section>
    </div>
  );

  const errorContent = (
    <div className="flex items-center justify-center h-64">
      <p className="text-failure font-medium">{error}</p>
    </div>
  );

  const notFoundContent = (
    <div className="flex items-center justify-center h-64">
      <p className="text-secondary/75">{t('notFound')}</p>
    </div>
  );

  return (
    <LoadingWrapper
      isLoading={loading}
      skeleton={loadingSkeleton}
      hasError={!!error}
      error={errorContent}
      isEmpty={!article && !loading && !error}
      empty={notFoundContent}
    >
      <div className="container mx-auto p-6 bg-primary">
        <div className="mt-8">
          <SearchArticles />
        </div>
        <section className="bg-primary px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-secondary">
            <h1 className="mt-1 text-4xl font-semibold tracking-tight text-secondary sm:text-5xl">
              {title}
            </h1>

            <div
              className="mt-6 prose prose-accent prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(body),
              }}
            ></div>
          </div>
          <KnowledgeBaseButton />
        </section>
      </div>
    </LoadingWrapper>
  );
}
