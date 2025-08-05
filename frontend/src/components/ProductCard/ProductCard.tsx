// components/ProductCard/ProductCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingCart } from 'react-icons/fi'
import { IoMdHeartEmpty } from 'react-icons/io'
import { BsCheckCircleFill } from 'react-icons/bs'
import { Product } from '@/types'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import useAuth from '@/hooks/useAuth'
import { RootState } from '@/store/store'
import { addCartItem } from '@/services/cartService'
import { addWishlistItem, removeWishlistItem } from '@/services/wishlistService'

export default function ProductCard({ product, from=null }: { product: Product, from?: string | null }) {

  const dispatch = useDispatch()
  const { isAuthenticated } = useAuth()

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items); 
  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0


  const handleAddToCart = async () => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
        return;
      }
    
      try {
        // Dispatch the action and wait for it to complete
        const result = dispatch(addCartItem(product._id, 1));

        if (result) {
          toast.success('Added to cart!');
          if(from == 'wishlist'){
            dispatch(removeWishlistItem(product._id));
          }
        } else{
          toast.error('Failed to add to cart');
        }
      } catch (error) {
        toast.error('An error occurred');
        console.error('Add to cart error:', error);
      }
  };
  

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage your wishlist');
      return;
    }
  
    console.log('Current isInWishlist:', isInWishlist);
    
    try {
      if (isInWishlist) {
        console.log('Attempting to remove from wishlist');
        dispatch(removeWishlistItem(product._id));
        toast.error('Removed from wishlist!');
      } else {
        console.log('Attempting to add to wishlist');
        dispatch(addWishlistItem(product._id));
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
      {/* Product Image - Fixed Height */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:opacity-90 transition-opacity"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.tags?.includes('new') && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <BsCheckCircleFill className="mr-1" size={12} />
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discount}% Off
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 z-40 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {from !== 'wishlist' && <button onClick={handleWishlist} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <IoMdHeartEmpty className="text-gray-700" />
          </button>}
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <FiShoppingCart onClick={handleAddToCart} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product Info - Flex grow for consistent height */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name - Fixed height with line clamp */}
        <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
          <Link href={`/products/${product._id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>

        {/* Price - Fixed height */}
        <div className="flex items-center gap-2 mb-2 min-h-[1.75rem]">
          <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Variants Preview - Fixed height */}
          {product.variants?.colors && (
            <div className="min-h-[1.25rem] mt-2">
                <div className="flex gap-1">
                  {product.variants.colors.slice(0, 3).map((color) => (
                    <span 
                      key={color} 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {product.variants.colors.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{product.variants.colors.length - 3}
                    </span>
                  )}
                </div>
            </div>
          )}

        {/* Stock Status - Fixed position at bottom */}
        <p className={`mt-auto pt-2 text-sm ${
          product.stock > 0 ? 'text-green-600' : 'text-gray-500'
        }`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>
    </div>
  )
}