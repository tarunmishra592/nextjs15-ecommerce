import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/config';
import { Order as OrderModel } from '../models/Order';

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

export async function verifyPaymentSignature(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}, internalOrderId?: string) {
  const bodyString = `${payload.razorpay_order_id}|${payload.razorpay_payment_id}`;
  const expected = crypto
    .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
    .update(bodyString)
    .digest('hex');

  if (expected !== payload.razorpay_signature) {
    throw Object.assign(new Error('Invalid payment signature'), { statusCode: 400 });
  }

  // Optionally update your internal order in DB
  if (internalOrderId) {
    await OrderModel.findByIdAndUpdate(internalOrderId, {
      paid: true,
      paidAt: new Date(),
      razorpayOrderId: payload.razorpay_order_id,
      razorpayPaymentId: payload.razorpay_payment_id,
    });
  }

  return true;
}
