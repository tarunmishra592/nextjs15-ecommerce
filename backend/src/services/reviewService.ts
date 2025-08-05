import { Review } from '../models/Review';
import { Product } from '../models/Product';

export async function addReview(userId: string, productId: string, rating: number, comment: string) {
  const existing = await Review.findOne({ user: userId, product: productId });
  if (existing) throw Object.assign(new Error('Review already exists'), { statusCode: 409 });

  const review = await Review.create({ user: userId, product: productId, rating, comment });

  // Optionally update product average rating & count
  const aggregated = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (aggregated.length) {
    await Product.findByIdAndUpdate(productId, {
      rating: aggregated[0].avgRating,
      reviewCount: aggregated[0].count,
    });
  }

  return review;
}

export async function listReviews(productId: string) {
  return await Review.find({ product: productId }).populate('user', 'name').sort({ createdAt: -1 });
}

export async function deleteReview(userId: string, productId: string, reviewId: string) {
  const review = await Review.findOneAndDelete({ _id: reviewId, product: productId, user: userId });
  if (!review) throw Object.assign(new Error('Review not found or unauthorized'), { statusCode: 404 });
}
