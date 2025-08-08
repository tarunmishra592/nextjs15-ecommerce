'use client'
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper'

import { useAppDispatch, useAppSelector } from '@/store/store'
import { selectCheckoutStep } from '@/store/slices/checkoutSlice'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { selectCartItems } from '@/store/slices/cartSlice'
import AddressForm from '@/components/checkout/AddressForm'
import PaymentForm from '@/components/checkout/PaymentForm'
import { fetchCart } from '@/services/cartService'

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const currentStep = useAppSelector(selectCheckoutStep)
  const cartItems = useAppSelector(selectCartItems)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchCart()); 
    if(cartItems.length == 0){
      router.push('/cart')
    }
  }, [])

  const renderStep = () => {
    switch (currentStep) {
      case 'address':
        return <AddressForm />
      case 'payment':
        return <PaymentForm />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutStepper />
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        {renderStep()}
      </div>
    </div>
  )
}