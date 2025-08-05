// hooks/useInitializeAuth.ts
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeAuth, fetchUser } from '@/store/slices/authSlice';

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