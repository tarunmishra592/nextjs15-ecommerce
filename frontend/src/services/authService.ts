import { apiFetch } from '@/lib/api';
import { AppDispatch } from '@/store/store';
import { 
  startLoading, 
  authFailed, 
  loginSuccess, 
  fetchUserSuccess 
} from '@/store/slices/authSlice';
import type { 
  AuthTokens, 
  LoginCredentials, 
  User 
} from '@/types';

export const login = (credentials: LoginCredentials) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const data = await apiFetch<AuthTokens>('/auth/login', {
        method: 'POST',
        credentials: 'include',
        data: credentials,
      });
      dispatch(loginSuccess(data));
      return true;
    } catch (err: any) {
      const errorPayload = {
        message: err.message || 'Login failed',
        status: err.status || 500
      };
      dispatch(authFailed(errorPayload));
      return false;
    }
  };
};

export const fetchUser = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const data = await apiFetch<User>('/users/profile', {
        method: 'GET'
      });
      dispatch(fetchUserSuccess(data));
      return true;
    } catch (err: any) {
      localStorage.removeItem('token');
      const errorPayload = {
        message: err.message || 'Failed to fetch user',
        status: err.status || 500
      };
      dispatch(authFailed(errorPayload));
      return false;
    }
  };
};

export const register = (userData: any) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const data = await apiFetch<AuthTokens>('/auth/register', {
        method: 'POST',
        data: userData,
      });
      dispatch(loginSuccess(data));
      return true;
    } catch (err: any) {
      const errorPayload = {
        message: err.message || 'Registration failed',
        status: err.status || 500
      };
      dispatch(authFailed(errorPayload));
      return false;
    }
  };
};