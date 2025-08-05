'use client'
import { PaymentMethods } from '@/components/checkout/PaymentMethods'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { setCheckoutStep } from '@/store/slices/checkoutSlice'
import { selectPaymentMethod } from '@/store/slices/checkoutSlice'

export default function PaymentForm() {
  const dispatch = useAppDispatch()
  const paymentMethod = useAppSelector(selectPaymentMethod)

  const handleContinue = () => {
    if (!paymentMethod) return
    dispatch(setCheckoutStep('review'))
  }

  return (
    <div className="space-y-6">
      <PaymentMethods />
      <Button 
        onClick={handleContinue}
        disabled={!paymentMethod}
        className="w-full"
      >
        Review Order
      </Button>
    </div>
  )
}