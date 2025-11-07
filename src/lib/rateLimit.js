import { RateLimiterRedis } from 'rate-limiter-flexible';
import redisClient from './redis';

/**
 * A factory function to create configured rate limit instances.
 * This pattern keeps our code DRY and easy to manage.
 * @param {number} points - The number of requests allowed within the duration.
 * @param {number} duration - The time window in seconds.
 * @returns A configured RateLimiter instance.
 */
const createRateLimiter = (points, duration) => {
  return new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit', // A single prefix is fine as config is loaded per environment
    points: points, // Number of points
    duration: duration, // Per seconds
  });
};

// Configuration with Environment Variables and Sensible Defaults.

// For the general middleware limiter.
const generalPoints = parseInt(process.env.RATE_LIMIT_GENERAL_POINTS || '100');
const generalDuration = parseInt(process.env.RATE_LIMIT_GENERAL_DURATION_SECONDS || '60');

// For the strict authentication limiter.
const authPoints = parseInt(process.env.RATE_LIMIT_AUTH_POINTS || '5');
const authDuration = parseInt(process.env.RATE_LIMIT_AUTH_DURATION_SECONDS || '60');

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
export const generalRateLimiter = createRateLimiter(generalPoints, generalDuration);

/**
 * A strict rate limiter for sensitive actions like login or BankID initiation.
 */
export const authRateLimiter = createRateLimiter(authPoints, authDuration);

/**
 * A permissive limiter specifically for polling endpoints.
 */
export const pollingRateLimiter = createRateLimiter(pollingPoints, pollingDuration);

/**
 * A strict rate limiter for order creation - prevents order flooding attacks.
 * Limited to 3 orders per 5 minutes per IP address.
 */
export const orderRateLimiter = createRateLimiter(orderPoints, orderDuration);

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
    // If Redis is not available, allow the request to proceed
    // This prevents the app from being completely broken when Redis is down
    if (error.name === 'RateLimiterRedisError' || error.message?.includes('Redis connection')) {
      console.warn('Rate limiter Redis error - allowing request:', error.message);
      return { success: true };
    }
    // If it's a rate limit rejection, block the request
    return { success: false };
  }
};
