// app/layout.tsx (simplified)
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import MainProvider from '@/lib/providers/MainProvider';

import AuthInitializer from '@/components/AuthInitializer/AuthInitializer';

import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <MainProvider>
          <Header />
          <AuthInitializer/>
          <main className="flex-grow">{children}</main>
          <Footer />
        </MainProvider>
      </body>
    </html>
  );
}
