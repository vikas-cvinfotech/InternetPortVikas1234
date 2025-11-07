import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(req) {
  try {
    const startTime = Date.now();
    const requestBody = await req.json();

    // Validate that the request body exists and contains an 'id'.
    if (!requestBody || typeof requestBody !== 'object' || !requestBody.id) {
      return NextResponse.json(
        { error: "Invalid request body. JSON object with 'id' property expected." },
        { status: 400 },
      );
    }

    const addressId = String(requestBody.id);

    const apiKey = process.env.API_INTERNETPORT_SE_X_AUTH_KEY;
    if (!apiKey) {
      console.error('API_INTERNETPORT_SE_X_AUTH_KEY environment variable is not set.');
      return NextResponse.json(
        { error: 'Server configuration error. API key missing.' },
        { status: 500 },
      );
    }

    const externalApiUrl = process.env.API_INTERNETPORT_SE_ENDPOINT;

    const cacheValiditySeconds = parseInt(process.env.CACHE_VALIDITY_SECONDS, 10);

    // Construct the body for the external API call
    const externalApiBody = {
      call: 'getAddressById',
      id: addressId,
    };

    // Create cache key based on address ID
    const cacheKey = `address:${addressId}`;

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

    // PERFORMANCE FIX: Add 10-second timeout to prevent 27+ second LCP delays
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), 10000); // 10 second timeout

    const externalApiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-App-Key': apiKey,
      },
      body: JSON.stringify(externalApiBody),
      next: { revalidate: cacheValiditySeconds },
      signal: timeoutController.signal,
    });

    clearTimeout(timeoutId);

    if (!externalApiResponse.ok) {
      let errorDetails = {
        message: `External API request (getAddressById) failed with status ${externalApiResponse.status}`,
      };
      try {
        const externalErrorBody = await externalApiResponse.json();
        errorDetails = { ...errorDetails, ...externalErrorBody };
      } catch (parseError) {
        const errorText = await externalApiResponse.text();
        errorDetails.rawResponse =
          errorText || 'No additional error information from external API.';
      }
      console.error('External API error (getAddressById):', errorDetails);
      return NextResponse.json(
        { error: 'Failed to fetch address details from external service.', details: errorDetails },
        { status: externalApiResponse.status },
      );
    }

    const data = await externalApiResponse.json();

    // Store in Redis cache
    try {
      if (redis && redis.status === 'ready') {
        await redis.setex(cacheKey, cacheValiditySeconds, JSON.stringify(data));
      }
    } catch (cacheError) {
      console.warn('Redis cache write failed:', cacheError.message);
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, max-age=300, must-revalidate`,
        'X-Cache': 'MISS',
        'X-Response-Time': (Date.now() - startTime).toString()
      }
    });
  } catch (error) {
    console.error('Error in API route (POST /api/internetport/get-address-by-id):', error);

    // PERFORMANCE FIX: Handle timeout errors specifically
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout: External service took too long to respond (>10s)' },
        { status: 408 },
      );
    }

    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return NextResponse.json(
        { error: 'Bad request: Malformed JSON in request body.' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}
