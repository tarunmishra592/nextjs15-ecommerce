import { AppDispatch } from "@/store/store";
import { 
  paymentInitiated, 
  paymentVerified,
  checkoutFailed,
  startLoading, 
} from "@/store/slices/checkoutSlice";
import type { 
  RazorpayOrder, 
  PaymentVerificationPayload 
} from "@/types";
import { clientApi } from "@/lib/client-api";

export const initiatePayment = (amount: number) => 
  async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const order: any = await clientApi<RazorpayOrder>('/payment', {
        method: 'POST',
        protected: true,
        data: { amount }
      });
      dispatch(paymentInitiated(order));
      return order;
    } catch (err: any) {
      dispatch(checkoutFailed({
        message: err.message || 'Payment initialization failed'
      }));
      throw err;
    }
};

export const verifyPayment = (payload: PaymentVerificationPayload) => 
  async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const result: any = await clientApi('/payment/verify', {
        method: 'POST',
        protected: true,
        data: payload
      });
      dispatch(paymentVerified(result));
      return result;
    } catch (err: any) {
      dispatch(checkoutFailed({
        message: err.message || 'Payment verification failed'
      }));
      throw err;
    }
};