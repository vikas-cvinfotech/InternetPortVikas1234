import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// This file is where you'd define your session options.
// The password must be at least 32 characters long.
const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'bankid-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  return session;
}
