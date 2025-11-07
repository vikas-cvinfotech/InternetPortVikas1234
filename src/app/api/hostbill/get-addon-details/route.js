import { NextResponse } from 'next/server';
import { getAddonDetails } from '@/lib/hostbill-api';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const addonId = searchParams.get('id');
    const languageId = searchParams.get('language_id');

    if (!addonId) {
      return NextResponse.json(
        { error: 'Addon ID is required' },
        { status: 400 }
      );
    }

    const result = await getAddonDetails(addonId, languageId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching addon details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addon details' },
      { status: 500 }
    );
  }
}