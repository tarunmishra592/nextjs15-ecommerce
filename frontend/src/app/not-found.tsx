// app/not-found.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-green-200 text-center">
        {/* Header */}
        <div className="bg-green-600 p-6">
          <div className="text-8xl font-bold text-white">404</div>
          <h1 className="text-2xl font-semibold text-white mt-2">Page Not Found</h1>
        </div>

        {/* Interactive Content */}
        <div className="p-8 space-y-6">
          <div className="relative h-40">
            {/* Animated floating leaves */}
            <div className="absolute top-0 left-1/4 w-8 h-8 bg-green-500 rounded-full opacity-20 animate-float1"></div>
            <div className="absolute top-8 right-1/4 w-6 h-6 bg-green-400 rounded-full opacity-30 animate-float2"></div>
            <div className="absolute bottom-4 left-1/3 w-10 h-10 bg-green-300 rounded-full opacity-25 animate-float3"></div>
            
            {/* Main illustration */}
            <div className="relative z-10 mx-auto w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-20 h-20 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeWidth="1.5" 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <p className="text-green-800">
            Oops! The page you are looking for has vanished into the digital wilderness.
          </p>

          {/* Interactive buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link className="bg-green-600 p-2 rounded-4xl text-white hover:bg-green-700" href="/">Return Home</Link>
            <Link className="text-white p-2 bg-red-500 rounded-4xl border-green-600 hover:bg-red-400" href="/contact">Report Issue</Link>
          </div>
        </div>
      </div>

      {/* Global CSS for animations (add to your global CSS file) */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(2deg); }
        }
        .animate-float1 { animation: float1 4s ease-in-out infinite; }
        .animate-float2 { animation: float2 5s ease-in-out infinite; }
        .animate-float3 { animation: float3 6s ease-in-out infinite; }
      `}</style>
    </div>
  )
}