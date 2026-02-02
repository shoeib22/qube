"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'motion/react';

export default function CartPage() {
  const { cartItems, removeFromCart, decreaseQuantity, addToCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-32">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold mb-10 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent"
        >
          Your Bag
        </motion.h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-800 rounded-3xl bg-[#080808]">
            <p className="text-gray-400 text-lg mb-8">Your bag is currently empty.</p>
            <Link href="/shop" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => {
                // Fix: Ensure relative paths have a leading slash for Next.js Image
                const getSafeImagePath = () => {
                  if (item.imageUrl) return item.imageUrl; // Signed URL is absolute (https://...)
                  if (!item.image) return `/products/${item.id}.jpg`;
                  return item.image.startsWith('/') ? item.image : `/${item.image}`;
                };

                return (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-[#111111] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
                    <div className="relative w-32 h-32 bg-white/5 rounded-xl overflow-hidden p-4 flex-shrink-0">
                      <Image
                        src={getSafeImagePath()}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 128px"
                        priority={false}
                      />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                      <p className="text-blue-400 font-semibold text-lg mb-4">₹ {item.price.toLocaleString()}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-6">
                        <div className="flex items-center bg-black border border-gray-800 rounded-xl overflow-hidden">
                          <button 
                            onClick={() => decreaseQuantity(item.id)} 
                            className="px-4 py-2 hover:bg-gray-900 transition-colors text-xl"
                          >
                            -
                          </button>
                          <span className="px-6 py-2 font-bold border-x border-gray-800">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)} 
                            className="px-4 py-2 hover:bg-gray-900 transition-colors text-xl"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#111111] p-8 rounded-3xl border border-gray-800 h-fit sticky top-32">
              <h2 className="text-2xl font-bold mb-6">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹ {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="border-t border-gray-800 pt-4 flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span>₹ {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-5 rounded-2xl font-bold text-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}