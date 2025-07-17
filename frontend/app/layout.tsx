import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prime Edge Banking - Premium Digital Banking Solutions',
  description: 'Experience premium banking at the Prime Edge. Cutting-edge digital banking services with advanced security, instant transfers, and innovative financial solutions.',
  keywords: 'prime edge banking, premium banking, digital banking, secure banking, online banking, mobile banking, financial services, innovative banking',
  authors: [{ name: 'Prime Edge Banking Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e3a8a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}