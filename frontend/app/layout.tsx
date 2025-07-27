import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Гласај за својот кандидат',
  description: 'Сигурна апликација за гласање',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mk">
      <body className={inter.className + ' bg-gray-50 min-h-screen'}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
