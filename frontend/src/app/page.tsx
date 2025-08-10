// app/page.tsx
'use client'

import HeroSlider from '@/components/HeroSlider/HeroSlider'
import ProductCarousel from '@/components/ProductCarousel/ProductCarousel'
import { Product } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { clientApi } from '@/lib/client-api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);
  const [newArrivals, setNewArrivals] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, newProducts] = await Promise.all([
          clientApi(`/products?tags=featured&limit=8`),
          clientApi(`/products?tags=new&limit=8`)
        ]);
        setFeaturedProducts(featured.products);
        setNewArrivals(newProducts.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-8">
      {/* Hero Slider with Skeleton */}
      {isLoading ? (
        <div className="relative w-full aspect-[16/9]">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ) : (
        <HeroSlider />
      )}

      {/* Featured Products Carousel with Skeleton */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-[45%] sm:w-[30%] md:w-[22%]">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <ProductCarousel 
            title="Feature Products" // Title is already rendered above
            products={featuredProducts || []} 
          />
        )}
      </div>

      {/* New Arrivals Carousel with Skeleton */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex gap-4 overflow-hidden px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-[45%] sm:w-[30%] md:w-[22%]">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <ProductCarousel 
            title="New Arrivals" // Title is already rendered above
            products={newArrivals || []}
          />
        )}
      </div>
    </div>
  )
}