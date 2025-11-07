/**
 * Security headers configuration for enhanced protection
 * Prevents XSS, clickjacking, MIME sniffing, and other attacks
 */

/**
 * Generate Content Security Policy (CSP) header value
 * Tailored for Next.js applications with external integrations
 */
function generateCSPHeader() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const cspDirectives = {
    // Default source - restrict everything by default
    'default-src': ["'self'"],

    // Script sources - allow self, Next.js, and specific external services
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js inline scripts in production
      ...(isDevelopment ? ["'unsafe-eval'"] : []), // Next.js dev only
      'https://www.googletagmanager.com',
      'https://www.googleadservices.com', // Google Ads conversion tracking
      'https://googleads.g.doubleclick.net', // Google Ads
      'https://pagead2.googlesyndication.com', // Google Ads scripts
      'https://js.tawk.to',
      'https://embed.tawk.to',
      'https://cdn.jsdelivr.net', // Tawk.to emojione dependency
      'https://app.bankid.com', // BankID mobile app redirects
      ...(isDevelopment ? ['http://localhost:*'] : []), // Dev server
    ],

    // Style sources - allow self and inline styles (common in React)
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components, CSS-in-JS
      'https://fonts.googleapis.com',
      'https://embed.tawk.to', // Tawk.to stylesheets
    ],

    // Image sources - allow self and common CDNs
    'img-src': [
      "'self'",
      'data:', // Base64 encoded images
      'blob:', // Generated QR codes and images
      'https:', // Allow all HTTPS images (for product images, CDNs, etc.)
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com', // Analytics beacons
      'https://www.googleadservices.com', // Google Ads tracking pixels
      'https://googleads.g.doubleclick.net', // Google Ads pixels
      'https://va.tawk.to',
      'https://internetportcom.b-cdn.net', // Your CDN
      'https://images.unsplash.com', // Stock images
    ],

    // Font sources
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'https://embed.tawk.to', // Tawk.to fonts
    ],

    // Connect sources - API endpoints and external services
    'connect-src': [
      "'self'",
      process.env.API_INTERNETPORT_SE_ENDPOINT || 'https://api.internetport.se',
      process.env.REST_API_2_ENDPOINT || 'https://api2.internetport.se',
      ...(process.env.HOSTBILL_API_ENDPOINT
        ? [new URL(process.env.HOSTBILL_API_ENDPOINT).origin]
        : ['https://portal.internetport.com']),
      process.env.NEXT_PUBLIC_STATUS_API_ENDPOINT?.replace('/api/v1', '') ||
        'https://status.internetport.se',
      ...(process.env.BANKID_API_URL
        ? [new URL(process.env.BANKID_API_URL).origin]
        : ['https://api.banksignering.se']),
      'https://api.mailjet.com',
      'https://www.google-analytics.com',
      'https://region1.google-analytics.com', // Google Analytics data collection
      'https://region1.analytics.google.com', // Google Analytics newer endpoint
      'https://stats.g.doubleclick.net', // Google Analytics enhanced conversion tracking
      'https://*.analytics.google.com', // Google Analytics regional endpoints
      'https://www.google.com', // Google Analytics collect endpoint
      'https://www.googletagmanager.com', // Google Tag Manager
      'https://www.googleadservices.com', // Google Ads conversion tracking
      'https://googleads.g.doubleclick.net', // Google Ads
      'https://pagead2.googlesyndication.com', // Google Ads syndication
      'https://va.tawk.to',
      'https://embed.tawk.to', // Tawk.to embed resources
      'https://*.tawk.to', // Tawk.to dynamic servers (vsb30, vsb104, etc.)
      'wss://va.tawk.to', // Tawk.to WebSocket
      'wss://*.tawk.to', // Tawk.to dynamic WebSocket servers (vsb30, vsb104, etc.)
      ...(isDevelopment
        ? [
            'http://localhost:*',
            'http://internetport.com:*', // Domain-based routing in dev
            'http://internetport.se:*', // Domain-based routing in dev
          ]
        : []), // Dev server connections
    ],

    // Frame sources - allow GTM, analytics, and YouTube embeds
    'frame-src': [
      'https://www.googletagmanager.com', // GTM containers
      'https://td.doubleclick.net', // Google Analytics
      'https://www.googleadservices.com', // Google Ads conversion tracking
      'https://googleads.g.doubleclick.net', // Google Ads frames
      'https://www.youtube.com', // YouTube embeds for VPN page
      'https://www.youtube-nocookie.com', // Privacy-enhanced YouTube embeds
    ],

    // Object sources
    'object-src': ["'none'"],

    // Media sources
    'media-src': ["'self'"],

    // Worker sources (for service workers, web workers)
    'worker-src': ["'self'", 'blob:'],

    // Base URI restriction
    'base-uri': ["'self'"],

    // Form action restriction
    'form-action': ["'self'"],

    // Manifest source
    'manifest-src': ["'self'"],
  };

  // Convert directives to CSP string
  const cspString = Object.entries(cspDirectives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  return cspString;
}

