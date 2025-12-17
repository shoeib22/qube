"use client";

import { products } from "../../data/products";
import Link from "next/link";
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
      <main className="flex-grow px-10 py-24">
        <h1 className="text-5xl font-bold mb-14 text-center">Smart Home Products</h1>

        {categories.map((category) => {
          const items = products.filter((p) => p.category === category);

          return (
            <section key={category} className="mb-20">
              <h2 className="text-3xl font-semibold mb-6">{category}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    href={`/shop/product/${p.id}`}
                    className="group block bg-[#121212] border border-gray-800 p-6 rounded-2xl hover:border-gray-400 hover:shadow-xl transition"
                  >
                    {/* 3D IMAGE PLACEHOLDER */}
                    <div className="w-full h-40 mb-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center text-gray-500 group-hover:text-white">
                      <span className="text-sm">3D Model Coming Soon</span>
                    </div>

                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    <p className="text-gray-400 mt-2">₹ {p.price}</p>

                    <button className="mt-4 px-4 py-2 bg-white text-black rounded-lg font-semibold">
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