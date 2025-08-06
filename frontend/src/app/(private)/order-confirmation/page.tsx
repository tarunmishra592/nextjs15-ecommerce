'use client'
// src/app/(private)/order-confirmation/page.tsx
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Order } from '@/types';
import { apiFetch } from '@/lib/api';

export default function ConfirmationPage() {
  const params = useSearchParams();
  const orderId = params.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      apiFetch<Order>(`/orders/${orderId}`)
        .then((data: Order) => {
          setOrder(data);
        })
        .catch(console.error);
    }
  }, [orderId]);

  if (!order) return <p className="p-4">Loading confirmation...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Order Confirmed</h1>
      <div>Order ID: {order._id}</div>
      <div>Total Paid: ${order.total.toFixed(2)}</div>
      <div>Status: {order.status}</div>
      {/* Optionally list ordered products */}
    </div>
  );
}
