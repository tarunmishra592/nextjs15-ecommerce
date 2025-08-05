
import { PropsWithChildren } from 'react'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full p-2 rounded">
        {children}
      </div>
    </div>
  )
}