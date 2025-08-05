import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(5),
  }),
  params: z.object({
    productId: z.string().min(1),
  }),
});

export const reviewIdParamSchema = z.object({
  params: z.object({
    productId: z.string().min(1),
    id: z.string().min(1),
  }),
});
