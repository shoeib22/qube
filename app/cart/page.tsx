"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

// Import Layout Components
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Import Cart Context
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, cartTotal } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
          <span className="text-gray-400 text-sm">{cartItems.length} items</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-gray-800 rounded-3xl bg-[#121212] animate-fade-in">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Looks like you haven't added any smart devices yet. Explore our collection to upgrade your home.
            </p>
            <Link
              href="/shop"
              className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

            {/* --- LEFT COLUMN: CART ITEMS --- */}
            <div className="lg:col-span-8 space-y-6">
              <motion.div
                className="bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
              >
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 }
                    }}
                    className={`p-6 flex flex-col sm:flex-row gap-6 ${idx !== cartItems.length - 1 ? 'border-b border-gray-800' : ''}`}
                  >
                    {/* Product Image */}
                    <Link href={`/shop/Products/${item.id}`} className="relative w-full sm:w-32 h-32 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-gray-800 hover:border-gray-600 transition-colors">
                      <Image
                        src={item.image || `/images/products/${item.id}.png`}
                        alt={item.name}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 150px"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">{item.category}</p>
                          <Link href={`/shop/Products/${item.id}`} className="text-lg font-bold hover:text-blue-400 transition-colors line-clamp-1">
                            {item.name}
                          </Link>
                          <p className="text-gray-500 text-sm mt-1">{item.price ? `₹ ${item.price.toLocaleString()}` : "Price on Request"}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-full"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4 sm:mt-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-black border border-gray-800 rounded-full hover:border-blue-500/50 transition-colors">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-l-full transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-r-full transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-xl font-bold">₹ {((item.price || 0) * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="flex justify-between items-center px-2">
                <Link
                  href="/shop"
                  className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* --- RIGHT COLUMN: SUMMARY --- */}
            <div className="lg:col-span-4">
              <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 lg:p-8 sticky top-28">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>₹ {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (Estimate)</span>
                    <span>₹ {(cartTotal * 0.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold">₹ {(cartTotal * 1.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-white text-black text-center py-4 rounded-xl font-bold text-lg hover:bg-gray-200 active:scale-[0.98] transition-all shadow-lg shadow-white/5"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Checkout Guaranteed</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}