'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SearchArticles from '@/components/SearchArticles';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import ArticleListSkeleton from '@/components/skeletons/ArticleListSkeleton';
import KnowledgeBaseButton from '@/components/KnowledgeBaseButton';

export default function SearchResultsPage() {
  const t = useTranslations('knowledgeBase');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const { tag: rawTag } = useParams();
  const langKey = locale === 'sv' ? '9' : '1';
  const tag = decodeURIComponent(rawTag || '');

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/hostbill/get-articles-by-tag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Expected JSON but got ${contentType}: ${text.substring(0, 100)}`);
        }

        const json = await res.json();
        setArticles(Array.isArray(json.articles) ? json.articles : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [tag]);

  if (loading) {
    return <ArticleListSkeleton count={8} />;
  }

  return (
    <div className="container mx-auto p-6 bg-primary">
      <div className="mb-12">
        <SearchArticles />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4 text-secondary">
            {t('noResults')} <strong>"{tag}"</strong>.
          </p>
          <KnowledgeBaseButton />
        </div>
      ) : (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary">
            {t('results', { count: articles.length })} <bold>"{tag}"</bold>
          </h3>
          <ul className="space-y-3">
            {articles.map((article) => (
              <li
                key={article.id}
                className="p-4 border border-divider rounded hover:shadow-sm transition"
              >
                <a
                  href={`/kunskapsbas/artikel/${article.id}/${article.tag_slug[langKey]}`}
                  className="flex items-center space-x-3 text-lg font-medium text-secondary hover:underline"
                >
                  <DocumentTextIcon className="h-6 w-6 text-secondary/75 flex-shrink-0" />
                  <span>{article.tag_title[langKey]}</span>
                </a>
              </li>
            ))}
          </ul>
          <KnowledgeBaseButton />
        </section>
      )}
    </div>
  );
}
