// app/page.tsx

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import HeroSlider from '@/components/HeroSlider/HeroSlider'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'
import { apiFetch } from '@/lib/api'
import { Product } from '@/types'

export default async function HomePage() {

  
  const [featured, newArrivals] = await Promise.all([
    apiFetch('/products?tags=featured&limit=8'),
    apiFetch('/products?tags=new&limit=8'),
  ]) as [Product[], Product[]];

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