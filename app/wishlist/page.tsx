'use client';

import React from 'react';
import Link from 'next/link';

export default function WishlistPage() {
  // Mock data for saved items
  const wishlistItems = [
    {
      id: 1,
      name: "Xerovolt Smart Hub",
      price: "₹14,990",
      image: "/api/placeholder/400/400", // Replace with your product image path
      inStock: true
    },
    {
      id: 2,
      name: "Smart Door Lock Pro",
      price: "₹8,450",
      image: "/api/placeholder/400/400",
      inStock: true
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f2994a]/30">

      {/* Decorative Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[5%] -top-[5%] h-[30%] w-[30%] rounded-full bg-[#f2994a] opacity-[0.015] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-8 md:p-16 lg:p-20">

        {/* Navigation Header */}
        <header className="mb-12 border-b border-white/5 pb-10">
          <Link
            href="/profile"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#f2994a] transition-all mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Account Dashboard
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Your Wishlist</h1>
              <p className="text-gray-500 mt-2 text-base">Items you've saved for your future smart home ecosystem.</p>
            </div>
            <Link href="/" className="bg-[#f2994a] text-black px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
              Continue Shopping
            </Link>
          </div>
        </header>

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group bg-[#0c0c0c] border border-white/5 rounded-2xl overflow-hidden hover:border-[#f2994a]/30 transition-all">
                {/* Product Image Space */}
                <div className="aspect-square bg-white/[0.02] relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-[#f2994a] font-bold">{item.price}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">{item.inStock ? 'In Stock' : 'Out of Stock'}</p>

                  <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#f2994a] hover:text-black hover:border-[#f2994a] transition-all">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 text-sm mb-8">You haven't saved any products to your wishlist yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}