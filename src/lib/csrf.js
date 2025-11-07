import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

// Get JWT secret from environment
const CSRF_SECRET = process.env.SECRET_COOKIE_PASSWORD;

if (!CSRF_SECRET) {
  throw new Error('CSRF protection requires SECRET_COOKIE_PASSWORD to be set');
}

/**
 * Generate a CSRF token for a session
 * @returns {string} CSRF token
 */
export function generateCSRFToken() {
  const token = randomBytes(32).toString('hex');
  const timestamp = Date.now();
  
  // Sign the token with timestamp to prevent replay attacks
  const signedToken = jwt.sign(
    { 
      csrf: token, 
      timestamp,
      expiresAt: timestamp + (24 * 60 * 60 * 1000) // 24 hours
    },
    CSRF_SECRET,
    { expiresIn: '24h' }
  );
  
  return signedToken;
}

/**
 * Validate a CSRF token
 * @param {string} token - The token to validate
 * @param {string} sessionToken - The session's stored token
 * @returns {boolean} Whether the token is valid
 */
export function validateCSRFToken(token, sessionToken) {
  if (!token || !sessionToken) {
    return false;
  }
  
  try {
    // Verify both tokens are valid JWTs
    const providedData = jwt.verify(token, CSRF_SECRET);
    const sessionData = jwt.verify(sessionToken, CSRF_SECRET);
    
    // Check if tokens match and not expired
    if (providedData.csrf !== sessionData.csrf) {
      return false;
    }
    
    // Check if token is expired
    if (providedData.expiresAt < Date.now()) {
      return false;
    }
    
    return true;
  } catch (error) {
    // Token verification failed
    return false;
  }
}

/**
 * Get CSRF token from request headers or body
 * @param {Request} request - Next.js request object
 * @returns {string|null} CSRF token if found
 */
export async function getCSRFTokenFromRequest(request) {
  // Check header first (preferred method)
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }
  
  // Check body as fallback
  try {
    const body = await request.clone().json();
    return body._csrf || null;
  } catch {
    return null;
  }
}

/**
 * Middleware to validate CSRF token for state-changing requests
 * @param {Request} request - Next.js request object
 * @returns {Object} Validation result
 */
export async function validateCSRFMiddleware(request) {
  // Skip CSRF for safe methods
  const method = request.method;
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true, skip: true };
  }
  
  // Skip CSRF validation in development for easier testing
  // Remove this in production or for stricter security
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_CSRF === 'true') {
    return { valid: true, skip: true };
  }
  
  // Get CSRF token from request
  const requestToken = await getCSRFTokenFromRequest(request);
  if (!requestToken) {
    return { 
      valid: false, 
      error: 'CSRF token missing',
      code: 'CSRF_TOKEN_MISSING'
    };
  }
  
  // Get session CSRF token from cookie
  const sessionToken = request.cookies.get('csrf-token')?.value;
  if (!sessionToken) {
    return { 
      valid: false, 
      error: 'Session CSRF token missing',
      code: 'CSRF_SESSION_MISSING'
    };
  }
  
  // Validate tokens match
  const isValid = validateCSRFToken(requestToken, sessionToken);
  if (!isValid) {
    return { 
      valid: false, 
      error: 'CSRF token invalid',
      code: 'CSRF_TOKEN_INVALID'
    };
  }
  
  return { valid: true };
}

/**
 * List of paths that should be exempt from CSRF protection
 * Add paths that are webhooks or external API callbacks
 */
export const CSRF_EXEMPT_PATHS = [
  '/api/webhooks/',  // External webhooks
  '/api/health',     // Health checks
  '/api/status',     // Status endpoints
];

/**
 * Check if a path should be exempt from CSRF protection
 * @param {string} pathname - The request pathname
 * @returns {boolean} Whether to skip CSRF check
 */
export function isCSRFExempt(pathname) {
  return CSRF_EXEMPT_PATHS.some(path => pathname.startsWith(path));
}