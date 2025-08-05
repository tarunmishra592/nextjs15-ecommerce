import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    amount: z.number().min(1),
    currency: z.string().default('INR'),
    receipt: z.string().optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
    orderId: z.string().optional(), // your internal order reference
  }),
});
