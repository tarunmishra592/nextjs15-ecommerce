// app/page.tsx

import HeroSlider from '@/components/HeroSlider/HeroSlider'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'
import { serverFetch } from '@/lib/server-api';
import { Product } from '@/types';

export default async function HomePage() {


  const [featuredProducts, newArrivals] = await Promise.all([
    serverFetch<Product[]>(`/products?tags=featured&limit=8`),
    serverFetch<Product[]>(`/products?tags=new&limit=8`)
  ]);

  return (
    <div className="space-y-16 pb-8"> {/* Added bottom padding */}
      <HeroSlider />
      
      <ProductCarousel 
        title="Featured Products" 
        products={featuredProducts} 
      />

      <ProductCarousel 
        title="New Arrivals" 
        products={newArrivals}
      />
    </div>
  )
}