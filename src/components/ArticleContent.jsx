'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import SafeHtmlRenderer from './SafeHtmlRenderer';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import useLoadingState from '@/hooks/useLoadingState';
import { ArticleSkeleton } from './skeletons';

export default function ArticleContent({ articleId, onBack }) {
  const [article, setArticle] = useState(null);
  const { isLoading: loading, startLoading, stopLoading } = useLoadingState(true);
  const [error, setError] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    if (!articleId) return;

    async function fetchArticle() {
      try {
        startLoading();
        const res = await fetch(`/api/hostbill/get-article-by-id?id=${articleId}`, { method: 'GET' });
        if (!res.ok) {
          throw new Error(`Failed to fetch article: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setArticle(data.article);
        } else {
          throw new Error(data.error || 'Unknown API error');
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        stopLoading();
      }
    }

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return <ArticleSkeleton showBackButton={!!onBack} />;
  }

  if (error) {
    return <p className="text-failure">Error: {error}</p>;
  }

  if (!article) {
    return <p className="text-secondary/70">Article not found.</p>;
  }

  const langKey = locale === 'sv' ? '9' : '1';
  const title = article.tag_title?.[langKey] ?? article.title;
  const body = article.tag_body?.[langKey] ?? article.body;

  return (
    <div>
      {onBack && (
        <button onClick={onBack} className="text-accent font-semibold mb-2 flex items-center">
          <ChevronLeftIcon className="w-5 h-5" />
          Back
        </button>
      )}
      <h1 className="text-2xl font-bold text-secondary">{title}</h1>
      <div className="mt-4 text-secondary/80">
        <SafeHtmlRenderer html={body} />
      </div>
    </div>
  );
}