import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/config';
import { Order } from '../models/Order';
import mongoose from 'mongoose';
import { sendOrderConfirmationEmail } from './emailService'

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export async function createRazorpayOrder(amount: number, currency = 'INR', receipt?: string) {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
  });
  return order;
}

// services/paymentService.ts
export async function verifyPaymentSignature(
  payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  orderId: string
) {
  // 1. Verify Razorpay signature
  const body = `${payload.razorpay_order_id}|${payload.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== payload.razorpay_signature) {
    throw new Error('Invalid payment signature');
  }

  // 2. Update order status
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order: any = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          paid: true,
          paidAt: new Date(),
          status: 'processing',
          razorpayOrderId: payload.razorpay_order_id,
          razorpayPaymentId: payload.razorpay_payment_id
        }
      },
      { new: true, session }
    ).populate('items.product').populate('user', 'email');;


    if (!order) {
      throw new Error('Order not found');
    }

    // await sendOrderConfirmationEmail(order?.user?.email, order);

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}