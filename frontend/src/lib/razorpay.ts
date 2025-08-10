export const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true)
      }
  
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'))
      }
      document.body.appendChild(script)
    })
}
  
interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: RazorpayResponse) => void
    theme: {
      color: string
    }
    prefill?: {
      name?: string
      email?: string
      contact?: string
    }
    notes?: {
      address?: string
    }
}
  
export interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}
  
declare global {
    interface Window {
      Razorpay: {
        new (options: RazorpayOptions): RazorpayInstance
      }
    }
}
  
export interface RazorpayInstance {
    open: () => void
    close: () => void
}