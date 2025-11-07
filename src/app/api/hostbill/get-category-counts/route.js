import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/hostbill-api';
import redis from '@/lib/redis';

export async function GET() {
  try {
    const startTime = Date.now();
    const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10) || 3600;
    const cacheKey = 'category-counts';

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

    const categories = ['vpn', 'bredband', 'telefoni'];
    const categoryCounts = {};

    for (const category of categories) {
      try {
        const products = await getProductsByCategory(category);
        const realProducts = products.filter((product) => product.type !== 'redirect');
        categoryCounts[category] = realProducts.length;
      } catch (error) {
        console.error(`Failed to get products for category ${category}:`, error);
        categoryCounts[category] = 0;
      }
    }

    const result = {
      success: true,
      categoryCounts,
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
  } catch (error) {
    console.error('Failed to fetch category counts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category counts',
      },
      { status: 500 },
    );
  }
}
