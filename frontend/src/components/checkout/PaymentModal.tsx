'use client'
import { useEffect } from 'react'
import { useAppSelector } from '@/store/store'
import { selectRazorpayOrder } from '@/store/slices/checkoutSlice'
import { verifyPayment } from '@/services/checkoutService'
import { loadRazorpay } from '@/lib/razorpay'

export default function PaymentModal() {
  const order = useAppSelector(selectRazorpayOrder)

  useEffect(() => {
    if (!order) return

    const initializePayment = async () => {
      try {
        await loadRazorpay()
        
        const options = {
          key: process.env.RAZORPAY_KEY_ID!,
          amount: order.amount,
          currency: order.currency,
          name: 'Your Store Name',
          description: 'Complete your purchase',
          order_id: order.id,
          handler: async (response: any) => {
            try {
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            } catch (error) {
              console.error('Payment verification failed:', error)
            }
          },
          theme: {
            color: '#3399cc'
          },
          modal: {
            ondismiss: () => {
              console.log('Payment modal dismissed')
            }
          }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } catch (error) {
        console.error('Failed to initialize Razorpay:', error)
      }
    }

    initializePayment()
  }, [order])

  return null
}