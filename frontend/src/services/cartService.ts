import { apiFetch } from "@/lib/client-api";
import { fetchCartSuccess, operationFailed, removeCartItemSuccess, startLoading, updateCartQuantitySuccess } from "@/store/slices/cartSlice";
import { AppDispatch } from "@/store/store";
import { ApiErrorResponse, CartItem } from "@/types";

// Example usage in a component or service file
export const fetchCart = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const data = await apiFetch<CartItem[]>('/cart', { method: 'GET' });
      dispatch(fetchCartSuccess(data));
    } catch (err: any) {
      dispatch(operationFailed({
        message: err.message || 'Failed to fetch cart'
      }));
    }
};
  
export const updateCartQuantity = (productId: string, quantity: number) => async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const data = await apiFetch<CartItem[]>(`/cart/${productId}`, {
        method: 'PATCH',
        data: { quantity },
      });
      dispatch(updateCartQuantitySuccess(data));
    } catch (err: any) {
      dispatch(operationFailed({
        message: err.message || 'Update quantity failed'
      }));
    }
};

// In your cartSlice.ts
export const addCartItem = (productId: string, quantity: number = 1) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const data = await apiFetch<CartItem>('/cart', {
        method: 'POST',
        data: { productId, quantity },
      });
      
      // Dispatch success action with proper type
      dispatch({
        type: 'cart/addCartItemSuccess',
        payload: data
      });
      return true; // Return success indicator
    } catch (err: any) {
      const errorPayload: ApiErrorResponse = err?.status 
        ? (err as ApiErrorResponse)
        : { message: err.message || 'Failed to add to cart' };
      dispatch(operationFailed(errorPayload));
      return false; // Return failure indicator
    }
  };
};
  
export const removeCartItem = (productId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      await apiFetch<void>(`/cart/${productId}`, { method: 'DELETE' });
      dispatch(removeCartItemSuccess({ productId }));
    } catch (err: any) {
      const errorPayload: ApiErrorResponse = err?.status
        ? (err as ApiErrorResponse)
        : { message: err.message || 'Failed to remove from cart' };
      dispatch(operationFailed(errorPayload));
    }
};
  