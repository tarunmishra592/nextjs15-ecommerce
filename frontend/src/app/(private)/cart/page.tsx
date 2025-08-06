// app/(private)/cart/page.tsx
'use client'
import CartItem from '@/components/CartItem/CartItem'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
// import { RootState } from '@/store/store'
import { FiShoppingCart } from 'react-icons/fi'
import Link from 'next/link'
import { useEffect } from 'react'
import { fetchCart } from '@/services/cartService'
import { selectCartItems } from '@/store/slices/cartSlice'
import { resetCheckout, setCheckoutStep } from '@/store/slices/checkoutSlice'
import { useAppDispatch } from '@/store/store'

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const items = useSelector(selectCartItems);

  useEffect(() => {
    dispatch(fetchCart()); 
  }, [dispatch]);
  
  // Calculate cart totals
  const subtotal = items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const tax = subtotal * 0.1 // 10% tax
  const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
  const discount = items.some(i => i.product.tags?.includes('discount')) ? subtotal * 0.1 : 0 // 10% discount if any item has discount tag
  const total = subtotal + tax + shipping - discount

  const handleProceedToCheckout = () => {
     // Reset any previous checkout state
     dispatch(resetCheckout())
    
     // Set initial checkout step
     dispatch(setCheckoutStep('address'))
     
     // Navigate to checkout page
     router.push('/checkout')
  }

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <FiShoppingCart className="mx-auto text-4xl text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything to your cart yet</p>
        <Link 
          href="/products" 
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiShoppingCart /> Shopping Cart ({items.length})
      </h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem 
              key={item.product._id} 
              product={item.product} 
              quantity={item.quantity} 
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-gray-200 my-3"></div>
            
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleProceedToCheckout} className="w-full mt-6 px-6 py-3 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Proceed to Checkout
          </button>
          
          <p className="text-sm text-gray-500 mt-4 text-center">
            Free shipping on orders over $100
          </p>
        </div>
      </div>
    </div>
  )
}