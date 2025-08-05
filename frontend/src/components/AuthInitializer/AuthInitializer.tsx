// components/AuthInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';
import { fetchCart } from '@/services/cartService';
import { fetchWishlist } from '@/services/wishlistService';
import { fetchUser } from '@/services/authService';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Initialize token from localStorage
    dispatch(initializeAuth());
    
    // 2. If token exists, fetch user data
    if (localStorage.getItem('token')) {
      dispatch(fetchUser());
      dispatch(fetchCart())
      dispatch(fetchWishlist())
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}