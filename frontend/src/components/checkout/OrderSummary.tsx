'use client'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/store'
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice'
import CartItem from '@/components/CartItem/CartItem'

export default function OrderSummary() {
  const cartItems = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <div className="space-y-4">
        {cartItems.map(item => (
          <CartItem 
            key={item.product._id} 
            product={item.product} 
            quantity={item.quantity}
            readOnly
          />
        ))}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Button className="w-full mt-6">
        Place Order
      </Button>
    </div>
  )
}