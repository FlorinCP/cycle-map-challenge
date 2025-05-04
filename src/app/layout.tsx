import { Poppins } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/lib/query-provider';
import { Metadata } from 'next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'CycleMap',
  description: 'Interactive bike-sharing network map',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CycleMap',
  },
  icons: {
    apple: '/logo.png',
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${poppins.variable} antialiased overflow-x-hidden`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
