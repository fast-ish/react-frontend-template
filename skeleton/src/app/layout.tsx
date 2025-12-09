import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
{%- if values.styling == "tailwind" %}
import './globals.css';
{%- elif values.styling == "css-modules" %}
import './globals.css';
{%- endif %}
import { Providers } from '@/providers';
import { GrafanaFaroInit } from '@/lib/grafana-faro';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: '${{values.name}}',
    template: '%s | ${{values.name}}',
  },
  description: '${{values.description}}',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: '${{values.name}}',
    description: '${{values.description}}',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GrafanaFaroInit />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
