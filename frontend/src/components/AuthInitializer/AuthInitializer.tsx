// components/AuthInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchCart } from '@/services/cartService';
import { fetchWishlist } from '@/services/wishlistService';
import { fetchUser } from '@/services/authService';
import { verifyAuth } from '@/lib/auth';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    verifyToken()
  }, [dispatch]);

  const verifyToken = async () => {
    const isValid = await verifyAuth(dispatch);
    if (isValid?.token) {
      dispatch(fetchUser());
      dispatch(fetchCart())
      dispatch(fetchWishlist())
    }
  }

  return null; // This component doesn't render anything
}