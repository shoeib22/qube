"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-sans">

      {/* Ambient background — hidden on mobile to eliminate GPU blur cost */}
      <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none transform-gpu" />

      <Header />

      <main className="flex-grow px-4 sm:px-6 md:px-10 py-28 sm:py-32 max-w-7xl mx-auto w-full relative z-10">

        {/* Header — filter:blur removed from animation (can't GPU-composite) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-zinc-500 font-semibold mb-4">
            Ecosystem
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter text-white leading-tight">
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
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2 justify-center mb-10 sm:mb-16"
          >
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
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
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
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

        {/* ── Configurator Banner ── */}
        {!loading && !error && (
          <Link href="/configurator" className="block mb-12 sm:mb-16">
            <div className="group flex items-center justify-between gap-4 w-full px-6 sm:px-8 py-5 sm:py-6 rounded-3xl bg-[#155cfc]/10 border border-[#155cfc]/30 hover:bg-[#155cfc]/15 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#155cfc]/20 border border-[#155cfc]/30 flex items-center justify-center flex-shrink-0">
                  <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-[#155cfc]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#155cfc] font-bold mb-0.5">Customize</p>
                  <h2 className="text-base sm:text-lg font-semibold text-white leading-snug">Build Your Edge Panel</h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light hidden sm:block mt-0.5">
                    Choose material, size, icons &amp; smart technology
                  </p>
                </div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#155cfc] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>
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
            <motion.div key="content" className="space-y-16 sm:space-y-24">
              {displayCategories.map((category, catIdx) => {
                const items = selectedCategory === "All"
                  ? products.filter((p) => p.category === category)
                  : filteredProducts;

                if (items.length === 0) return null;

                return (
                  <motion.section
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center gap-4 mb-8 sm:mb-10">
                      <h2 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                        {category}
                      </h2>
                      <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                      {items.map((p) => (
                        <div
                          key={p.id}
                          className="group relative flex flex-col justify-between bg-white/[0.02] border border-white/5 rounded-[2rem] p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 transform-gpu"
                        >
                          {/* Inner Glass Shadow */}
                          <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] rounded-[2rem] pointer-events-none z-20" />

                          {/* Image Stage */}
                          <Link href={`/shop/Products/${p.id}`} className="block relative w-full aspect-square mb-5 rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-center group-hover:from-white/[0.08] transition-colors duration-500">
                            <Image
                              src={p.imageUrl || p.image || `/products/${p.id}.jpg`}
                              alt={p.name}
                              fill
                              className="object-contain p-6 sm:p-8 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          </Link>

                          {/* Product Info */}
                          <div className="px-2 flex-grow flex flex-col">
                            <Link href={`/shop/Products/${p.id}`} className="flex-grow">
                              <h3 className="text-base sm:text-lg font-medium text-white leading-snug tracking-tight group-hover:text-zinc-300 transition-colors">
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
                            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-3 relative z-30">
                              <AddToCartButton product={{ ...p, price: p.price ?? 0 }} />
                            </div>
                          </div>
                        </div>
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
