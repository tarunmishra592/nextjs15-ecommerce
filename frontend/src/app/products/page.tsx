// app/products/page.tsx

import { Product } from '@/types'
import { apiFetch } from '@/lib/api'
import Filters from '@/components/Filters/Filters'
import ProductListing from '@/components/ProductListing/ProductListing'

interface SearchParams {
  [key: string]: string | string[] | undefined
}

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Convert searchParams to URLSearchParams
  const params = new URLSearchParams()
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else {
        params.append(key, value)
      }
    }
  })

  // Fetch products with filters
  const products: Product[] = await apiFetch(`/products?${params.toString()}`)

  // Extract filter options from products
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean)
  const tags = Array.from(new Set(products.flatMap(p => p.tags || []))).filter(Boolean)
  const colors = Array.from(new Set(products.flatMap(p => p.variants?.colors || []))).filter(Boolean)
  const sizes = Array.from(new Set(products.flatMap(p => p.variants?.sizes || []))).filter(Boolean)
  
  // Calculate price range
  const priceRange = {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  }


  return (
    <div className="container mx-auto sm:px-6 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 h-full">
        <Filters 
          categories={categories}
          priceRange={priceRange}
          tags={tags}
          colors={colors}
          sizes={sizes}
        />
        <ProductListing products={products} searchParams={searchParams} />
      </div>
    </div>
  )
}