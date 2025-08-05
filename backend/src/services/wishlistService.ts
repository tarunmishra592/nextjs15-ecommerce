import { User } from '../models/User';
import { Product } from '../models/Product';

export async function getWishlist(userId: string) {
  const user = await User.findById(userId).populate('wishlist', 'name price images').lean();
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return user.wishlist || [];
}

export async function addToWishlist(userId: string, productId: string) {
  const product = await Product.findById(productId);
  if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404 });

  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const already = user.wishlist?.some((id) => id.equals(product._id));
  if (!already) {
    user.wishlist = user.wishlist || [];
    user.wishlist.push(product._id);
    await user.save();
  }
  return getWishlist(userId);
}

export async function removeFromWishlist(userId: string, productId: string) {
  await User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: productId } },
    { new: true }
  ).exec();
  return getWishlist(userId);
}
