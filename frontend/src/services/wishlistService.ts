import { apiFetch } from "@/lib/api";
import { addWishlistItemSuccess, fetchWishlistSuccess, operationFailed, removeWishlistItemSuccess, startLoading } from "@/store/slices/wishlistSlice";
import { AppDispatch } from "@/store/store";
import { ApiErrorResponse, WishlistItems } from "@/types";

// Service functions (typically in a separate wishlistServices.ts file)
export const fetchWishlist = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const data = await apiFetch<any[]>('/wishlist', { method: 'GET' });
      dispatch(fetchWishlistSuccess(data));
    } catch (err: any) {
      const errorPayload: ApiErrorResponse = err?.status
        ? (err as ApiErrorResponse)
        : { message: err.message || 'Failed to fetch wishlist' };
      dispatch(operationFailed(errorPayload));
    }
  };
  
  export const addWishlistItem = (productId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      
      // API returns the complete updated wishlist
      const updatedWishlist = await apiFetch<any[]>(`/wishlist/${productId}`, {
        method: 'POST'
      });
  
      dispatch(addWishlistItemSuccess(updatedWishlist));
      return true;
    } catch (err: any) {
      const errorPayload: ApiErrorResponse = {
        message: err.message || 'Failed to add to wishlist',
      };
      dispatch(operationFailed(errorPayload));
      return false;
    }
  };
  
export const removeWishlistItem = (productId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      
      const updatedWishlist = await apiFetch<WishlistItems>(`/wishlist/${productId}`, { method: 'DELETE' });
      
      dispatch(removeWishlistItemSuccess(updatedWishlist));
      
      return true;
    } catch (error: any) {
      let errorMessage = 'Failed to remove from wishlist';
      
      // Check if it's an API error with response
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } 
      // Check if it's a network error
      else if (error.message) {
        errorMessage = error.message;
      }
      
      // Dispatch the error
      dispatch(operationFailed({
        message: errorMessage,
      }));
      
      return false; // Indicate failure
    }
};