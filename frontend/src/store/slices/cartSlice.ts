import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, ApiErrorResponse } from '@/types';
import { RootState } from '../store';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: ApiErrorResponse | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Basic synchronous actions
    clearCartState(state) {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
    
    // Action for starting any async operation
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    
    // Action for when fetchCart succeeds
    fetchCartSuccess(state, action: PayloadAction<CartItem[]>) {
      state.loading = false;
      state.items = action.payload;
    },
    
    // Action for when any async operation fails
    operationFailed(state, action: PayloadAction<ApiErrorResponse>) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Action for when addCartItem succeeds
    addCartItemSuccess(state, action: PayloadAction<CartItem | CartItem[]>) {
      state.loading = false;
      
      console.log('Reducer payload:', action.payload);
      
      // Handle case where API returns full cart array
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
        return;
      }
      
      // Handle single item update
      const payload = action.payload as CartItem;
      const existingIndex = state.items.findIndex(
        item => item.product._id === payload.product._id
      );
      
      if (existingIndex !== -1) {
        state.items[existingIndex] = payload;
      } else {
        state.items.push(payload);
      }
    },
    
    // Action for when removeCartItem succeeds
    removeCartItemSuccess(state, action: PayloadAction<{ productId: string }>) {
      state.loading = false;
      state.items = state.items.filter(
        item => item.product._id !== action.payload.productId
      );
    },
    
    // Action for when updateCartQuantity succeeds
    updateCartQuantitySuccess(state, action: PayloadAction<CartItem[]>) {
      state.loading = false;
      state.items = action.payload; // Replace entire cart with updated data
    },
  },
});

// Export the plain action creators
export const {
  clearCartState,
  startLoading,
  fetchCartSuccess,
  operationFailed,
  addCartItemSuccess,
  removeCartItemSuccess,
  updateCartQuantitySuccess,
} = cartSlice.actions;

// Selectors (unchanged)
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCount = createSelector(
  [selectCartItems],
  items => items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  items => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
);

export default cartSlice.reducer;