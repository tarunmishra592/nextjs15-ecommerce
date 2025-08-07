'use client'
import { apiFetch } from "@/lib/api";
import { Order } from "@/types";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";

// app/(private)/order-confirmation/page.tsx
export default function ConfirmationPage() {
  const params = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = params.get('orderId');
        if (orderId) {
          const data = await apiFetch<any>(`/orders/${orderId}`);
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params]);

  if (loading) return <div className="p-4 text-center">Loading order details...</div>;
  if (!order) return <div className="p-4 text-center">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold mt-4">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Your order #{order._id} has been placed successfully
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {order._id}</p>
              <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
              <p><span className="font-medium">Status:</span> <span className="capitalize">{order.status.replace('_', ' ')}</span></p>
              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
              <p><span className="font-medium">Total Paid:</span> ₹{(order.total / 100).toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
            {order.shippingAddress && (
              <div className="space-y-2">
                <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p>{order.shippingAddress.address}</p>
                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item._id} className="flex border-b pb-4">
                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  {item.product?.images?.[0] && (
                    <Image 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.product?.name || 'Product'}</h3>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-gray-600">₹{(item.priceAtOrder / 100).toFixed(2)} each</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{(item.priceAtOrder * item.quantity / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link href="/orders" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}