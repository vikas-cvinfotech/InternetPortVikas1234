import TvPageClient from './TvPageClient';

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://internetport.com';
  const currentPath = `/kategori/tv`;

  return {
    alternates: {
      canonical: `${baseUrl}/${currentPath}`,
      languages: {
        sv: `${baseUrl}/sv${currentPath}`,
        en: `${baseUrl}/en${currentPath}`,
        'x-default': `${baseUrl}/sv${currentPath}`,
      },
    },
  };
}

export default async function TvPage({ params }) {
  const { locale } = await params;

  return <TvPageClient locale={locale || 'sv'} />;
}
