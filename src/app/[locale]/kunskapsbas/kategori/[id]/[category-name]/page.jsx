'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SearchArticles from '@/components/SearchArticles';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/LoadingSpinner';
import KnowledgeBaseButton from '@/components/KnowledgeBaseButton';
import ArticleListSkeleton from '@/components/skeletons/ArticleListSkeleton';
import LoadingWrapper from '@/components/LoadingWrapper';

export default function CategoryKBArticlesPage() {
  const t = useTranslations('knowledgeBase');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const params = useParams();
  const rawId = params.id;
  const rawCategoryName = params['category-name'];
  const langKey = locale === 'sv' ? '9' : '1';
  const id = Number(rawId);
  const categoryName = decodeURIComponent(rawCategoryName || '').replace(/^\w/, (c) =>
    c.toUpperCase(),
  );
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isNaN(id)) {
      setLoading(false);
      return;
    }
    async function fetchArticles() {
      try {
        const res = await fetch('/api/hostbill/get-articles-by-category-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
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

    if (id) fetchArticles();
  }, [id]);

  const emptyContent = (
    <div className="text-center py-12">
      <p className="mb-4 text-secondary">
        {t('noResultsCategory', { id: <strong>{id}</strong> })}
      </p>
      <KnowledgeBaseButton />
    </div>
  );

  return (
    <LoadingWrapper
      isLoading={loading}
      skeleton={<ArticleListSkeleton count={10} />}
      isEmpty={articles.length === 0}
      empty={emptyContent}
    >
    <div className="container mx-auto p-6 bg-primary">
      <div className="mb-12">
        <SearchArticles />
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-12 text-secondary">{categoryName}</h2>
        <h3 className="text-xl font-semibold text-secondary">
          {t('results', { count: articles.length })}
        </h3>
        <ul className="space-y-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="p-4 border border-divider rounded hover:shadow-sm transition"
            >
              <a
                href={`/kunskapsbas/artikel/${article.id}/${article.tag_url[langKey]}`}
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
    </div>
    </LoadingWrapper>
  );
}
