'use client';

import React from 'react';
import Link from 'next/link';

export default function PaymentsPage() {
  const savedCards = [
    {
      id: 1,
      provider: "Visa",
      lastFour: "4242",
      expiry: "12/28",
      name: "KASHIF USER",
      isDefault: true
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f2994a]/30">
      {/* Decorative Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-[10%] -top-[10%] h-[35%] w-[35%] rounded-full bg-[#f2994a] opacity-[0.02] blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-8 md:p-16 lg:p-20">
        <header className="mb-12 border-b border-white/5 pb-10">
          <Link href="/profile" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#f2994a] transition-all mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Account Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">Payment Options</h1>
          <p className="text-gray-500 mt-2 text-base">Manage your credit cards and digital payment methods.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCards.map((card) => (
            <div key={card.id} className="h-[240px] p-8 bg-[#080808] border border-white/10 rounded-2xl flex flex-col justify-between hover:border-[#f2994a]/30 transition-all shadow-xl relative overflow-hidden group">
              {card.isDefault && (
                <div className="absolute top-0 right-0">
                  <span className="bg-[#f2994a] text-black text-[9px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-tighter">Default</span>
                </div>
              )}
              <div className="flex justify-between items-start">
                <p className="text-lg font-bold italic tracking-tighter text-white">{card.provider}</p>
                <div className="w-10 h-6 bg-white/5 rounded border border-white/10" />
              </div>
              <p className="text-xl font-mono tracking-[0.2em] text-white/90">•••• •••• •••• {card.lastFour}</p>
              <div className="flex gap-10 mt-4">
                <div>
                  <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">Expiry</p>
                  <p className="text-sm font-medium text-white">{card.expiry}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">Card Holder</p>
                  <p className="text-sm font-medium uppercase text-white">{card.name}</p>
                </div>
              </div>
              <div className="flex gap-4 border-t border-white/5 pt-4 mt-2">
                <button className="text-[10px] font-bold uppercase tracking-widest text-[#f2994a] hover:text-white transition-colors">Edit</button>
                <button className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">Remove</button>
              </div>
            </div>
          ))}
          
          <button className="h-[240px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:border-[#f2994a]/40 hover:text-white hover:bg-white/[0.02] transition-all">
            <span className="text-2xl font-light mb-2">+</span>
            <span className="text-sm font-bold uppercase tracking-widest">Add Payment Method</span>
          </button>
        </div>
      </div>
    </div>
  );
}