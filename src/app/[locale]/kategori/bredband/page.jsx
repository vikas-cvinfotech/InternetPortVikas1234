import BredbandPageClient from './BredbandPageClient';

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://internetport.com';
  const currentPath = `/kategori/bredband`;

  return {
    alternates: {
      canonical: `${baseUrl}/${currentPath}`,
      languages: {
        sv: `${baseUrl}/sv${currentPath}`,
        en: `${baseUrl}/en${currentPath}`,
        'x-default': `${baseUrl}/sv${currentPath}`,
      },
    },
    other: {
      // Preload API endpoint for faster data fetching
      'link rel="preload" href="/api/hostbill/get-products?category=bredband" as="fetch"': '',
      // Preconnect to CDN for faster image loading
      'link rel="preconnect" href="https://internetportcom.b-cdn.net"': '',
    },
  };
}

export default async function BredbandPage({ params }) {
  const { locale } = await params;

  return <BredbandPageClient locale={locale || 'sv'} />;
}
