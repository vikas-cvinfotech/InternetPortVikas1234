import { RateLimiterRedis, RateLimiterMemory } from 'rate-limiter-flexible';
import { NextResponse } from 'next/server';
import redisClient from './redis';

/**
 * A factory function to create configured rate limit instances.
 * Uses Redis when available, with in-memory insurance fallback.
 * @param {string} keyPrefix - Unique prefix for this rate limiter type.
 * @param {number} points - The number of requests allowed within the duration.
 * @param {number} duration - The time window in seconds.
 * @returns A configured RateLimiter instance.
 */
const createRateLimiter = (keyPrefix, points, duration) => {
  // Create in-memory insurance limiter as fallback
  const insuranceLimiter = new RateLimiterMemory({
    points,
    duration,
  });

  return new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: keyPrefix, // Unique prefix per limiter type
    points: points,
    duration: duration,
    insuranceLimiter: insuranceLimiter, // Fallback if Redis fails
  });
};

// Configuration with Environment Variables and Sensible Defaults.

// For the general middleware limiter.
const generalPoints = parseInt(process.env.RATE_LIMIT_GENERAL_POINTS || '100');
const generalDuration = parseInt(process.env.RATE_LIMIT_GENERAL_DURATION_SECONDS || '60');

// For the strict authentication limiter.
const authPoints = parseInt(process.env.RATE_LIMIT_AUTH_POINTS || '40');
const authDuration = parseInt(process.env.RATE_LIMIT_AUTH_DURATION_SECONDS || '120');

// For the polling limiter.
const pollingPoints = parseInt(process.env.RATE_LIMIT_POLLING_POINTS || '200');
const pollingDuration = parseInt(process.env.RATE_LIMIT_POLLING_DURATION_SECONDS || '300');

// For the order creation limiter - prevent order flooding
const orderPoints = parseInt(process.env.RATE_LIMIT_ORDER_POINTS || '3');
const orderDuration = parseInt(process.env.RATE_LIMIT_ORDER_DURATION_SECONDS || '300');

// Exported Rate Limiter Instances.

/**
 * A general, more permissive rate limiter for most API endpoints.
 */
export const generalRateLimiter = createRateLimiter('rl:general', generalPoints, generalDuration);

/**
 * A strict rate limiter for sensitive actions like login or BankID initiation.
 */
export const authRateLimiter = createRateLimiter('rl:auth', authPoints, authDuration);

/**
 * A permissive limiter specifically for polling endpoints.
 */
export const pollingRateLimiter = createRateLimiter('rl:polling', pollingPoints, pollingDuration);

/**
 * A strict rate limiter for order creation - prevents order flooding attacks.
 * Limited to 3 orders per 5 minutes per IP address.
 */
export const orderRateLimiter = createRateLimiter('rl:order', orderPoints, orderDuration);

/**
 * A helper function to apply a rate limiter within an API route.
 * @param {RateLimiterRedis} limiter - The rate limiter instance to use.
 * @param {string} key - The identifier to limit by (e.g., IP address).
 * @returns {Promise<{success: boolean}>}
 */
export const applyRateLimiter = async (limiter, key) => {
  try {
    await limiter.consume(key);
    return { success: true };
  } catch (error) {
    // Check if this is a rate limit rejection (has specific properties)
    // RateLimiterRes has msBeforeNext, remainingPoints, consumedPoints properties
    if (error && typeof error === 'object' && 'msBeforeNext' in error) {
      // This is a legitimate rate limit rejection - log for monitoring
      console.warn(
        `[Rate Limiter] Rate limit exceeded for ${key} - Wait: ${Math.ceil(error.msBeforeNext / 1000)}s`,
      );
      return { success: false };
    }

    // Any other error (Redis connection, timeout, etc.) - allow request to avoid breaking app
    console.error('[Rate Limiter] Redis error - allowing request:', error.message || error);
    return { success: true };
  }
};

/**
 * Extracts the client IP address from a request, handling various proxy scenarios.
 * Checks multiple headers in order of reliability.
 * @param {Request} request - The incoming request object.
 * @returns {string} The client IP address.
 */
export const getClientIp = (request) => {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const requestIp = request.ip;

  return (
    xForwardedFor?.split(',')[0]?.trim() || xRealIp || cfConnectingIp || requestIp || '127.0.0.1'
  );
};

/**
 * Convenience function to apply rate limiting to a route handler.
 * Extracts client IP and applies the specified rate limiter.
 * Returns a 429 response if rate limit is exceeded, or null if successful.
 *
 * Usage:
 * ```javascript
 * export async function POST(request) {
 *   const rateLimitResponse = await applyRouteRateLimit(request, authRateLimiter);
 *   if (rateLimitResponse) return rateLimitResponse;
 *
 *   // ... rest of your route logic
 * }
 * ```
 *
 * @param {Request} request - The incoming request object.
 * @param {RateLimiterRedis} limiter - The rate limiter instance to use.
 * @returns {Promise<NextResponse|null>} A 429 response if blocked, or null if allowed.
 */
export const applyRouteRateLimit = async (request, limiter) => {
  const ip = getClientIp(request);
  const { success } = await applyRateLimiter(limiter, ip);

  if (!success) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  return null;
};
