import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { RootState, useAppDispatch, useAppSelector } from '@/store/store';
import { setPaymentMethod, paymentInitiated, checkoutFailed } from '@/store/slices/checkoutSlice';
import { Button } from '@/components/ui/button';
import { loadRazorpay } from '@/lib/razorpay';
import { verifyPayment } from '@/services/checkoutService';
import { selectShippingAddress } from '@/store/slices/checkoutSlice';
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice';
import { useSelector } from 'react-redux';
import { Order, RazorpayOrder, User } from '@/types';
import { apiFetch } from '@/lib/api';
import { selectUser } from '@/store/slices/authSlice';

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
  const user = useAppSelector(selectUser)
  const shippingAddress = useAppSelector(selectShippingAddress);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartItems = useAppSelector(selectCartItems);
  const router = useRouter()

  const handleSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    dispatch(setPaymentMethod(method));
  };

  const handlePayment = async () => {
    if (selectedMethod === 'razorpay') {
      try {
        setIsProcessing(true);
        
        // 1. First create the order in your backend
        const orderData = {
          items: cartItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
          })),
          shippingAddressId: '12444', // You'll need to get this from state
          paymentMethod: 'razorpay',
          amount: cartTotal
        };
  
        const order = await apiFetch<Order>('/orders', {
          method: 'POST',
          data: orderData
        });
  
        // 2. Then create Razorpay payment for this order
        const paymentOrder = await apiFetch<RazorpayOrder>('/payment', {
          method: 'POST',
          data: { 
            amount: cartTotal * 100,
            orderId: order._id // Pass your internal order ID
          }
        });
  
        // 3. Initialize Razorpay payment
        await loadRazorpay();
        
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          name: 'Your Store Name',
          description: `Order #${order._id}`,
          order_id: paymentOrder.id,
          handler: async (response: any) => {
            try {
              // Verify payment and update order status
              await apiFetch(`/payment/verify`, {
                method: 'POST',
                data: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: order._id
                }
              });
              
              // Redirect to confirmation page
              router.push(`/order-confirmation?orderId=${order._id}`);
            } catch (error) {
              console.error('Payment verification failed:', error);
              dispatch(checkoutFailed({message: 'Payment verification failed'}));
            }
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
  
        const rzp: any = new window.Razorpay(options);
        rzp.open();
        
        rzp.on('payment.failed', (response: any) => {
          dispatch(checkoutFailed({message: 'Payment failed or was declined'}));
          console.error('Payment failed:', response);
        });
  
      } catch (error) {
        dispatch(checkoutFailed({message: error instanceof Error ? error.message : 'Payment failed'}));
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