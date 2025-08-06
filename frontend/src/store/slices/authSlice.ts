import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthTokens} from '@/types';
import { RootState } from '../store';

const initialState: AuthState = { 
  user: null, 
  token: null, 
  loading: false, 
  error: '' 
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    logout(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = '';
      localStorage.removeItem('token');
    },
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
      }
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    
    // Loading/error states
    startLoading(state) {
      state.loading = true;
      state.error = '';
    },
    authFailed(state, action: PayloadAction<{message: string, status: number}>) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Success actions
    loginSuccess(state, action: PayloadAction<AuthTokens>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = '';
      localStorage.setItem('token', action.payload.token);
    },
    fetchUserSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.user = action.payload;
      state.error = '';
    }
  },
});

// Export actions
export const { 
  logout, 
  initializeAuth, 
  setUser,
  startLoading,
  authFailed,
  loginSuccess,
  fetchUserSuccess
} = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;