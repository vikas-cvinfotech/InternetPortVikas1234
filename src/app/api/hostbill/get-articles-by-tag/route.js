import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(request) {
  try {
    const startTime = Date.now();
    const { tag } = await request.json();
    if (!tag) {
      return NextResponse.json({ error: 'Missing tag' }, { status: 400 });
    }

    // HostBill credentials and endpoint from env.
    const API_ID = process.env.HOSTBILL_API_ID;
    const API_KEY = process.env.HOSTBILL_API_KEY;
    const API_URL = process.env.HOSTBILL_API_ENDPOINT;
    const cacheKey = `kb:tag:${tag}`;
    const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10) || 3600;

    // Try to get from Redis cache first
    try {
      if (redis && redis.status === 'ready') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return NextResponse.json(JSON.parse(cached), {
            headers: {
              'Cache-Control': `public, max-age=300, must-revalidate`,
              'X-Cache': 'HIT',
              'X-Cache-Time': (Date.now() - startTime).toString()
            }
          });
        }
      }
    } catch (cacheError) {
      console.warn('Redis cache read failed:', cacheError.message);
    }

    // Helper to call HostBill.
    async function callHostBill(payload) {
      const formData = new URLSearchParams();
      for (const [k, v] of Object.entries(payload)) {
        formData.append(k, String(v));
      }

      const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        next: { revalidate: cacheValiditySeconds },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HostBill error: ${res.status} ${text}`);
      }
      return res.json();
    }

    // 1) Try to fetch articles by tag first
    let articleStubs = [];
    try {
      const listResp = await callHostBill({
        call: 'getKBArticlesByTags',
        api_id: API_ID,
        api_key: API_KEY,
        tag,
      });

      if (listResp.success && Array.isArray(listResp.articles) && listResp.articles.length > 0) {
        articleStubs = listResp.articles;
      }
    } catch (tagError) {
      console.warn('Tag-based search failed, will try content-based search:', tagError.message);
    }

    // 2) If no articles found by tag, fall back to content-based search
    if (articleStubs.length === 0) {
      try {
        // Get all articles first
        const allArticlesResp = await callHostBill({
          call: 'getKBCategories',
          api_id: API_ID,
          api_key: API_KEY,
        });

        if (allArticlesResp.success && allArticlesResp.categories?.categories) {
          const searchTerm = tag.toLowerCase();

          // Search through all categories and articles
          for (const category of allArticlesResp.categories.categories) {
            const categoryArticlesResp = await callHostBill({
              call: 'getKBCategoryArticles',
              api_id: API_ID,
              api_key: API_KEY,
              id: category.id,
            });

            if (categoryArticlesResp.success && categoryArticlesResp.articles) {
              for (const article of categoryArticlesResp.articles) {
                // Check if title or content contains the search term
                const titleMatch = article.title?.toLowerCase().includes(searchTerm);
                const contentMatch = article.content?.toLowerCase().includes(searchTerm);

                if (titleMatch || contentMatch) {
                  articleStubs.push(article);
                }
              }
            }
          }
        }
      } catch (contentError) {
        console.warn('Content-based search failed:', contentError.message);
      }
    }

    if (articleStubs.length === 0) {
      throw new Error(`No articles found for "${tag}" using tag or content search`);
    }

    // 3) For each stub, fetch the full article.
    const detailedArticles = [];
    for (const stub of articleStubs) {
      const detailResp = await callHostBill({
        call: 'getKBArticle',
        api_id: API_ID,
        api_key: API_KEY,
        id: stub.id,
      });

      if (detailResp.success && detailResp.article) {
        detailedArticles.push(detailResp.article);
      } else {
        console.warn(`Failed to fetch details for article ID ${stub.id}`);
      }
    }

    // 3) Return the enriched array.
    const result = {
      success: true,
      articles: detailedArticles,
      count: detailedArticles.length,
      call: 'getKBArticlesByTags+getKBArticle',
      server_time: Math.floor(Date.now() / 1000),
    };

    // Store in Redis cache
    try {
      if (redis && redis.status === 'ready') {
        await redis.setex(cacheKey, cacheValiditySeconds, JSON.stringify(result));
      }
    } catch (cacheError) {
      console.warn('Redis cache write failed:', cacheError.message);
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, max-age=300, must-revalidate`,
        'X-Cache': 'MISS',
        'X-Response-Time': (Date.now() - startTime).toString()
      }
    });
  } catch (err) {
    console.error('api/get-articles-by-tag error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
