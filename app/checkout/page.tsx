"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, CreditCard, Truck, ShieldCheck, Lock, MapPin, Mail, Phone,
  ShoppingBag, Loader2, Smartphone
} from 'lucide-react';
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('phonepe');
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Calculate Totals
  const subtotal = cartTotal;
  const shipping = 0; 
  const taxRate = 0.18; 
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) return;

    if (!formData.phone || !formData.email || !formData.address) {
      alert("Please fill in all required fields (Contact & Address)");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'phonepe') {
        const response = await fetch('/api/payment/phonepe/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(total), // PhonePe expects integer paise/rupees
            customerInfo: formData,
            items: cartItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            }))
          })
        });

        const data = await response.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          alert("Payment initiation failed. Please try again.");
          setIsProcessing(false);
        }
      } else {
        setTimeout(() => {
          alert("Order placed successfully via " + paymentMethod.toUpperCase());
          setIsProcessing(false);
        }, 1500);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  // Helper for safe image paths
  const getSafePath = (item: any) => {
    if (item.imageUrl) return item.imageUrl;
    const path = item.image || `/products/${item.id}.jpg`;
    return path.startsWith('/') ? path : `/${path}`;
  };

  if (!isLoaded) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Secure Checkout...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full">
        
        <div className="flex items-center mb-8">
          <Link href="/cart" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm group mr-4">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Sections */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-[#121212] border border-gray-800 rounded-3xl p-8">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="bg-black border border-gray-800 rounded-xl py-3 px-4" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="bg-black border border-gray-800 rounded-xl py-3 px-4" />
              </div>
            </section>

            <section className="bg-[#121212] border border-gray-800 rounded-3xl p-8">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              <div className="space-y-6">
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="w-full bg-black border border-gray-800 rounded-xl py-3 px-4" />
                <div className="grid grid-cols-3 gap-6">
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="bg-black border border-gray-800 rounded-xl py-3 px-4" />
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="bg-black border border-gray-800 rounded-xl py-3 px-4" />
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode" className="bg-black border border-gray-800 rounded-xl py-3 px-4" />
                </div>
              </div>
            </section>

            <section className="bg-[#121212] border border-gray-800 rounded-3xl p-8">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setPaymentMethod('phonepe')} className={`p-4 rounded-xl border flex items-center gap-3 ${paymentMethod === 'phonepe' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800'}`}>
                  <Smartphone className="text-purple-500" /> PhonePe / UPI
                </button>
                <button onClick={() => setPaymentMethod('cod')} className={`p-4 rounded-xl border flex items-center gap-3 ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800'}`}>
                  <Truck className="text-blue-500" /> Cash on Delivery
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 sticky top-28">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-black rounded-lg overflow-hidden border border-gray-800 flex-shrink-0">
                      <Image 
                        src={getSafePath(item)} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-1" 
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold mt-1">₹ {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-2 text-sm text-gray-400">
                <div className="flex justify-between"><span>Subtotal</span><span>₹ {subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>GST (18%)</span><span>₹ {tax.toLocaleString()}</span></div>
                <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-gray-800">
                  <span>Total</span><span>₹ {total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment} 
                disabled={isProcessing || cartItems.length === 0} 
                className="w-full mt-8 bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}