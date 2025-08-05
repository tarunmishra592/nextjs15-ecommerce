'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import Image from 'next/image'
import { Button } from '../ui/button'

const slides = [
  {
    title: 'Wireless Headphones',
    btnText: 'Shop Now',
    imageUrl: '/banner/banner01.png'
  },
  {
    title: 'Smart Fitness Watch',
    btnText: 'Shop Now',
    imageUrl: '/banner/banner02.png'
  },
  {
    title: 'Wireless Mouse',
    btnText: 'Shop Now',
    imageUrl: '/banner/banner03.png'
  }
]

export default function HeroSlider() {
  return (
    <div className="h-64 md:h-96 w-full relative">
      <Swiper
        slidesPerView={1}
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              {/* Using Next.js Image component */}
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={index === 0} // Only preload first image
                quality={80}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute bottom-10 left-10 bg-black bg-opacity-50 text-white p-4 rounded max-w-md">
                <h2 className="text-2xl font-bold">{slide.title}</h2>
                <Button variant="danger" className="mt-2">
                  {slide.btnText}
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}