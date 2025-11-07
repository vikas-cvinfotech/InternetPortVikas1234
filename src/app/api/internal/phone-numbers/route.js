import { NextResponse } from 'next/server';
import redis from '@/lib/redis.js';

// Cache for 1 hour - phone numbers don't change frequently
const PHONE_NUMBERS_CACHE_TTL = 3600;
const CACHE_KEY = 'phone-numbers';

export async function GET() {
  try {
    // Smart environment variable detection:
    // - Try _PHONE variables first (live API) for those who have them configured
    // - Fall back to regular variables (dev API) for standard development
    const API_ID = process.env.HOSTBILL_API_ID_PHONE || process.env.HOSTBILL_API_ID;
    const API_KEY = process.env.HOSTBILL_API_KEY_PHONE || process.env.HOSTBILL_API_KEY;
    const API_URL = process.env.HOSTBILL_API_ENDPOINT_PHONE || process.env.HOSTBILL_API_ENDPOINT;

    const usingLiveAPI = !!process.env.HOSTBILL_API_ID_PHONE;

    if (!API_ID || !API_KEY || !API_URL) {
      console.error('Missing HostBill API credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Try to get from cache first
    let phoneNumbers = null;
    try {
      if (redis && redis.status === 'ready') {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
          phoneNumbers = JSON.parse(cached);
        }
      }
    } catch (cacheError) {
      console.warn('Redis cache error:', cacheError);
    }

    // If not in cache, fetch from HostBill API
    if (!phoneNumbers) {
      const formData = new URLSearchParams();
      formData.append('api_id', API_ID);
      formData.append('api_key', API_KEY);
      formData.append('fn', 'getAvailableNumbers');
      formData.append('module', 'phonenumbermng');
      formData.append('call', 'module');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`HostBill API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract phone numbers from response
      if (data.result && data.result.numbers) {
        phoneNumbers = data.result.numbers;
      } else if (data.result && typeof data.result === 'object') {
        phoneNumbers = data.result;
      } else if (data.numbers) {
        phoneNumbers = data.numbers;
      } else {
        phoneNumbers = {};
      }

      // If using dev API and no numbers found, provide mock data for development
      if (!usingLiveAPI && (!phoneNumbers || Object.keys(phoneNumbers).length === 0)) {
        phoneNumbers = {
          '010': ['1234567', '1234568', '1234569'],
          '0123': ['456789', '456790', '456791'],
          '0159': ['774131', '774136', '774135'],
          '0911': ['123456', '123457', '123458'],
        };
      }

      // Cache the result
      try {
        if (redis && redis.status === 'ready') {
          await redis.setex(CACHE_KEY, PHONE_NUMBERS_CACHE_TTL, JSON.stringify(phoneNumbers));
        }
      } catch (cacheError) {
        console.warn('Redis cache set error:', cacheError);
      }
    }

    return NextResponse.json(phoneNumbers, { status: 200 });
  } catch (error) {
    console.error('Phone numbers API error:', error);
    return NextResponse.json({ error: 'Failed to fetch phone numbers' }, { status: 500 });
  }
}
