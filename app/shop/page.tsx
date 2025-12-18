"use client";

import { products } from "../../data/products";
import Link from "next/link";
import Image from "next/image"; // 1. Import Next.js Image component
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ShopPage() {

  // Group products by category
  const categories: string[] = Array.from(
    new Set(products.map((p) => p.category))
  );
    
  return (
    // 1. Main wrapper handles background and full height
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      {/* 2. Header added at the top */}
      <Header />

      {/* 3. Main content area (flex-grow pushes footer down) */}
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
                    href={`/shop/product/${p.id}`}
                    className="group block bg-[#121212] border border-gray-800 p-6 rounded-2xl hover:border-gray-400 hover:shadow-xl transition duration-300"
                  >
                    {/* --- IMAGE CONTAINER START --- */}
                    {/* Relative parent is required for 'fill' to work */}
                    <div className="relative w-full h-48 mb-4 bg-gray-900 rounded-xl overflow-hidden">
                      <Image
                        // Falls back to constructing the path manually if p.image is missing
                        src={p.image || `/products/${p.id}.jpg`} 
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    {/* --- IMAGE CONTAINER END --- */}

                    <h3 className="text-xl font-semibold leading-tight min-h-[3.5rem] flex items-center">
                      {p.name}
                    </h3>

                    {/* Conditional Price Rendering */}
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

      {/* 4. Footer added at the bottom */}
      <Footer />
      
    </div>
  );
}