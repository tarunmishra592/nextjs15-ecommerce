/* eslint-disable react/no-unescaped-entities */

import { formatINR } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchModalProps {
    searchQuery: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setSearchQuery: (query: string) => void;
    closeSearch: () => void;
    isPending: boolean;
    searchResults: Product[];
  }

export default function SearchModal({
    searchQuery,
    handleSearchChange,
    setSearchQuery,
    closeSearch,
    isPending,
    searchResults
}: SearchModalProps){
    return(
        <div className="fixed inset-0 z-50 h-screen">
        {/* Full viewport height black overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 h-[100vh]"
          onClick={closeSearch}
        />
        
        {/* Search modal container centered */}
        <div className="relative flex justify-center pt-20 px-4 h-full">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="p-4 border-b flex items-center">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              <button
                onClick={closeSearch}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
  
            {/* Search Results */}
            <div className="flex-1 overflow-y-auto">
              {isPending ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></span>
                    Searching...
                  </div>
                </div>
              ) : searchResults?.length > 0 ? (
                <ul className="divide-y">
                  {searchResults.map((product) => (
                    <li key={product._id}>
                      <Link
                        href={`/products/${product._id}`}
                        onClick={closeSearch}
                        className="flex items-center p-4 hover:bg-gray-50 transition"
                        prefetch={true}
                      >
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden relative">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-sm text-green-600 mt-1">
                            {formatINR(product.price)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : searchQuery ? (
                <div className="p-8 text-center text-gray-500">
                  No products found for "{searchQuery}"
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>Start typing to search products</p>
                  <p className="text-xs mt-2 text-gray-400">
                    Try "shirt", "electronics", etc.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
}