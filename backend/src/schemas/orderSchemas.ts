import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    ).nonempty('Order must contain at least one item'),
    paymentMethod: z.enum(['razorpay', 'cod']),
    shippingAddressId: z.string().min(1),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
