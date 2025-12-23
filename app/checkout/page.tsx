"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Mail, 
  Phone, 
  ShoppingBag,
} from 'lucide-react';

// Import Layout Components
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// 1. IMPORT THE CART CONTEXT
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  // 2. GET REAL DATA FROM CONTEXT
  const { cartItems, cartTotal } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [paymentMethod, setPaymentMethod] = useState<string>('card');

  // --- CALCULATIONS (Based on Real Cart Data) ---
  const subtotal = cartTotal; 
  const shipping = 0; // Free shipping
  const taxRate = 0.18; // 18% GST
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  if (!isLoaded) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Secure Checkout...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="flex items-center mb-8">
          <Link 
            href="/cart" 
            className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16">
          
          {/* --- LEFT COLUMN: INPUT FORMS --- */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Contact Information */}
            <section className="bg-[#121212] border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <span className="bg-blue-600/10 text-blue-500 text-xs font-bold px-2 py-1 rounded border border-blue-500/20 mr-3">STEP 1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Shipping Address */}
            <section className="bg-[#121212] border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gray-700"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <span className="bg-gray-800 text-gray-400 text-xs font-bold px-2 py-1 rounded border border-gray-700 mr-3">STEP 2</span>
                Shipping Address
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">First Name</label>
                    <input type="text" className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Last Name</label>
                    <input type="text" className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    <input type="text" placeholder="House no., Street, Area" className="w-full bg-black border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">City</label>
                    <input type="text" className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">State</label>
                    <input type="text" className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Pincode</label>
                    <input type="text" className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-all" />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Payment Method */}
            <section className="bg-[#121212] border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gray-700"></div>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <span className="bg-gray-800 text-gray-400 text-xs font-bold px-2 py-1 rounded border border-gray-700 mr-3">STEP 3</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${paymentMethod === 'card' ? 'bg-blue-500/10 border-blue-500' : 'bg-black border-gray-800 hover:border-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors ${paymentMethod === 'card' ? 'border-blue-500' : 'border-gray-600'}`}>
                    {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <CreditCard className={`w-5 h-5 mr-3 transition-colors ${paymentMethod === 'card' ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span className="font-medium">Credit/Debit Card</span>
                </button>

                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${paymentMethod === 'cod' ? 'bg-blue-500/10 border-blue-500' : 'bg-black border-gray-800 hover:border-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors ${paymentMethod === 'cod' ? 'border-blue-500' : 'border-gray-600'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                  <Truck className={`w-5 h-5 mr-3 transition-colors ${paymentMethod === 'cod' ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span className="font-medium">Cash on Delivery</span>
                </button>
              </div>

              {/* Secure Payment Note */}
              <div className="mt-6 flex items-center justify-center text-xs text-gray-500 bg-black p-3 rounded-lg border border-gray-800/50">
                <Lock className="w-3 h-3 mr-2" />
                Payments are SSL encrypted and secured.
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-6">
              
              {/* Cart Summary Card */}
              <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <span className="text-sm text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                    {cartItems.length} Items
                  </span>
                </div>
                
                {/* Items List - MAPS OVER REAL CART ITEMS */}
                <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
                  ) : (
                    cartItems.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex gap-4 group">
                        <div className="relative w-20 h-20 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-gray-800 group-hover:border-gray-600 transition-colors flex items-center justify-center">
                            <Image 
                                src={item.image || `/images/products/${item.id}.png`}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                                sizes="80px"
                            />
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-1">
                            <div>
                            <h4 className="font-medium text-sm line-clamp-2 leading-snug">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-400 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">Qty: {item.quantity}</span>
                            <span className="text-sm font-bold text-white">₹ {((item.price || 0) * item.quantity).toLocaleString()}</span>
                            </div>
                        </div>
                        </div>
                    ))
                  )}
                </div>

                {/* Totals */}
                <div className="border-t border-dashed border-gray-800 pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>₹ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded text-xs">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>GST (18%)</span>
                    <span>₹ {tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 mt-6 pt-6">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold text-white tracking-tight">₹ {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 text-right uppercase tracking-wider">Inclusive of all taxes</p>
                </div>

                <button className="w-full mt-8 bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 active:scale-[0.98] transition-all shadow-xl shadow-white/5 flex items-center justify-center group">
                  Confirm Order
                  <ShoppingBag className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-center text-[10px] text-gray-600 mt-4 leading-relaxed">
                  By confirming your order, you agree to our <span className="underline cursor-pointer hover:text-gray-400">Terms of Service</span> and <span className="underline cursor-pointer hover:text-gray-400">Privacy Policy</span>.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#121212] border border-gray-800 p-4 rounded-2xl flex items-center justify-center flex-col text-center hover:border-gray-700 transition-colors">
                  <ShieldCheck className="w-6 h-6 text-green-500 mb-2" />
                  <span className="text-xs text-gray-400 font-medium">1 Year Warranty</span>
                </div>
                <div className="bg-[#121212] border border-gray-800 p-4 rounded-2xl flex items-center justify-center flex-col text-center hover:border-gray-700 transition-colors">
                  <Truck className="w-6 h-6 text-blue-500 mb-2" />
                  <span className="text-xs text-gray-400 font-medium">Express Shipping</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}