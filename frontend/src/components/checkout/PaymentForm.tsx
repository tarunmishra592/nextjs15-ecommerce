'use client'
import { PaymentMethods } from '@/components/checkout/PaymentMethods'
import OrderSummary from './OrderSummary'

export default function PaymentForm() {

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-7">
        <PaymentMethods />
      </div>
      <div className="col-span-3">
        <OrderSummary />
      </div>
    </div>
  )
}