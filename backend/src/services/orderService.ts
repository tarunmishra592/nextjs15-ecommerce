import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { IUser } from '../models/User';

export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number }[],
  shippingAddressId: string,
  paymentMethod: string
) {
  // Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Verify products and lock prices
    const products = await Product.find({ 
      _id: { $in: items.map(i => i.productId) } 
    }).session(session);

    if (products.length !== items.length) {
      throw new Error('Some products not found');
    }

    // 2. Prepare order items with locked prices
    const orderItems = items.map(item => {
      const product = products.find(p => p._id.toString() === item.productId)!;
      return {
        product: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price,
        name: product.name // Store product name at time of order
      };
    });

    // 3. Calculate totals
    const subtotal = orderItems.reduce(
      (sum, item) => sum + (item.priceAtOrder * item.quantity),
      0
    );
    const total = subtotal; // Add shipping, taxes etc. if needed

    // 4. Create order
    const order = await Order.create([{
      user: userId,
      items: orderItems,
      shippingAddress: shippingAddressId,
      paymentMethod,
      status: 'pending_payment',
      subtotal,
      total,
      paid: false
    }], { session });

    // 5. Reserve inventory
    for (const item of items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { inventory: -item.quantity } },
        { session }
      );
    }

    // Commit transaction
    await session.commitTransaction();
    
    return order[0];
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function listOrders(userId: string) {
  return await Order.find({ user: userId }).populate('items.product shippingAddress').sort({ createdAt: -1 });
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product shippingAddress');
  if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  return order;
}


