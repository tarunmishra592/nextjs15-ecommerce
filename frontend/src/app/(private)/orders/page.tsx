import Link from 'next/link';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronRight, Package } from 'lucide-react';
import { RetryButton } from './RetryButton';
import { serverFetch } from '@/lib/server-api';

export default async function OrdersPage() {
  let orders: Order[] = [];
  let error: string | null = null;

  try {
    orders = await serverFetch<Order[]>('/orders');
  } catch (err) {
    console.error(err);
    error = 'Failed to load orders. Please try again later.';
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'shipped': 'bg-purple-100 text-purple-800',
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
          {/* Using our client component here */}
          <RetryButton />
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <div className="border rounded-lg p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
          <p className="mt-1 text-gray-500">
            Your order history will appear here once you make purchases.
          </p>
          <Link href="/products">
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order._id} href={`/order-confirmation?orderId=${order._id}`}>
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold">${order.total.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  View Details <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}