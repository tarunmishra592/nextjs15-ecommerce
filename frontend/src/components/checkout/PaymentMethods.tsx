import { useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/store/store';
import { setPaymentMethod, paymentInitiated, checkoutFailed } from '@/store/slices/checkoutSlice';
import { Button } from '@/components/ui/button';
import { loadRazorpay } from '@/lib/razorpay';
import { initiatePayment, verifyPayment } from '@/services/checkoutService';
import { selectShippingAddress } from '@/store/slices/checkoutSlice';
import { selectCartTotal } from '@/store/slices/cartSlice';
import { useSelector } from 'react-redux';
import { RazorpayOrder } from '@/types';
import { apiFetch } from '@/lib/api';

type PaymentMethod = 'razorpay' | 'cod' | 'wallet';

const PAYMENT_METHODS = [
  {
    id: 'razorpay',
    name: 'Credit/Debit Card',
    description: 'Pay securely with Razorpay',
    icon: '💳',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: '📦',
  },
] as const;

export const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth)
  const shippingAddress = useAppSelector(selectShippingAddress);
  const cartTotal = useAppSelector(selectCartTotal);

  const handleSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    dispatch(setPaymentMethod(method));
  };

  const handlePayment = async () => {
    if (selectedMethod === 'razorpay') {
      try {
        setIsProcessing(true);
        
        // 1. Create order directly in component
        const order = await apiFetch<RazorpayOrder>('/payment', {
          method: 'POST',
          body: JSON.stringify({ amount: cartTotal * 100 })
        });
        
        // 2. Save only the serializable order data to Redux
        dispatch(paymentInitiated({
          id: order.id,
          amount: order.amount,
          currency: order.currency
        }));
        
        // 3. Load and open Razorpay
        await loadRazorpay();
        
        const options = {
          key: process.env.RAZORPAY_KEY_ID!,
          amount: order.amount,
          currency: order.currency,
          name: 'Your Store Name',
          description: 'Order Payment',
          order_id: order.id,
          handler: (response: any) => {
            // Handle payment verification
            dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }));
          },
          prefill: {
            name: `${shippingAddress?.firstName} ${shippingAddress?.lastName}`,
            email: user?.email || '',
            contact: shippingAddress?.phone || ''
          },
          theme: {
            color: '#3399cc'
          }
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        dispatch(checkoutFailed({
          message: error instanceof Error ? error.message : 'Payment failed'
        }));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>
      
      <div className="grid gap-4">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            onClick={() => handleSelect(method.id as PaymentMethod)}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{method.icon}</span>
              <div>
                <h4 className="font-medium">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="pt-4">
          <Button 
            className="w-full"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Continue with ${PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}`}
          </Button>
        </div>
      )}
    </div>
  );
};