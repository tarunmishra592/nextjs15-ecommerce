// app/layout.tsx
import { Suspense } from 'react'
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import MainProvider from '@/lib/providers/MainProvider';
import AuthInitializer from '@/components/AuthInitializer/AuthInitializer';
import './globals.css'

// Loading fallback components
function HeaderFallback() {
  return <div className="h-16 bg-gray-100 animate-pulse"></div>
}

function AuthFallback() {
  return <div className="h-1"></div> // Invisible placeholder
}

function FooterFallback() {
  return <div className="h-20 bg-gray-100 animate-pulse"></div>
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <MainProvider>
          <Suspense fallback={<HeaderFallback />}>
            <Header />
          </Suspense>
          
          <Suspense fallback={<AuthFallback />}>
            <AuthInitializer />
          </Suspense>
          
          <main className="flex-grow">
            <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
              {children}
            </Suspense>
          </main>
          
          <Suspense fallback={<FooterFallback />}>
            <Footer />
          </Suspense>
        </MainProvider>
      </body>
    </html>
  );
}