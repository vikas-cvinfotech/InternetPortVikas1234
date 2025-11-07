import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(request) {
  try {
    const startTime = Date.now();
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const API_ID = process.env.HOSTBILL_API_ID;
    const API_KEY = process.env.HOSTBILL_API_KEY;
    const API_URL = process.env.HOSTBILL_API_ENDPOINT;
    const cacheKey = `kb:category:${id}`;
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

    // Helper to call HostBill
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

    // 1) Fetch article stubs by category
    const listResp = await callHostBill({
      call: 'getKBCategoryArticles',
      api_id: API_ID,
      api_key: API_KEY,
      id: id,
    });

    if (!listResp.success || !Array.isArray(listResp.articles) || listResp.articles.length === 0) {
      throw new Error('getKBCategoryArticles returned no articles');
    }

    // 2) For each stub, fetch the full article (to get slug, localized fields, etc.)
    const detailedArticles = [];
    for (const stub of listResp.articles) {
      try {
        const detailResp = await callHostBill({
          call: 'getKBArticle',
          api_id: API_ID,
          api_key: API_KEY,
          id: stub.id,
        });

        if (detailResp.success && detailResp.article) {
          detailedArticles.push(detailResp.article);
        } else {
          console.warn(`No detail for article ID ${stub.id}`);
        }
      } catch (detailErr) {
        console.warn(`Error fetching detail for ID ${stub.id}: ${detailErr}`);
      }
    }

    // 3) Return enriched list
    const result = {
      success: true,
      articles: detailedArticles,
      count: detailedArticles.length,
      call: 'getKBCategoryArticles+getKBArticle',
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
    console.error('api/get-articles-by-category error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
