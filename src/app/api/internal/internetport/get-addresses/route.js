import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(req) {
  try {
    const startTime = Date.now();
    const requestBody = await req.json();

    if (!requestBody || typeof requestBody !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body. JSON object expected.' },
        { status: 400 },
      );
    }

    // Although the frontend currently only sends 'getAddresses',
    // you might want to check requestBody.call if this endpoint were to handle more types.
    // For now, we assume the body is structured for the 'getAddresses' call as sent by AddressSearchBox.
    // Example: { call: 'getAddresses', streetName: '...', city: '...', limit: 5, ... }

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

    // Create cache key based on request body
    const cacheKey = `addresses:${JSON.stringify(requestBody)}`;

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

    const externalApiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-App-Key': apiKey,
      },
      body: JSON.stringify(requestBody),
      next: { revalidate: cacheValiditySeconds },
    });

    if (!externalApiResponse.ok) {
      let errorDetails = {
        message: `External API request failed with status ${externalApiResponse.status}`,
      };
      try {
        // Try to parse more detailed error from the external API response.
        const externalErrorBody = await externalApiResponse.json();
        errorDetails = { ...errorDetails, ...externalErrorBody };
      } catch (parseError) {
        // If parsing fails, use the text response or a generic message
        const errorText = await externalApiResponse.text();
        errorDetails.rawResponse =
          errorText || 'No additional error information from external API.';
      }
      console.error('External API error:', errorDetails);
      return NextResponse.json(
        { error: 'Failed to fetch data from external service.', details: errorDetails },
        { status: externalApiResponse.status },
      );
    }

    const data = await externalApiResponse.json();
    const result = data || [];

    // Store in Redis cache
    try {
      if (redis && redis.status === 'ready') {
        await redis.setex(cacheKey, cacheValiditySeconds, JSON.stringify(result));
      }
    } catch (cacheError) {
      console.warn('Redis cache write failed:', cacheError.message);
    }

    // Mimic `response || []` from the Nuxt example:
    // If the external API successfully returns a nullish value (e.g., null),
    // respond with an empty array. Otherwise, respond with the data.

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, max-age=${process.env.BROWSER_CACHE_SECONDS || 300}, must-revalidate`,
        'X-Cache': 'MISS',
        'X-Response-Time': (Date.now() - startTime).toString()
      }
    });
  } catch (error) {
    console.error('Error in API route (POST /api/get-addresses):', error);

    // Handle cases where req.json() might fail (e.g., malformed JSON)
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
