'use client'
// src/app/(private)/orders/page.tsx
import { useEffect, useState } from 'react';
import type { Order } from '@/types';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await apiFetch<Order[]>('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOrders();
  }, []);

  if (!orders.length) return <p className="p-4">No past orders found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {orders.map((o) => (
        <Link key={o._id} href={`/order-confirmation?orderId=${o._id}`}>
          <div className="border rounded p-4 hover:bg-gray-50">
            <div>Order ID: {o._id}</div>
            <div>Total: ${o.total.toFixed(2)}</div>
            <div>Status: {o.status}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
