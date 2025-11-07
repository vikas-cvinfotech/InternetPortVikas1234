import { NextResponse } from 'next/server';
import { getProductApplicableAddons } from '@/lib/hostbill-api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const languageId = searchParams.get('language_id');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await getProductApplicableAddons(productId, languageId);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, max-age=${process.env.BROWSER_CACHE_SECONDS || 300}, must-revalidate`
      }
    });
  } catch (error) {
    console.error('Error fetching product addons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product addons' },
      { status: 500 }
    );
  }
}