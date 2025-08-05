import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import * as paymentService from '../services/paymentService';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, currency, receipt } = req.body;
    const order = await paymentService.createRazorpayOrder(amount, currency, receipt);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const verifyOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentService.verifyPaymentSignature(req.body, req.body.orderId);
    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    next(err);
  }
};

// Optional webhook handler
export const webhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expected !== signature) return res.status(400).send('Invalid webhook signature');

  const event = req.body.event;
  // Process payload (e.g., payment.captured → mark order as paid)
  console.log('Webhook event:', event);

  res.status(200).json({ status: 'ok' });
};
