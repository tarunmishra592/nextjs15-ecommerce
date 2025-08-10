'use client'

import { Product } from '@/types'
import ProductCard from '@/components/ProductCard/ProductCard'
import { FiChevronDown } from 'react-icons/fi'
import { useSearchParams, useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

type QueryParams = Record<string, string>;

export interface ProductListingProps {
  products: Product[];
  searchParams: QueryParams;
  isFetchingMore: boolean;
  sentinelRef: any;
}

export default function ProductListing({ 
  products, 
  searchParams, 
  isFetchingMore,
  sentinelRef
}: ProductListingProps) {
  const router = useRouter()
  const params = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(params.toString())
    newParams.set('sort', e.target.value)
    router.push(`/products?${newParams.toString()}`)
  }

  return (
    <main className="flex-1">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
        </h1>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Sort by:</span>
          <div className="relative">
            <select
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm bg-white"
              defaultValue={searchParams.sort || 'featured'}
              onChange={handleSortChange}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="rating">Highest Rated</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard 
                key={`${product._id}-${product.category || Math.random().toString(36).substring(2, 9)}-${index}`} 
                product={product} />
            ))}
          </div>
          
          {/* Loading Skeletons when fetching more */}
          {isFetchingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {[...Array(4)].map((_, i) => (
                <div key={`skeleton-${i}`} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          )}

          {/* Sentinel element for infinite scroll */}
          <div ref={sentinelRef} className="h-1 w-full" />
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-lg font-medium text-gray-900">No products found</p>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </main>
  )
}