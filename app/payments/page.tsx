'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'cards' | 'upi' | 'other'>('cards');
  
  // State for interactive features
  const [isCodEnabled, setIsCodEnabled] = useState(false);
  const [savedCards, setSavedCards] = useState([
    { id: 1, provider: "Visa", lastFour: "4242", expiry: "12/28", name: "KASHIF USER", isDefault: true }
  ]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f2994a]/30">
      
      {/* Background Accent Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-[#f2994a] opacity-[0.02] blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-8 md:p-16 lg:p-20">
        
        {/* Navigation Header */}
        <header className="mb-12 border-b border-white/5 pb-10">
          <Link href="/profile" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#f2994a] transition-all mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Account Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">Payment Options</h1>
          <p className="text-gray-500 mt-2 text-base font-medium">Manage your saved cards, UPI IDs, and preferred payment methods.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-8 mb-12 border-b border-white/5 pb-1">
          {['cards', 'upi', 'other'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-[#f2994a]' : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab === 'cards' ? 'Saved Cards' : tab === 'upi' ? 'UPI / VPA' : 'More Options'}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f2994a]" />}
            </button>
          ))}
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* TAB 1: CREDIT/DEBIT CARDS */}
          {activeTab === 'cards' && (
            <>
              {savedCards.map((card) => (
                <div key={card.id} className="h-[280px] p-8 bg-[#080808] border border-white/10 rounded-2xl flex flex-col justify-between hover:border-[#f2994a]/30 transition-all shadow-xl relative overflow-hidden group">
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
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">Expiry</p>
                      <p className="text-sm font-medium">{card.expiry}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-600 uppercase mb-1">Card Holder</p>
                      <p className="text-sm font-medium uppercase">{card.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 border-t border-white/5 pt-4">
                    <button className="text-[10px] font-black uppercase tracking-widest text-[#f2994a] hover:text-white transition-colors">Edit</button>
                    <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">Remove</button>
                  </div>
                </div>
              ))}
              <button className="h-[280px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:border-[#f2994a]/40 hover:text-white hover:bg-white/[0.02] transition-all group">
                <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center mb-4 group-hover:border-[#f2994a] transition-colors">
                  <span className="text-2xl font-light">+</span>
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Add Payment Method</span>
              </button>
            </>
          )}

          {/* TAB 2: UPI / VPA */}
          {activeTab === 'upi' && (
            <>
              <div className="h-[280px] p-8 bg-[#080808] border border-white/10 rounded-2xl flex flex-col justify-between hover:border-[#f2994a]/30 transition-all shadow-xl">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-600 mb-4">Saved UPI ID</h3>
                  <p className="text-xl font-medium text-white">kashif@okaxis</p>
                </div>
                <div className="flex gap-4 border-t border-white/5 pt-4">
                  <button className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">Remove ID</button>
                </div>
              </div>
              <button className="h-[280px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:border-[#f2994a]/40 hover:text-white transition-all">
                <span className="text-2xl font-light mb-2">+</span>
                <span className="text-sm font-black uppercase tracking-widest">Add New UPI ID</span>
              </button>
            </>
          )}

          {/* TAB 3: COD & NET BANKING */}
          {activeTab === 'other' && (
            <>
              {/* Cash on Delivery Card */}
              <div className="h-[280px] p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-[#f2994a]/20 transition-all">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Cash on Delivery</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    Enable COD for supported regions. Extra verification via OTP may be required at the time of delivery.
                  </p>
                </div>
                <button 
                  onClick={() => setIsCodEnabled(!isCodEnabled)}
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isCodEnabled 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/30' 
                    : 'bg-white/5 text-white border border-white/10 hover:border-[#f2994a] hover:bg-[#f2994a] hover:text-black'
                  }`}
                >
                  {isCodEnabled ? '✓ COD Enabled' : 'Enable COD'}
                </button>
              </div>

              {/* Net Banking Card */}
              <div className="h-[280px] p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-[#f2994a]/20 transition-all">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Net Banking</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    Link your bank account for direct secure transfers through our encrypted gateway.
                  </p>
                </div>
                <button 
                  onClick={() => alert("Bank selection interface opening...")}
                  className="w-full py-4 bg-transparent border border-[#f2994a]/50 text-[#f2994a] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#f2994a] hover:text-black transition-all duration-300"
                >
                  Manage Banks
                </button>
              </div>
            </>
          )}
        </div>

        {/* Security Footer Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-16">
          <div className="flex gap-6 items-start">
            <div className="p-3 bg-white/5 rounded-lg text-[#f2994a]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Secure Vault</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">Your credentials are tokenized and stored in a PCI-DSS Level 1 compliant vault.</p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="p-3 bg-white/5 rounded-lg text-[#f2994a]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Instant Refunds</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">Saved payment methods enjoy 2x faster refund processing directly to the source.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}