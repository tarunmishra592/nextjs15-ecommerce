// hooks/useInitializeAuth.ts
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';
import { fetchUser } from '@/services/authService';

export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize token from localStorage
    dispatch(initializeAuth());
    
    // If token exists, fetch user data
    if (localStorage.getItem('token')) {
      dispatch(fetchUser());
    }
  }, [dispatch]);
};