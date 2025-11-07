import { NextResponse } from 'next/server';
import { generalRateLimiter, applyRateLimiter } from '@/lib/rateLimit';

// Dynamically determine the base URL - use the actual port the server is running on
const getBaseUrl = (request) => {
  // In production, use the environment variable
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  
  // In development, use the host header from the request
  const host = request.headers.get('host');
  if (host) {
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    return `${protocol}://${host}`;
  }
  
  // Fallback
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

// A single, robust handler for all forwarded requests.
async function handleRequest(request, context) {
  // Defensive: await params if it's a Promise.
  let params = context.params;
  if (typeof params?.then === 'function') {
    params = await params;
  }

  // Ensure slug exists before trying to join.
  if (!params.slug || !Array.isArray(params.slug)) {
    console.error('Invalid slug parameter in API proxy:', params);
    return NextResponse.json({ error: 'Invalid API route' }, { status: 400 });
  }

  // Get the real client IP address, handling various proxy scenarios
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const requestIp = request.ip;

  const ip =
    xForwardedFor?.split(',')[0]?.trim() ||
    xRealIp ||
    cfConnectingIp ||
    requestIp ||
    '127.0.0.1';

  // Apply the general rate limit to every request.
  // Skip rate limiting in development if Redis is not available
  if (process.env.NODE_ENV === 'production') {
    const { success } = await applyRateLimiter(generalRateLimiter, ip);
    if (!success) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
  } else {
    // In development, try rate limiting but don't block if it fails
    try {
      const { success } = await applyRateLimiter(generalRateLimiter, ip);
      if (!success) {
        console.warn(`Rate limit exceeded in development for IP: ${ip} - allowing anyway`);
      }
    } catch (error) {
      console.warn('Rate limiter error in development:', error.message);
    }
  }

  const slug = params.slug.join('/');
  const baseUrl = getBaseUrl(request);
  const targetUrl = `${baseUrl}/api/internal/${slug}`;

  try {
    // Read the body for POST/PUT/PATCH requests
    let body;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type');
      const contentLength = request.headers.get('content-length');
      
      // Only try to read body if there's content
      if (contentLength && contentLength !== '0') {
        try {
          const clonedRequest = request.clone();
          const jsonBody = await clonedRequest.json();
          body = JSON.stringify(jsonBody);
        } catch (e) {
          // If not JSON or already consumed, try text
          try {
            const clonedRequest2 = request.clone();
            body = await clonedRequest2.text();
            if (body) {
            }
          } catch (e2) {
            // Body might be empty or already consumed
            body = undefined;
          }
        }
      } else {
      }
    }

    // Create headers object, removing problematic headers
    const headers = {};
    for (const [key, value] of request.headers.entries()) {
      // Skip headers that might cause issues
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }
    
    // Ensure Content-Type is set for POST requests
    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    
    // Add a timeout to the internal request too
    // Use longer timeout for order creation endpoints
    const isOrderCreation = slug.includes('create-order') || slug.includes('create_order');
    const timeoutDuration = isOrderCreation ? 60000 : 25000; // 60 seconds for orders, 25 for others
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    // Forward the request
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    
    // Return the response
    const responseText = await response.text();
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(`API proxy error for /${slug}:`, error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

// Export the unified handler for all required HTTP methods.
export async function POST(request, context) {
  return handleRequest(request, context);
}

export async function GET(request, context) {
  return handleRequest(request, context);
}
