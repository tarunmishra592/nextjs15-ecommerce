'use client'

import { Product } from '@/types'
import Filters from '@/components/Filters/Filters'
import ProductListing from '@/components/ProductListing/ProductListing'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { clientApi } from '@/lib/client-api'

export default function ProductListPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [filterOptions, setFilterOptions] = useState<{
    categories: string[]
    priceRange: { min: number; max: number }
    tags: string[]
    colors: string[]
    sizes: string[]
  } | null>(null)

  const observer = useRef<IntersectionObserver>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchProducts = useCallback(async (pageNum: number, isInitialLoad = false) => {
    try {
      if (isInitialLoad) setIsLoading(true)
      else setIsFetchingMore(true)
      
      const params = new URLSearchParams()
      searchParams.forEach((value: any, key: any) => {
        params.append(key, value)
      })
      params.append('page', pageNum.toString())
      params.append('limit', '12') // Adjust limit as needed

      const response = await clientApi(`/products?${params.toString()}`)
      const productsData: Product[] = response.products || []

      if (isInitialLoad) {
        // Extract filter options only on initial load
        const categories = Array.from(new Set(productsData.map(p => p.category))).filter(Boolean)
        const tags = Array.from(new Set(productsData.flatMap(p => p.tags || []))).filter(Boolean)
        const colors = Array.from(new Set(productsData.flatMap(p => p.variants?.colors || []))).filter(Boolean)
        const sizes = Array.from(new Set(productsData.flatMap(p => p.variants?.sizes || []))).filter(Boolean)
        const priceRange = {
          min: Math.min(...productsData.map(p => p.price)),
          max: Math.max(...productsData.map(p => p.price))
        }

        setFilterOptions({
          categories,
          priceRange,
          tags,
          colors,
          sizes
        })
      }

      setProducts(prev => isInitialLoad ? productsData : [...prev, ...productsData])
      setHasMore(productsData.length >= 12) // Same as your limit
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      if (isInitialLoad) setIsLoading(false)
      else setIsFetchingMore(false)
    }
  }, [searchParams])

  // Initial load and when filters change
  useEffect(() => {
    setPage(1)
    setProducts([])
    setHasMore(true)
    fetchProducts(1, true)
  }, [fetchProducts])

  // Infinite scroll setup
  useEffect(() => {
    if (!hasMore || isLoading) return

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && !isFetchingMore) {
        setPage(prev => prev + 1)
      }
    }

    observer.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    })

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [hasMore, isLoading, isFetchingMore])

  // Fetch more products when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page)
    }
  }, [page, fetchProducts])

  return (
    <div className="container mx-auto sm:px-6 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 h-full">
        {/* Filters Skeleton */}
        {isLoading ? (
          <div className="w-full md:w-64 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <div className="space-y-4 pt-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ) : (
          <Filters 
            categories={filterOptions?.categories || []}
            priceRange={filterOptions?.priceRange || { min: 0, max: 1000 }}
            tags={filterOptions?.tags || []}
            colors={filterOptions?.colors || []}
            sizes={filterOptions?.sizes || []}
          />
        )}

        {/* Product Listing */}
        <ProductListing 
          products={products} 
          searchParams={Object.fromEntries(searchParams.entries())} 
          isFetchingMore={isFetchingMore}
          sentinelRef={sentinelRef}
        />
      </div>
    </div>
  )
}