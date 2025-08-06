// app/products/[id]/page.tsx
import ProductActions from '@/components/ProductActions/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery/ProductImageGallery';
import { apiFetch } from '@/lib/api';
import { Product, Review } from '@/types';

type Props = {
  params: { id: string }
}


export default async function ProductPage({ params }: Props) {

  const { id } = params;

  const product: Product & { reviews?: Review[] } = await apiFetch(`/products/${id}`);
  const productReviews: Review[] = await apiFetch(`/products/${id}/reviews`);


  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Gallery Section */}
        {product.images && product.images.length > 0 ? (
          <ProductImageGallery images={product.images} productName={product.name} />
        ) : (
          <div className="md:w-1/2 bg-gray-100 aspect-square flex items-center justify-center rounded-lg">
            <span className="text-gray-500">No images available</span>
          </div>
        )}

        {/* Product Info Section */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-blue-600 hover:underline cursor-pointer">
              {product.reviewCount ?? 0} Ratings
            </span>
          </div>
          
          <div className="border-t border-green-200 pt-4"></div>
          
          <p className="text-2xl font-semibold text-green-600">₹{product.price.toFixed(2)}</p>
          
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Availability:</span> 
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? ' In Stock' : ' Out of Stock'}
              </span>
            </p>
            {product.category && (
              <p className="text-sm">
                <span className="font-semibold">Category:</span> {product.category}
              </p>
            )}
          </div>
          
          <div className="border-t border-green-200 pt-4"></div>
          
          <h2 className="text-lg font-semibold">About this item</h2>
          <p className="text-gray-700">{product.description}</p>
          
          {/* Product Actions with Quantity */}
          <ProductActions 
            productId={product._id} 
            price={product.price} 
            stock={product.stock} 
          />
        </div>
      </div>

      {/* Reviews Section */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Customer reviews</h2>
        
        {productReviews?.length ? (
          <div className="space-y-6">
            {productReviews.map((r) => (
              <div key={r._id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-semibold">{r.user?.name || 'Anonymous'}</div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= (r.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{r.comment}</p>
                <div className="text-gray-500 text-sm">
                  Reviewed on {new Date(r.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            {/* <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Write a Review
            </button> */}
          </div>
        )}
      </section>
    </div>
  );
}