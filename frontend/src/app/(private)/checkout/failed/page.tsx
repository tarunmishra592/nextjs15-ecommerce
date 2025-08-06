import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BiXCircle } from 'react-icons/bi'

export default function FailedPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <BiXCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-6">
        We couldn&apos;t process your payment. Please try again or use a different payment method.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/checkout">
          <Button variant="outline">Try Again</Button>
        </Link>
        <Link href="/cart">
          <Button>Back to Cart</Button>
        </Link>
      </div>
    </div>
  )
}