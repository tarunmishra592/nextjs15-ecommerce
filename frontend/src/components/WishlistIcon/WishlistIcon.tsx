'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FiHeart } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export function WishlistIcon() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length)

  return (
    <Link href="/wishlist" className="p-2 hover:text-green-600 transition relative">
      <FiHeart className="text-xl" />
      {mounted && wishlistCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {wishlistCount}
        </span>
      )}
    </Link>
  )
}