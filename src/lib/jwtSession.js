import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SECRET_COOKIE_PASSWORD;
const key = new TextEncoder().encode(secretKey);
const COOKIE_NAME = 'bankid-jwt-session';

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m') // 10 minutes
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getJwtSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!sessionCookie) {
    return { bankid: null };
  }

  try {
    const session = await decrypt(sessionCookie);
    return session;
  } catch (error) {
    console.error('[JWT SESSION] Failed to decrypt session:', error.message);
    return { bankid: null };
  }
}

export async function saveJwtSession(sessionData) {
  const encrypted = await encrypt(sessionData);
  
  // Return the cookie value and options so it can be set in response headers
  return {
    name: COOKIE_NAME,
    value: encrypted,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    }
  };
}

export async function destroyJwtSession() {
  // Return cookie deletion data
  return {
    name: COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    }
  };
}