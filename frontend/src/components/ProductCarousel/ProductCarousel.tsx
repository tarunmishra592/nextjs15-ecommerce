// components/ProductCarousel/ProductCarousel.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import ProductCard from '../ProductCard/ProductCard'
import { Product } from '@/types'
import 'swiper/css'
import 'swiper/css/navigation'
import { useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface ProductCarouselProps {
  title: string
  products: Product[]
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const swiperRef = useRef(null)

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
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}