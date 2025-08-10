// components/ProductActions.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { addCartItem } from '@/services/cartService';
import useAuth from '@/hooks/useAuth';
import { RootState, useAppDispatch } from '@/store/store';
import { addWishlistItem, removeWishlistItem } from '@/services/wishlistService';
import { useSelector } from 'react-redux';

interface ProductActionsProps {
  productId: string;
  price: number;
  stock: number;
}

export default function ProductActions({ productId, price, stock }: ProductActionsProps) {
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items); 
  const isInWishlist = wishlistItems.some(item => item._id === productId);
  const { isAuthenticated } = useAuth()


  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(stock, value));
    setQuantity(newQuantity);
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
  
    try {
      // Dispatch the action and wait for it to complete
      const result = await dispatch(addCartItem(productId, quantity));
      if (result) {
        toast.success('Added to cart!');
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
        dispatch(removeWishlistItem(productId));
        toast.error('Removed from wishlist!');
      } else {
        console.log('Attempting to add to wishlist');
        dispatch(addWishlistItem(productId));
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
      toast.error('Failed to update wishlist');
    }
  };

  

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-semibold">Quantity:</span>
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-12 text-center border-x py-1 focus:outline-none"
          />
          <button
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= stock}
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-600">
          {stock} Available
        </span>
      </div>

      {/* Price and Actions */}
      <div className="pt-2 space-y-2">
        <div className='flex gap-2'>
            <button
            onClick={addToCart}
            disabled={isAdding || stock === 0}
            className={`w-full py-3 px-6 rounded-md font-medium shadow-sm transition-colors ${
                stock === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-500 text-black'
            }`}
            >
            {stock === 0 ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
            disabled={stock === 0}
            onClick={handleWishlist}
            className={`w-full py-3 px-6 rounded-md font-medium shadow-sm transition-colors ${
                stock === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-400 hover:bg-green-500 text-black'
            }`}
            >
            Add to Wishlist
            </button>
        </div>
      </div>
    </div>
  );
}