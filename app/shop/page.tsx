"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AddToCartButton from "../../components/ui/AddToCartButton";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        const uniqueCategories = Array.from(
          new Set(data.products.map((p: Product) => p.category))
        );
        setCategories(uniqueCategories as string[]);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  const displayCategories = selectedCategory === "All"
    ? categories
    : [selectedCategory];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-grow px-6 md:px-10 py-24 max-w-7xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
        >
          Smart Home Products
        </motion.h1>

        {/* Category Filter Chips */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === "All"
                ? "bg-white text-black shadow-lg shadow-white/20"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-gray-400">Please refresh the page to try again.</p>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">No products available in this category.</p>
          </motion.div>
        ) : (
          displayCategories.map((category, catIdx) => {
            const items = selectedCategory === "All"
              ? products.filter((p) => p.category === category)
              : filteredProducts;

            return (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.1 }}
                className="mb-20"
              >
                <h2 className="text-3xl font-semibold mb-6 border-b border-gray-800 pb-2">
                  {category}
                </h2>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.08 }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {items.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                      className="group flex flex-col justify-between bg-[#121212] border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                    >
                      {/* Badge for first 3 items */}
                      {idx < 3 && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ⭐ Popular
                        </div>
                      )}

                      {/* Link to Details */}
                      <Link href={`/shop/Products/${p.id}`} className="block flex-grow relative">
                        <div className="relative w-full h-52 mb-4 bg-white/5 rounded-xl overflow-hidden p-6 flex items-center justify-center">
                          <Image
  // Change p.image to p.imageUrl
  src={p.imageUrl || p.image || `/products/${p.id}.jpg`}
  alt={p.name}
  fill
  className="object-contain hover:scale-110 transition-transform duration-500"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
                        </div>

                        <h3 className="text-xl font-semibold leading-tight min-h-[3.5rem] flex items-center group-hover:text-blue-400 transition-colors">
                          {p.name}
                        </h3>

                        {p.price && p.price > 0 ? (
                          <p className="text-gray-400 mt-2 font-medium text-lg">
                            ₹ {p.price.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-gray-500 mt-2 italic text-sm">
                            Price on Request
                          </p>
                        )}
                      </Link>

                      {/* Add to Cart Section */}
                      <div className="mt-5 pt-4 border-t border-gray-800/50 flex flex-col gap-3">
                        <AddToCartButton
                          product={{
                            ...p,
                            price: p.price ?? 0
                          }}
                        />

                        <Link
                          href={`/shop/Products/${p.id}`}
                          className="text-center text-xs text-gray-500 hover:text-white transition-colors"
                        >
                          View Details →
                        </Link>
                      </div>

                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            );
          })
        )}
      </main>

      <Footer />
    </div>
  );
}
