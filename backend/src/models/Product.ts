import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  images?: string[];
  stock: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  variants?: {
    colors?: string[];
    sizes?: string[];
  };
  discountPercentage?: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, minlength: 1 },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, index: true },
    images: [{ type: String, trim: true }],
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    tags: [{ type: String, lowercase: true, trim: true }],
    variants: {
      colors: [{ type: String, lowercase: true, trim: true }],
      sizes: [{ type: String, uppercase: true, trim: true }]
    },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

// Add indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ 'variants.colors': 1 });
ProductSchema.index({ 'variants.sizes': 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ discountPercentage: -1 });

// Create and export the model
export const Product = model<IProduct>('Product', ProductSchema);