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
    const initializeAuth = async () => {
        try{
          const result = await verifyAuth(dispatch);        
          if (result?.token) {
            await Promise.all([
              dispatch(fetchUser()),
              dispatch(fetchCart()),
              dispatch(fetchWishlist())
            ]);
          }
        }catch(err){
          console.log('token err', err)
        }
    };
    initializeAuth()
  }, [dispatch]);

  return null; // This component doesn't render anything
}