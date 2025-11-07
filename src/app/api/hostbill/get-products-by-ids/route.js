import { NextResponse } from 'next/server';
import { getProductsByIds } from '@/lib/hostbill-api';
import redis from '@/lib/redis';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  const languageId = searchParams.get('language_id');
  const categorySlug = searchParams.get('category');

  if (!idsParam) {
    return NextResponse.json(
      {
        success: false,
        error: 'Product IDs parameter is required (comma-separated)',
      },
      { status: 400 },
    );
  }

  try {
    const startTime = Date.now();

    // Parse comma-separated IDs
    const productIds = idsParam.split(',').map(id => id.trim()).filter(Boolean);

    if (productIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid product IDs provided',
        },
        { status: 400 },
      );
    }

    // Create cache key
    const sortedIds = [...productIds].sort().join(',');
    const cacheKey = `products:ids:${sortedIds}:${languageId || 'default'}`;
    const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10) || 3600;

    // Try Redis cache first
    try {
      if (redis && redis.status === 'ready') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const parsedCache = JSON.parse(cached);

          // Validate cached data has products before returning
          if (parsedCache.products && parsedCache.products.length > 0) {
            return NextResponse.json(parsedCache, {
              headers: {
                'Cache-Control': `public, max-age=${process.env.BROWSER_CACHE_SECONDS || 300}, must-revalidate`,
                'X-Cache': 'HIT',
                'X-Cache-Time': (Date.now() - startTime).toString()
              }
            });
          } else {
            // Invalid cache data - delete it and fetch fresh
            await redis.del(cacheKey);
          }
        }
      }
    } catch (cacheError) {
      console.warn('Redis cache read failed:', cacheError.message);
    }

    // Cache miss - fetch from HostBill
    const products = await getProductsByIds(productIds, languageId, categorySlug);

    const responseData = {
      success: true,
      products,
    };

    // Measure response size for caching decisions
    const responseSize = JSON.stringify(responseData).length;
    const fetchTime = Date.now() - startTime;

    // Store in Redis cache for server-side caching (only if we have products)
    try {
      if (redis && redis.status === 'ready') {
        // Only cache if we actually have products - prevents caching empty/error responses
        if (products && products.length > 0) {
          await redis.setex(cacheKey, cacheValiditySeconds, JSON.stringify(responseData));
        }
      }
    } catch (cacheError) {
      console.warn('Redis cache write failed:', cacheError.message);
    }

    // If response is under 2MB, enable caching; otherwise keep no-store
    const cacheControl = responseSize > 2097152
      ? 'no-store, max-age=0'
      : `public, max-age=${process.env.BROWSER_CACHE_SECONDS || 300}, must-revalidate`;

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': cacheControl,
        'X-Cache': 'MISS',
        'X-Response-Time': fetchTime.toString()
      }
    });
  } catch (error) {
    console.error('Failed to fetch products by IDs:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    console.error('Product IDs:', idsParam);
    console.error('Language ID:', languageId);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
