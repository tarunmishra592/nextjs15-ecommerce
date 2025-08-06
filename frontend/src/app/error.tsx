// app/error.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button' // Assuming you're using shadcn/ui

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {

  const router = useRouter()

  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-green-200">
        <div className="bg-green-600 p-4">
          <h1 className="text-2xl font-bold text-white">Something went wrong!</h1>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {error.message || 'An unexpected error occurred'}
              </h2>
              {error.digest && (
                <p className="text-sm text-gray-500 mt-1">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => reset()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Try Again
            </Button>
            <Button onClick={() => router.push('/')} variant="outline" className="border-green-600 text-green-600">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}