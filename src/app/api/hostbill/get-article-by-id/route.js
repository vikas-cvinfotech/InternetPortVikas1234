import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET(request) {
  try {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const API_ID = process.env.HOSTBILL_API_ID;
    const API_KEY = process.env.HOSTBILL_API_KEY;
    const API_URL = process.env.HOSTBILL_API_ENDPOINT;
    const cacheKey = `kb:article:${id}`;
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

    const detailResp = await callHostBill({
      call: 'getKBArticle',
      api_id: API_ID,
      api_key: API_KEY,
      id,
    });

    if (!detailResp.success || !detailResp.article) {
      return NextResponse.json({ error: 'Article not found or API error' }, { status: 404 });
    }

    const result = {
      success: true,
      article: detailResp.article,
      call: 'getKBArticle',
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
    console.error('api/get-article-by-id error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
