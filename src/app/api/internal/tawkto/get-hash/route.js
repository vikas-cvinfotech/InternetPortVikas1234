
import { createHmac } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email } = await req.json();

    // A unique identifier for the user for this session.
    // This could be a database ID in a real app, but for now, we'll create one.
    const userId = email; 

    const apiKey = process.env.TAWK_TO_API_KEY;

    if (!apiKey) {
      console.error('Tawk.to API key is not defined in environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // The hash must be a SHA256 HMAC of the user's ID, using your API Key as the secret.
    const hash = createHmac('sha256', apiKey).update(userId).digest('hex');

    return NextResponse.json({
      hash,
      name,
      email,
      userId,
    });
    
  } catch (error) {
    console.error('Error generating Tawk.to hash:', error);
    return NextResponse.json(
      { error: 'Failed to generate secure hash.' },
      { status: 500 }
    );
  }
}
