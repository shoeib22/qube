"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { products } from "../../data/products";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ShopPage() {

  // Group products by category
  const categories: string[] = Array.from(
    new Set(products.map((p) => p.category))
  );
    
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow px-6 md:px-10 py-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-14 text-center">Smart Home Products</h1>

        {categories.map((category) => {
          const items = products.filter((p) => p.category === category);

          return (
            <section key={category} className="mb-20">
              <h2 className="text-3xl font-semibold mb-6 border-b border-gray-800 pb-2">{category}</h2>

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
      </main>

      <Footer />
      
    </div>
  );
}