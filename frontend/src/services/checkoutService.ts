import { apiFetch } from "@/lib/api";
import { AppDispatch } from "@/store/store";
import { 
  paymentInitiated, 
  paymentVerified,
  checkoutFailed,
  startLoading, 
  setCheckoutStep
} from "@/store/slices/checkoutSlice";
import type { 
  RazorpayOrder, 
  PaymentVerificationPayload 
} from "@/types";

export const initiatePayment = (amount: number) => 
  async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const order = await apiFetch<RazorpayOrder>('/payment', {
        method: 'POST',
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
      const result: any = await apiFetch('/payment/verify', {
        method: 'POST',
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