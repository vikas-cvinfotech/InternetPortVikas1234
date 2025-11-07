import { NextResponse } from 'next/server';
import { loadInternationalRates, ensureRatesExist } from '@/lib/utils/internationalRates';
import redisClient from '@/lib/redis';

// Get cache TTLs from environment variables
const REDIS_CACHE_TTL = parseInt(process.env.MOR_RATES_REDIS_CACHE_TTL || '0', 10);
const BROWSER_CACHE_TTL = parseInt(process.env.MOR_RATES_BROWSER_CACHE_TTL || '0', 10);

export async function GET(request) {
  try {
    // Get locale from query params
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'sv';
    const cacheKey = `mor:rates:${locale}`;

    let rates = null;
    let fromCache = false;

    // Try to get from Redis cache if caching is enabled
    if (REDIS_CACHE_TTL > 0) {
      try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          rates = JSON.parse(cachedData);
          fromCache = true;
          console.log(`MOR rates served from Redis cache for locale: ${locale}`);
        }
      } catch (redisError) {
        console.warn('Redis cache read failed, falling back to file system:', redisError.message);
      }
    }

    // If not in cache, load from file system
    if (!rates) {
      // Ensure rates exist (will sync if missing)
      await ensureRatesExist();

      // Load rates for the requested locale
      rates = await loadInternationalRates(locale);

      // Store in Redis cache if caching is enabled
      if (REDIS_CACHE_TTL > 0) {
        try {
          await redisClient.setex(cacheKey, REDIS_CACHE_TTL, JSON.stringify(rates));
          console.log(`MOR rates cached in Redis for ${REDIS_CACHE_TTL}s, locale: ${locale}`);
        } catch (redisError) {
          console.warn('Redis cache write failed:', redisError.message);
        }
      }
    }

    // Create response with data
    const response = NextResponse.json({
      success: true,
      rates,
      locale,
      cached: fromCache,
    });

    // Set browser cache headers (private = no CDN caching)
    if (BROWSER_CACHE_TTL > 0) {
      response.headers.set('Cache-Control', `private, max-age=${BROWSER_CACHE_TTL}, must-revalidate`);
    } else {
      // Disable caching when TTL is 0
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    return response;
  } catch (error) {
    console.error('Error fetching international rates:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        rates: [],
      },
      { status: 500 }
    );
  }
}
