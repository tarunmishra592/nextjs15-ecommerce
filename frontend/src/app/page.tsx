// app/page.tsx

import HeroSlider from '@/components/HeroSlider/HeroSlider'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'

export default async function HomePage() {

  return (
    <div className="space-y-16 pb-8"> {/* Added bottom padding */}
      <HeroSlider />
      
      <ProductCarousel 
        title="Featured Products" 
        tag={'featured'} 
      />

      <ProductCarousel 
        title="New Arrivals" 
        tag={'new'} 
      />
    </div>
  )
}