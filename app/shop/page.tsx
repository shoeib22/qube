"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  // --- STATE & API LOGIC (100% UNTOUCHED) ---
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
  // ------------------------------------------

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Subtle Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none transform-gpu" />
      
      <Header />

      <main className="flex-grow px-6 md:px-10 py-32 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Cinematic Header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 font-semibold mb-4">
            Ecosystem
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white leading-tight">
            Smart Home <br />
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-600">
              Hardware.
            </span>
          </h1>
        </motion.div>

        {/* Category Filter Chips */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2 justify-center mb-20"
          >
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === "All"
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  : "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white border border-white/5"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    : "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 border border-white/5 rounded-3xl bg-white/[0.01]"
            >
              <p className="text-rose-400 mb-2 font-medium">{error}</p>
              <p className="text-zinc-500 text-sm">Please refresh the page to try again.</p>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 border border-white/5 rounded-3xl bg-white/[0.01]"
            >
              <p className="text-zinc-500 text-lg font-light">No products available in this category.</p>
            </motion.div>
          ) : (
            <motion.div key="content" className="space-y-24">
              {displayCategories.map((category, catIdx) => {
                const items = selectedCategory === "All"
                  ? products.filter((p) => p.category === category)
                  : filteredProducts;

                if (items.length === 0) return null;

                return (
                  <motion.section
                    key={category}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="flex items-center gap-4 mb-10">
                      <h2 className="text-2xl font-medium text-white tracking-tight">
                        {category}
                      </h2>
                      <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                      {items.map((p, idx) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="group relative flex flex-col justify-between bg-white/[0.02] border border-white/5 rounded-[2rem] p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 transform-gpu"
                        >
                          {/* Inner Glass Shadow */}
                          <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] rounded-[2rem] pointer-events-none z-20" />

                          {/* Popular Badge */}
                          {idx < 3 && selectedCategory === "All" && (
                            <div className="absolute top-6 left-6 z-30 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg">
                              Popular
                            </div>
                          )}

                          {/* Image Stage */}
                          <Link href={`/shop/Products/${p.id}`} className="block relative w-full aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-center group-hover:from-white/[0.08] transition-colors duration-500">
                            {/* Spotlight glow behind image */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <Image
                              src={p.imageUrl || p.image || `/products/${p.id}.jpg`}
                              alt={p.name}
                              fill
                              className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          </Link>

                          {/* Product Info */}
                          <div className="px-2 flex-grow flex flex-col">
                            <Link href={`/shop/Products/${p.id}`} className="flex-grow">
                              <h3 className="text-lg font-medium text-white leading-snug tracking-tight group-hover:text-zinc-300 transition-colors">
                                {p.name}
                              </h3>
                              
                              {p.price && p.price > 0 ? (
                                <p className="text-zinc-400 mt-2 font-mono text-sm">
                                  ₹ {p.price.toLocaleString()}
                                </p>
                              ) : (
                                <p className="text-zinc-500 mt-2 font-mono text-sm italic">
                                  Price on Request
                                </p>
                              )}
                            </Link>

                            {/* Add to Cart Footer */}
                            <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-3 relative z-30">
                              <AddToCartButton
                                product={{
                                  ...p,
                                  price: p.price ?? 0
                                }}
                              />
                            </div>
                          </div>

                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}