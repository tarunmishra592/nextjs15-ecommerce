'use client'

import { removeCartItem } from "@/services/cartService";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";


export default function CartPopover({cartItems, isCartOpen, cartLen, setIsCartOpen}){

    const dispatch = useDispatch()

    const handleRemoveItem = async (productId) => {
        try {
          // Dispatch the action and wait for it to complete
          const result = dispatch(removeCartItem(productId));
  
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

    return(
        <>
         {isCartOpen && cartLen > 0 && (
            <div 
              className="absolute -right-6 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <div className="p-4 max-h-96 overflow-y-auto">
                <h3 className="font-medium text-lg mb-3">Your Cart ({cartLen})</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className={`flex items-center gap-3 pb-3 ${cartItems.length == 1 ? '' : 'border-b border-green-100'}`}>
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Link href={`products/${item._id}`}>
                            <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                            />
                        </Link>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm line-clamp-1">
                            <Link href={`products/${item._id}`}>
                                {item.product.name}
                            </Link>
                        </h4>
                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        <p className="text-green-600 font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-green-200 p-4 bg-green-100">
                <Link 
                  href="/cart" 
                  className="block w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition"
                  onClick={() => setIsCartOpen(false)}
                >
                  View Cart
                </Link>
              </div>
            </div>
          )}
    </>
    )
}