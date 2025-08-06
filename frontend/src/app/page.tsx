// app/page.tsx
import HeroSlider from '@/components/HeroSlider/HeroSlider'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'
import { apiFetch } from '@/lib/api'
import { Product } from '@/types'

export default async function HomePage() {

  function isProductArray(value: unknown): value is Product[] {
    return Array.isArray(value)
      && value.every(item => typeof item.id === 'string' && typeof item.name === 'string');
  }

  async function fetchProducts(url: string) {
    const data: unknown = await apiFetch<unknown>(url);
    if (isProductArray(data)) return data;
    throw new Error('Invalid product array');
  }


  const [featured, newArrivals] = await Promise.all([
    fetchProducts('/products?tags=featured&limit=8'),
    fetchProducts('/products?tags=new&limit=8'),
  ]);

  return (
    <div className="space-y-16 pb-8"> {/* Added bottom padding */}
      <HeroSlider />
      
      <ProductCarousel 
        title="Featured Products" 
        products={featured} 
      />

      <ProductCarousel 
        title="New Arrivals" 
        products={newArrivals} 
      />
    </div>
  )
}