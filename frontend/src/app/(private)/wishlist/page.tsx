// src/app/(private)/wishlist/page.tsx
'use client'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ProductCard from '@/components/ProductCard/ProductCard';
import { IoMdHeartEmpty } from 'react-icons/io';
import Link from 'next/link';

export default function WishlistPage() {
  const items = useSelector((state: RootState) => state.wishlist.items);

  if (!items.length) {
    return(
      <div className="max-w-4xl mx-auto p-8 text-center">
        <IoMdHeartEmpty className="mx-auto text-4xl text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything to your wishlist yet</p>
        <Link 
          href="/products" 
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Continue Adding
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p._id} from='wishlist' product={p} />
      ))}
    </div>
  );
}
