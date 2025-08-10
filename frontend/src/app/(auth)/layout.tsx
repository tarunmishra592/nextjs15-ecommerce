
import { PropsWithChildren } from 'react'

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full p-2 rounded">
        {children}
      </div>
    </div>
  )
}