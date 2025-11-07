import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/hostbill-api';
import redis from '@/lib/redis';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('id');
  const languageId = searchParams.get('language_id');

  if (!productId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Product ID parameter is required',
      },
      { status: 400 },
    );
  }

  try {
    const startTime = Date.now();
    const cacheKey = `product:${productId}:${languageId || 'default'}`;
    const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10) || 3600;

    // Try Redis cache first
    try {
      if (redis && redis.status === 'ready') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          return NextResponse.json(parsedCache, {
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

    // Cache miss - fetch from HostBill
    const product = await getProduct(productId, languageId);

    const responseData = {
      success: true,
      product,
    };

    // Measure response size for caching decisions
    const responseSize = JSON.stringify(responseData).length;
    const fetchTime = Date.now() - startTime;

    // Store in Redis cache for server-side caching
    try {
      if (redis && redis.status === 'ready') {
        await redis.setex(cacheKey, cacheValiditySeconds, JSON.stringify(responseData));
      }
    } catch (cacheError) {
      console.warn('Redis cache write failed:', cacheError.message);
    }

    // If response is under 2MB, enable caching; otherwise keep no-store
    const cacheControl = responseSize > 2097152
      ? 'no-store, max-age=0'
      : `public, max-age=300, must-revalidate`;

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache': 'MISS',
        'X-Response-Time': fetchTime.toString()
      }
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    console.error('Product ID:', productId);
    console.error('Language ID:', languageId);
    console.error('Error details:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch product',
      },
      { status: 500 },
    );
  }
}
