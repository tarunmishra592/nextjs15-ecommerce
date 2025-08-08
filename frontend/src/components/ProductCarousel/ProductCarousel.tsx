// components/ProductCarousel/ProductCarousel.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import ProductCard from '../ProductCard/ProductCard'
import { Product } from '@/types'
import 'swiper/css'
import 'swiper/css/navigation'
import { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { apiFetch } from '@/lib/client-api'

interface ProductCarouselProps {
  title: string
  tag: string
}

export default function ProductCarousel({ title, tag }: ProductCarouselProps) {
  const swiperRef = useRef<any>(null)
  const [products, setProducts] = useState<Product[]>([])


  useEffect(() => {
    async function getProducts(){
      apiFetch<Product[]>(`/products?tags=${tag}&limit=8`)
        .then((data: Product[]) => {
          setProducts(data);
        })
        .catch(console.error);
    }
    getProducts()
  }, [tag])

  return (
    <section className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Previous products"
          >
            <FiChevronLeft className="text-xl text-gray-700" />
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Next products"
          >
            <FiChevronRight className="text-xl text-gray-700" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: '.custom-prev',
          nextEl: '.custom-next'
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }
        }}
      >
        {products.length > 0 && products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}