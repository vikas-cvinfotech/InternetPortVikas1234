import './globals.css';
import { IBM_Plex_Sans, Figtree } from 'next/font/google';

export const metadata = {
  other: {
    'link rel="preconnect" href="https://internetportcom.b-cdn.net"': '',
    'link rel="dns-prefetch" href="https://internetportcom.b-cdn.net"': '',
    'link rel="preconnect" href="https://fonts.googleapis.com"': '',
    'link rel="preconnect" href="https://fonts.gstatic.com" crossorigin': '',
  },
};

// Load fonts
const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  display: 'swap',
});

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${ibmPlexSans.variable} ${figtree.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
