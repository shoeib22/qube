"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { products } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Get all unique categories from products
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
  
  // 2. Create a list for the buttons (including "All")
  const filterCategories = ["All", ...uniqueCategories];

  // 3. Determine which category sections to render based on selection
  const categoriesToDisplay = selectedCategory === "All" 
    ? uniqueCategories 
    : [selectedCategory];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow px-6 md:px-10 py-24">
        
        {/* --- TITLE & CONTROLS SECTION --- */}
        <div className="max-w-7xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">
              Smart Home Products
            </h1>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto mb-8">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121212] border border-gray-800 rounded-full py-3 px-6 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter Pills (Scrollable on mobile) */}
            <div className="flex flex-wrap justify-center gap-3">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    selectedCategory === cat
                      ? "bg-white text-black border-white"
                      : "bg-[#121212] text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
        </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    // FIXED: Changed 'product' to 'Products' to match your capitalized folder name
                    href={`/shop/Products/${p.id}`}
                    className="group block bg-[#121212] border border-gray-800 p-6 rounded-2xl hover:border-gray-400 hover:shadow-xl transition duration-300"
                  >
                    {/* --- UPDATED IMAGE CONTAINER --- */}
                    {/* 1. h-52: Fixed height ensures all cards line up perfectly.
                        2. p-6: Adds "breathing room" (framing) so the product doesn't hit the edges.
                        3. bg-white/5: Adds a subtle background to define the frame area.
                    */}
                    <div className="relative w-full h-52 mb-4 bg-white/5 rounded-xl overflow-hidden p-6 flex items-center justify-center">
                      <Image
                        src={p.image || `/products/${p.id}.jpg`} 
                        alt={p.name}
                        fill
                        // object-contain: Ensures the WHOLE image is visible without cropping
                        className="object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    {/* --- END IMAGE CONTAINER --- */}

            // If search hides all items in this category, don't render the section header
            if (items.length === 0) return null;

            return (
              <section key={category} className="mb-20 animate-fade-in">
                <h2 className="text-3xl font-semibold mb-6 border-b border-gray-800 pb-2 flex items-center gap-3">
                  {category}
                  <span className="text-sm font-normal text-gray-500 bg-gray-900 px-2 py-1 rounded-md">
                    {items.length}
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {items.map((p) => (
                    <Link
                      key={p.id}
                      href={`/shop/product/${p.id}`}
                      className="group block bg-[#121212] border border-gray-800 p-6 rounded-2xl hover:border-gray-400 hover:shadow-xl transition duration-300"
                    >
                      <div className="relative w-full h-52 mb-4 bg-white/5 rounded-xl overflow-hidden p-6 flex items-center justify-center">
                        <Image
                          src={p.image || `/products/${p.id}.jpg`}
                          alt={p.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>

                      <h3 className="text-xl font-semibold leading-tight min-h-[3.5rem] flex items-center">
                        {p.name}
                      </h3>

                      {p.price ? (
                        <p className="text-gray-400 mt-2 font-medium">₹ {p.price.toLocaleString()}</p>
                      ) : (
                        <p className="text-gray-500 mt-2 italic text-sm">Price on Request</p>
                      )}

                      <button className="mt-4 w-full px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

        {/* Fallback if search returns absolutely nothing */}
          {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="text-center py-20">
                {/* FIXED: Replaced " with &quot; */}
                <p className="text-gray-500 text-xl">No products found for &quot;{searchQuery}&quot;</p>
                <button 
                  onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                  className="mt-4 text-blue-400 hover:underline"
                >
                  Clear Filters
                </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}