import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'internetportcom.b-cdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'internetportzone.b-cdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [75, 85, 90, 95, 100],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure allowed dev origins for cross-origin requests
  allowedDevOrigins: [
    'dev.internetport.se',
    'dev.internetport.com',
    'test.internetport.se',
    'internetport.se',
    'internetport.com',
    'localhost:3000',
  ],
};

export default withNextIntl(nextConfig);
