// components/Header/Header.tsx
'use client'

import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState, useAppSelector } from '@/store/store'
import { FiShoppingCart, FiSearch, FiMenu, FiX } from 'react-icons/fi'
import { WishlistIcon } from '../WishlistIcon/WishlistIcon'
import { useState } from 'react'
import CartPopover from '../CartPopover/CartPopover'
import { selectUser } from '@/store/slices/authSlice'
import { apiFetch } from '@/lib/client-api'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const user = useAppSelector(selectUser)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const cartLen = useSelector((state: RootState) => state.cart.items.length)



  const toggleAccountMenu = () => {
    setIsAccountOpen(!isAccountOpen)
    setIsMenuOpen(false)
  }

  const handleLogout = async() => {
    try {
      // 1. Call backend logout endpoint
      await apiFetch('/auth/logout', {
        method: 'POST',
        credentials: 'include', // Necessary for cookies
      });
  
      // 2. Force full page reload to clear all states
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: Force client-side cleanup
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/login';
    }
  }

  return (
    <header className={`w-full z-50 transition-all border-b-1 border-green-200 duration-300 bg-white/90 backdrop-blur-sm py-4`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-green-600">
          ShopEase
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-green-600 transition">Home</Link>
          <Link href="/products" className="hover:text-green-600 transition">Products</Link>
          <Link href="/about" className="hover:text-green-600 transition">About</Link>
          <Link href="/contact" className="hover:text-green-600 transition">Contact</Link>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:text-green-600 transition">
            <FiSearch className="text-xl" />
          </button>

           {/* Wishlist Icon */}
           <WishlistIcon/>

        <div className='relative'>
          <Link 
            href="/cart" 
            onMouseEnter={() => setIsCartOpen(true)} 
            onMouseLeave={() => setIsCartOpen(false)} 
            className="p-2 hover:text-green-600 transition flex">
            <FiShoppingCart className="text-xl" />
              {cartLen > 0 && (
                <span className="absolute -top-1 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartLen}
                </span>
              )}
          </Link>

          {isCartOpen && cartLen > 0 && ( 
            <CartPopover 
              setIsCartOpen={setIsCartOpen} 
              cartItems={cartItems} 
              isCartOpen={isCartOpen} 
              cartLen={cartLen} /> )}
          </div>

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={toggleAccountMenu}
              className="p-2 hover:text-green-600 transition flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 hover:border-green-300"
            >
              {user ? (
                <span className="font-medium text-green-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm hover:bg-green-50"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm hover:bg-green-50"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-red-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm hover:bg-green-50"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-sm hover:bg-green-50"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:text-green-600 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full left-0 right-0">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <Link href="/" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/products" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link href="/about" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/contact" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            {!user && (
              <>
                <Link href="/login" className="py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link href="/register" className="py-2" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}