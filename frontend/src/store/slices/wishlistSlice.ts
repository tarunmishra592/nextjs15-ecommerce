import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiErrorResponse, WishlistItems } from '@/types';

interface WishlistState {
  items: WishlistItems[];
  loading: boolean;
  error: ApiErrorResponse | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistState(state) {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWishlistSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    // wishlistSlice.ts
    addWishlistItemSuccess(state, action: PayloadAction<any[]>) {
      state.loading = false;
      // Replace the entire wishlist with the new data
      state.items = action.payload;
    },
    removeWishlistItemSuccess(state, action: PayloadAction<WishlistItems>) {
      state.loading = false;
      state.items = action.payload
    },
    operationFailed(state, action: PayloadAction<ApiErrorResponse>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  clearWishlistState,
  startLoading,
  fetchWishlistSuccess,
  addWishlistItemSuccess,
  removeWishlistItemSuccess,
  operationFailed,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;