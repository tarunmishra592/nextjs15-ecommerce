'use client'

import { Spinner } from "@/components/Spinner/spinner"



export default function Loading() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Spinner className="h-12 w-12" />
          <span className="sr-only">Loading...</span>
        </div>
        
        <div className="space-y-2 text-center">
          <h2 className="text-lg font-medium text-green-800">
            Loading your shopping experience
          </h2>
          <p className="text-sm text-green-600">
            Please wait while we prepare everything
          </p>
        </div>
      </div>
    </div>
  )
}