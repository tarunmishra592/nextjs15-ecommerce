import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '@/types';

interface ProductState {
  list: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = { list: [], loading: false, error: null };

export const fetchProducts = createAsyncThunk<Product[], { tags?: string[]; search?: string }>(
  'products/fetchProducts',
  async (params) => {
    const url = new URL('/api/products', window.location.origin);
    if (params.tags) url.searchParams.set('tags', params.tags.join(','));
    if (params.search) url.searchParams.set('search', params.search);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts(state) {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching';
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
