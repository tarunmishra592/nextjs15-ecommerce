import ProductActions from '@/components/ProductActions/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery/ProductImageGallery';
import { apiFetch } from '@/lib/api';
import { Product, Review } from '@/types';

type Props = {
  params: Promise<{ id: string }>
}


export default async function ProductPage({ params }: Props) {

  const { id } = await params;

  let product: any | null = null;
  // let productReviews: Review[] = [];
  let error = null;

  try {
    product = await apiFetch(`/products/${id}`);
    // productReviews = await apiFetch(`/products/${id}/reviews`);
  } catch (err) {
    console.log(err)
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          Failed to load product data: {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded">
          Product not found
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        test
      </div>

      {/* Reviews Section */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">Customer reviews</h2>
        
       
      </section>
    </div>
  );
}