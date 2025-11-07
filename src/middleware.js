import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { applySecurityHeaders } from './lib/securityHeaders';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  // Apply internationalization middleware
  const response = intlMiddleware(request);

  // Only apply security headers if we have a response and it's not a redirect/error
  if (response && response.status < 400 && !response.headers.get('location')) {
    try {
      return applySecurityHeaders(response, request);
    } catch (error) {
      // If headers already sent, just return the original response
      console.warn('Headers already sent, skipping security headers:', error.message);
      return response;
    }
  }

  // Return the original response for redirects, errors, or other finalized responses
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
