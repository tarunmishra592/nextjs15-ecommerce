import ProductActions from '@/components/ProductActions/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery/ProductImageGallery';
import { apiFetch } from '@/lib/api';
import { Product, Review } from '@/types';

type Props = {
  params: Promise<{ id: string }>
}


export default async function ProductPage({ params }: Props) {

  const { id } = await params;

  const product: Product = await apiFetch(`/products/${id}`);
  const productReviews: Review[] = await apiFetch(`/products/${id}/reviews`);


  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      Test
    </div>
  );
}