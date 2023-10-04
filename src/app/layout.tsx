import { Inter } from 'next/font/google';

import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'flex min-h-screen flex-col min-w-fit bg-gray-900',
          inter.className,
        )}
      >
        <Providers>
          <Navbar />
          <main
            className={cn('flex-grow text-center container max-w-7xl mx-auto')}
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