/**
 * Apply security headers to a Next.js response
 * @param {NextResponse} response - Next.js response object
 * @param {NextRequest} request - Next.js request object (optional)
 * @returns {NextResponse} Response with security headers added
 */
export function applySecurityHeaders(response, request) {
  // Content Security Policy
  response.headers.set('Content-Security-Policy', generateCSPHeader());

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS Protection (legacy, but still useful for older browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy - limit information sent to external sites
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HTTP Strict Transport Security (HSTS) - enforce HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Permissions Policy - restrict browser features
  response.headers.set(
    'Permissions-Policy',
    [
      'accelerometer=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
      'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")', // Allow autoplay for YouTube embeds
      'camera=()',
      'cross-origin-isolated=()',
      'display-capture=()',
      'encrypted-media=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")', // Allow encrypted media for video
      'fullscreen=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")', // Allow fullscreen for videos
      'geolocation=()',
      'gyroscope=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
      'keyboard-map=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'payment=(self)', // Allow payment for checkout
      'picture-in-picture=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")', // Allow PiP for videos
      'publickey-credentials-get=(self)', // Allow for WebAuthn if implemented
      'screen-wake-lock=()',
      'sync-xhr=()',
      'usb=()',
      'web-share=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")', // Allow web share for sharing videos
      'xr-spatial-tracking=()',
    ].join(', ')
  );
  // Cross-Origin Embedder Policy - Use unsafe-none to allow YouTube embeds
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');

  // Cross-Origin Opener Policy - only for HTTPS in production
  // Check if the request is HTTPS by looking at the URL or protocol
  const isHTTPS =
    request?.url?.startsWith('https://') ||
    request?.headers?.get('x-forwarded-proto') === 'https' ||
    process.env.NODE_ENV === 'production';

  if (isHTTPS) {
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  }

  // Cross-Origin Resource Policy
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site');

  return response;
}

/**
 * Get security headers as an object (for Next.js config)
 * @returns {Object} Headers object for next.config.js
 */
export function getSecurityHeadersConfig() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: generateCSPHeader(),
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: [
            'accelerometer=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
            'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
            'camera=()',
            'cross-origin-isolated=()',
            'display-capture=()',
            'encrypted-media=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
            'fullscreen=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
            'geolocation=()',
            'gyroscope=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
            'keyboard-map=()',
            'magnetometer=()',
            'microphone=()',
            'midi=()',
            'payment=(self)',
            'picture-in-picture=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
            'publickey-credentials-get=(self)',
            'screen-wake-lock=()',
            'sync-xhr=()',
            'usb=()',
            'web-share=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
            'xr-spatial-tracking=()',
          ].join(', '),
        },
      ],
    },
  ];
}
