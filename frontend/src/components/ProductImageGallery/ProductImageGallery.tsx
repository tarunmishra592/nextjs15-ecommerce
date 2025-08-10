// components/ProductImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="md:w-1/2">
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnail Strip */}
        <div className="flex md:flex-col gap-2 py-2 md:py-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`flex-shrink-0 w-16 h-16 border rounded focus:outline-none transition-all ${
                selectedImage === img ? 'border-green-500 border-2' : 'border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden border border-green-200">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="relative w-full h-full"
          >
            <Image
              src={selectedImage}
              alt={productName}
              fill
              className={`object-contain p-4 transition-transform duration-300 ${
                isZoomed ? 'scale-160 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </button>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded hidden md:block">
            {isZoomed ? 'Click to zoom out' : 'Click to zoom'}
          </div>
        </div>
      </div>

      {/* Full image row for mobile */}
      {images.length > 1 && (
        <div className="mt-4 md:hidden grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`border rounded-md overflow-hidden ${
                selectedImage === img ? 'border-blue-500 border-2' : 'border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
          {images.length > 4 && (
            <div className="flex items-center justify-center text-gray-500 text-sm">
              +{images.length - 4} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}