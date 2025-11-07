import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

// Helper to call HostBill API - now clean and secure.
async function callHostBill(payload) {
  const API_ID = process.env.HOSTBILL_API_ID;
  const API_KEY = process.env.HOSTBILL_API_KEY;
  const API_URL = process.env.HOSTBILL_API_ENDPOINT;
  const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10);

  const formData = new URLSearchParams();
  for (const [k, v] of Object.entries(payload)) {
    formData.append(k, String(v));
  }

  // The fetch call is now simple, without the 'agent' property.
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

export async function GET() {
  try {
    const startTime = Date.now();
    const cacheKey = 'kb:all-articles';
    const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10) || 3600; // 1 hour default

    // Try to get from Redis cache first
    try {
      if (redis && redis.status === 'ready') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return NextResponse.json(JSON.parse(cached), {
            headers: {
              'Cache-Control': `public, max-age=${process.env.BROWSER_CACHE_SECONDS || 300}, must-revalidate`,
              'X-Cache': 'HIT',
              'X-Cache-Time': (Date.now() - startTime).toString()
            }
          });
        }
      }
    } catch (cacheError) {
      console.warn('Redis cache read failed:', cacheError.message);
    }

    // The rest of your function logic remains the same.
    const categoriesResp = await callHostBill({
      call: 'getKBCategories',
      api_id: process.env.HOSTBILL_API_ID,
      api_key: process.env.HOSTBILL_API_KEY,
    });


    if (!categoriesResp.success || !Array.isArray(categoriesResp.categories.categories)) {
      throw new Error('Failed to fetch categories from HostBill');
    }

    const categories = categoriesResp.categories.categories;

    const articlePromises = categories.map(async (category) => {
      try {
        const articlesResp = await callHostBill({
          call: 'getKBCategoryArticles',
          api_id: process.env.HOSTBILL_API_ID,
          api_key: process.env.HOSTBILL_API_KEY,
          id: category.id,
        });
        
        if (articlesResp.success && Array.isArray(articlesResp.articles)) {
          // Fetch detailed article info for each article to get translations
          const detailedArticlePromises = articlesResp.articles.map(async (article) => {
            try {
              const detailResp = await callHostBill({
                call: 'getKBArticle',
                api_id: process.env.HOSTBILL_API_ID,
                api_key: process.env.HOSTBILL_API_KEY,
                id: article.id,
              });
              
              if (detailResp.success && detailResp.article) {
                // Return detailed article with translation data
                return detailResp.article;
              } else {
                // Fallback to basic article data if detailed fetch fails
                return article;
              }
            } catch (error) {
              console.error(`Failed to fetch detailed article ${article.id}:`, error);
              // Fallback to basic article data
              return article;
            }
          });
          
          category.articles = await Promise.all(detailedArticlePromises);
        } else {
          category.articles = [];
        }
        
        return category;
      } catch (error) {
        console.error(`Failed to fetch articles for category ${category.id}:`, error);
        category.articles = [];
        return category;
      }
    });

    const categoriesWithArticles = await Promise.all(articlePromises);

    const result = {
      success: true,
      categories: categoriesWithArticles,
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
        'Cache-Control': `public, max-age=${process.env.BROWSER_CACHE_SECONDS || 300}, must-revalidate`,
        'X-Cache': 'MISS',
        'X-Response-Time': (Date.now() - startTime).toString()
      }
    });
  } catch (err) {
    console.error('api/knowledge-base/get-all error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
