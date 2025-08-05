import { z } from 'zod';

const variantsSchema = z.object({
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional()
}).optional();

const productBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  originalPrice: z.number().min(0, 'Original price must be non-negative').optional(),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  rating: z.number().min(0).max(5).optional(),
  tags: z.array(z.string()).optional().default([]),
  variants: variantsSchema
}).strict(); // Prevent unknown properties

export const createProductSchema = z.object({
  body: productBodySchema
});

export const updateProductSchema = z.object({
  body: productBodySchema.partial()
});