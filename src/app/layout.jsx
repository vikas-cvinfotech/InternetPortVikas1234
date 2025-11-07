import './globals.css';

export const metadata = {
  other: {
    // Preconnect to critical third-party origins to speed up connections
    'link rel="preconnect" href="https://internetportcom.b-cdn.net"': '',
    'link rel="dns-prefetch" href="https://internetportcom.b-cdn.net"': '',
    'link rel="preconnect" href="https://fonts.googleapis.com"': '',
    'link rel="preconnect" href="https://fonts.gstatic.com" crossorigin': '',
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
