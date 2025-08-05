import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  RazorpayOrder, 
  PaymentVerificationResult, 
  ApiErrorResponse,
  ShippingAddress 
} from '@/types';
import { RootState } from '../store';

interface CheckoutState {
  currentStep: 'address' | 'payment' | 'review';
  razorpayOrder: RazorpayOrder | null;
  verificationResult: PaymentVerificationResult | null;
  paymentMethod: 'razorpay' | 'cod' | 'wallet' | null;
  shippingAddress: ShippingAddress | null;
  loading: boolean;
  error: ApiErrorResponse | null;
}

const initialState: CheckoutState = {
  currentStep: 'address',
  razorpayOrder: null,
  verificationResult: null,
  paymentMethod: null,
  shippingAddress: null,
  loading: false,
  error: null
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setCheckoutStep(state, action: PayloadAction<CheckoutState['currentStep']>) {
      state.currentStep = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<CheckoutState['paymentMethod']>) {
      state.paymentMethod = action.payload;
    },
    setShippingAddress(state, action: PayloadAction<ShippingAddress>) {
      state.shippingAddress = action.payload;
    },
    paymentInitiated(state, action: PayloadAction<RazorpayOrder>) {
      state.loading = false;
      state.razorpayOrder = action.payload;
    },
    paymentVerified(state, action: PayloadAction<PaymentVerificationResult>) {
      state.loading = false;
      state.verificationResult = action.payload;
    },
    checkoutFailed(state, action: PayloadAction<ApiErrorResponse>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetCheckout(state) {
      Object.assign(state, initialState);
    }
  }
});

// Export actions
export const { 
  startLoading,
  setCheckoutStep,
  setPaymentMethod,
  setShippingAddress, // Added this export
  paymentInitiated,
  paymentVerified,
  checkoutFailed,
  resetCheckout
} = checkoutSlice.actions;

// Export selectors
export const selectCheckoutStep = (state: RootState) => state.checkout.currentStep;
export const selectPaymentMethod = (state: RootState) => state.checkout.paymentMethod;
export const selectRazorpayOrder = (state: RootState) => state.checkout.razorpayOrder;
export const selectShippingAddress = (state: RootState) => state.checkout.shippingAddress; // New selector
export const selectCheckoutLoading = (state: RootState) => state.checkout.loading;
export const selectCheckoutError = (state: RootState) => state.checkout.error;

export default checkoutSlice.reducer;