'use client'

import { FiFilter, FiStar, FiX } from 'react-icons/fi'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { BiCategory } from 'react-icons/bi'
import { TbDiscount } from 'react-icons/tb'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useCallback, useRef } from 'react'

interface FiltersProps {
  categories: string[]
  priceRange: { min: number; max: number }
  tags: string[]
  colors: string[]
  sizes: string[]
}

export default function Filters({
  categories,
  priceRange,
  colors,
  sizes
}: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [price, setPrice] = useState<[number, number]>([priceRange.min, priceRange.max])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])

  const debounceTimeoutRef = useRef<NodeJS.Timeout>(null)
  const lastFilterState = useRef<string>('')

  // Check if mobile on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Initialize state from URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    setPrice([
      params.get('minPrice') ? Number(params.get('minPrice')) : priceRange.min,
      params.get('maxPrice') ? Number(params.get('maxPrice')) : priceRange.max
    ])
    
    setSelectedCategories(params.get('category')?.split(',') || [])
    setSelectedRating(params.get('rating') ? Number(params.get('rating')) : null)
    setSelectedDiscount(params.get('discount') ? Number(params.get('discount')) : null)
    setSelectedTags(params.get('tags')?.split(',') || [])
    setSelectedColors(params.get('colors')?.split(',') || [])
    setSelectedSizes(params.get('sizes')?.split(',') || [])
  }, [searchParams, priceRange])

  // Create filter params and check if they changed
  const getFilterParams = useCallback(() => {
    const params = new URLSearchParams()
    
    if (price[0] !== priceRange.min || price[1] !== priceRange.max) {
      params.set('minPrice', price[0].toString())
      params.set('maxPrice', price[1].toString())
    }
    
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','))
    }
    
    if (selectedRating) {
      params.set('rating', selectedRating.toString())
    }
    
    if (selectedDiscount) {
      params.set('discount', selectedDiscount.toString())
    }
    
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','))
    }
    
    if (selectedColors.length > 0) {
      params.set('colors', selectedColors.join(','))
    }
    
    if (selectedSizes.length > 0) {
      params.set('sizes', selectedSizes.join(','))
    }
    
    return params.toString()
  }, [price, selectedCategories, selectedRating, selectedDiscount, selectedTags, selectedColors, selectedSizes, priceRange])

  // Apply filters with debounce and change detection
  const applyFilters = useCallback(() => {
    const currentFilters = getFilterParams()
    
    // Only apply if filters changed
    if (currentFilters !== lastFilterState.current) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      
      debounceTimeoutRef.current = setTimeout(() => {
        router.push(`${pathname}?${currentFilters}`)
        lastFilterState.current = currentFilters
      }, 500)
    }
  }, [getFilterParams, pathname, router])

  // Track filter changes and apply
  useEffect(() => {
    if (!isMobile) {
      applyFilters()
    }
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [applyFilters, isMobile])

  // Apply filters immediately for mobile
  const handleMobileApply = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    const currentFilters = getFilterParams()
    router.push(`${pathname}?${currentFilters}`)
    lastFilterState.current = currentFilters
    setMobileFiltersOpen(false)
  }

  // Reset all filters
  const resetFilters = () => {
    setPrice([priceRange.min, priceRange.max])
    setSelectedCategories([])
    setSelectedRating(null)
    setSelectedDiscount(null)
    setSelectedTags([])
    setSelectedColors([])
    setSelectedSizes([])
    router.push(pathname)
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <>
      {/* Mobile filter dialog toggle */}
      <div className="md:hidden mb-4">
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {/* Filter sidebar */}
      <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
        <div className="sticky top-4 space-y-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FiFilter className="text-green-600" />
              Filters
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={resetFilters}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Reset All
              </button>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Price Filter */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="px-2">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={price[1]}
                onChange={(e) => setPrice([price[0], Number(e.target.value)])}
                className="w-full mb-2"
              />
              <div className="flex justify-between text-sm">
                <span>${price[0]}</span>
                <span>${price[1]}</span>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <BiCategory />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`cat-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="mr-2 rounded text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor={`cat-${category}`} className="text-sm">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating Filter */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FiStar className="text-yellow-400" />
              Rating
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center">
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name="rating"
                    checked={selectedRating === rating}
                    onChange={() => setSelectedRating(rating)}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < rating ? (
                        <FaStar key={i} className="text-yellow-400 w-3 h-3" />
                      ) : (
                        <FaRegStar key={i} className="text-yellow-400 w-3 h-3" />
                      )
                    ))}
                    & Up
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Discount Filter */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TbDiscount className="text-red-500" />
              Discount
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[10, 20, 30, 40, 50].map(discount => (
                <button
                  key={discount}
                  onClick={() => setSelectedDiscount(discount)}
                  className={`text-sm border rounded px-2 py-1 ${
                    selectedDiscount === discount
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {discount}% Off
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          {colors.length > 0 && (
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <IoColorPaletteOutline />
                Colors
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColors(prev =>
                        prev.includes(color)
                          ? prev.filter(c => c !== color)
                          : [...prev, color]
                      )
                    }}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColors.includes(color)
                        ? 'border-green-500'
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Filter */}
          {sizes.length > 0 && (
            <div className="pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSizes(prev =>
                        prev.includes(size)
                          ? prev.filter(s => s !== size)
                          : [...prev, size]
                      )
                    }}
                    className={`px-3 py-1 border rounded text-sm ${
                      selectedSizes.includes(size)
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button (mobile only) */}
          {isMobile && (
            <div className="md:hidden flex gap-2 pt-4">
              <button
                onClick={handleMobileApply}
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                Apply Filters
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileFiltersOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}
    </>
  )
}