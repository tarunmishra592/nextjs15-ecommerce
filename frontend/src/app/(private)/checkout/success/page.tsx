import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BiCheckCircle } from 'react-icons/bi'

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <BiCheckCircle className="mx-auto w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}