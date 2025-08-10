// components/CartItem/CartItem.tsx
'use client'
import Image from 'next/image'
import { Product } from '@/types'
import { useAppDispatch } from '@/store/hooks'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'
import { removeCartItem, updateCartQuantity } from '@/services/cartService'
import { formatINR } from '@/lib/utils'

export default function CartItem({ product, quantity }: { product: Product; quantity: number }) {
  const dispatch = useAppDispatch()

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return; // Optional: Set max quantity
    
    try {
      await dispatch(updateCartQuantity(product._id, newQuantity));
      // Optional: Show success message or update local state if needed
    } catch (error) {
      // Error is already handled by Redux, but you can show a toast here if needed
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  return (
    <div className="flex items-start border-b-1 border-green-200 py-4 gap-4">
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={product.images?.[0] ?? '/placeholder.png'}
          alt={'Image'}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{product.name}</h4>
        <p className="text-gray-600">
          {formatINR(product?.price)}
        </p>
        
        <div className="flex items-center mt-3 gap-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button 
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              <FiMinus size={14} />
            </button>
            <span className="px-3 py-1 text-center w-8">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
            >
              <FiPlus size={14} />
            </button>
          </div>
          
          <button 
            onClick={() => handleRemoveItem(product._id)}
            className="text-red-600 hover:text-red-800 flex items-center gap-1"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="text-right font-medium">
        {formatINR(product.price * quantity)}
      </div>
    </div>
  )
}