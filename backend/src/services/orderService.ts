import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { IUser } from '../models/User';

export async function createOrder(userId: string, items: { productId: string; quantity: number }[], shippingAddressId: string, paymentMethod: string) {
  // Fetch products to lock price
  const products = await Product.find({ _id: { $in: items.map(i => i.productId) } });
  if (products.length !== items.length) throw Object.assign(new Error('Some products not found'), { statusCode: 400 });

  const orderItems = items.map(i => {
    const prod = products.find(p => p._id.toString() === i.productId)!;
    return {
      product: prod._id,
      quantity: i.quantity,
      priceAt: prod.price,
    };
  });

  const total = orderItems.reduce((sum, it) => sum + it.priceAt * it.quantity, 0);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress: shippingAddressId,
    total,
    paid: false,
    status: 'pending',
  });

  return order;
}

export async function listOrders(userId: string) {
  return await Order.find({ user: userId }).populate('items.product shippingAddress').sort({ createdAt: -1 });
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product shippingAddress');
  if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  return order;
}


