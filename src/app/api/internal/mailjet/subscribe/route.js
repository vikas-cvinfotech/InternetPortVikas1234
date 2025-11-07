import { NextResponse } from 'next/server';
import { authRateLimiter, applyRateLimiter } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    const { success } = await applyRateLimiter(authRateLimiter, ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }
    const body = await request.json();
    if (!body || !body.email) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const email = body.email;
    // Basic server-side email validation
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const mailjetUrl = process.env.MAILJET_API_CONTACT_URL;
    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;

    // Encode credentials in base64 for Basic Auth
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    const mailjetRes = await fetch(mailjetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Email: email, Action: 'addnoforce' }),
    });

    // Read the response text and parse JSON if available.
    const text = await mailjetRes.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (mailjetRes.ok) {
      return new Response(JSON.stringify({ message: 'Subscription successful' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      const errorMessage =
        data.ErrorMessage ||
        (data.Errors && data.Errors.length > 0 && data.Errors[0].ErrorMessage) ||
        'Subscription failed, please try again.';
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: mailjetRes.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Mailjet API error:', error);
    return new Response(JSON.stringify({ error: 'Server error. Please try again later.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
