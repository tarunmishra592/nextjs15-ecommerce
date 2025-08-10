'use client';
import React, { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { Toaster } from 'react-hot-toast';

export default function MainProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<any>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>
    <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    {children}
  </Provider>;
}
