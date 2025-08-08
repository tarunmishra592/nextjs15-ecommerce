import { User } from '../models/User';
import { Product } from '../models/Product';

export async function getCart(userId: string) {
  const user = await User.findById(userId)
    .populate('cart.product', 'name price images')
    .lean();
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return user.cart || [];
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const product = await Product.findById(productId);
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404 });

  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const existing = user.cart?.find((i) => i.product.equals(product._id));
  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart = user.cart || [];
    user.cart.push({ product: product._id, quantity });
  }
  await user.save();
  return getCart(userId);
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const item = user.cart?.find((i) => i.product.equals(productId));
  if (!item) throw Object.assign(new Error('Cart item not found'), { statusCode: 404 });

  item.quantity = quantity;
  await user.save();
  return getCart(userId);
}

export async function removeCartItem(userId: string, productId: string) {
  await User.findByIdAndUpdate(
    userId,
    { $pull: { cart: { product: productId } } },
    { new: true }
  ).exec();
  return getCart(userId);
}


export async function clearUserCart(userId: string) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { cart: [] } }, // Empty the cart array
    { new: true }
  ).exec();

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  return {
    items: [],
    total: 0,
    count: 0
  };
}