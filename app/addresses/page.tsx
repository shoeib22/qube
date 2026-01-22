'use client';

import React from 'react';
import Link from 'next/link';

export default function AddressesPage() {
  const savedAddresses = [
    {
      id: 1,
      name: "Kashif User",
      type: "Home",
      isDefault: true,
      addressLine: "H No. 42, Silicon Valley",
      cityState: "Hyderabad, Telangana, 500081",
      country: "India",
      phone: "+91 98765 43210"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f2994a]/30">

      {/* Decorative Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] -bottom-[10%] h-[35%] w-[35%] rounded-full bg-[#f2994a] opacity-[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-8 md:p-16 lg:p-20">

        {/* Navigation & Header */}
        <header className="mb-12 border-b border-white/5 pb-10">
          <Link
            href="/profile"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#f2994a] transition-all mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Account Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">Your Addresses</h1>
          <p className="text-gray-500 mt-2 text-base">Manage your shipping locations and delivery preferences.</p>
        </header>

        {/* Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. Saved Address Cards */}
          {savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="h-[280px] p-8 bg-[#080808] border border-white/10 rounded-2xl flex flex-col justify-between hover:border-[#f2994a]/30 transition-all shadow-xl relative overflow-hidden"
            >
              {addr.isDefault && (
                <div className="absolute top-0 right-0">
                  <span className="bg-[#f2994a] text-black text-[9px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-tighter">
                    Default
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="font-bold text-lg text-white">{addr.name}</h2>
                  <span className="text-[10px] border border-white/20 px-2 py-0.5 rounded text-gray-500 font-bold uppercase">
                    {addr.type}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-400 leading-relaxed font-light">
                  <p>{addr.addressLine}</p>
                  <p>{addr.cityState}</p>
                  <p>{addr.country}</p>
                  <p className="pt-2 text-gray-600 font-medium">Phone: {addr.phone}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 border-t border-white/5 pt-6 mt-4">
                <button className="text-[11px] font-bold uppercase tracking-widest text-[#f2994a] hover:text-white transition-colors">
                  Edit
                </button>
                <div className="w-[1px] h-3 bg-white/10 self-center" />
                <button className="text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* 2. Add New Address Button */}
          <button className="h-[280px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:border-[#f2994a]/40 hover:text-white hover:bg-white/[0.02] transition-all group">
            <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center mb-4 group-hover:border-[#f2994a] transition-colors">
              <span className="text-2xl font-light">+</span>
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Add New Address</span>
          </button>
        </div>

        {/* Informational Policy Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-16">

          {/* Delivery Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#f2994a]">
              Delivery Preferences
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm font-medium">
              Your default address is used to provide accurate shipping estimates and a faster checkout experience. You can manage specific delivery instructions for each location internally.
            </p>
          </div>

          {/* Secure Storage */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#f2994a]">
              Secure Storage
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm font-medium">
              All address information is encrypted and stored securely within the Xerovolt ecosystem. We do not share your residential details with third-party logistics partners for marketing purposes.
            </p>
          </div>

        </section>

        {/* Optional: Internal Delivery Instructions Mockup */}
        <div className="mt-12 p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-3 block">
            Special Instructions for Delivery (Internal)
          </label>
          <textarea
            placeholder="e.g. Leave with concierge, Gate Code: 1234..."
            className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-[#f2994a] outline-none text-sm transition-all resize-none text-white"
            rows={3}
          />
          <button className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#f2994a] hover:border-[#f2994a] transition-all">
            Update Instructions
          </button>
        </div>

      </div>
    </div>
  );
}