// app/page.tsx
import HeroSlider from '@/components/HeroSlider/HeroSlider'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'
import { apiFetch } from '@/lib/api'
import { Product } from '@/types'

export default async function HomePage() {
  const [featured, newArrivals]: [Product[], Product[]] =
    await Promise.all([
      apiFetch('/products?tags=featured&limit=8'), // Added limit
      apiFetch('/products?tags=new&limit=8'),      // Added limit
    ])

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