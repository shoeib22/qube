'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactSupportPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    // Simulated API delay
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f2994a]/30">
      
      {/* Decorative Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-[10%] -top-[10%] h-[35%] w-[35%] rounded-full bg-[#f2994a] opacity-[0.02] blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-8 md:p-16 lg:p-20">
        
        {/* Navigation Header */}
        <header className="mb-16 border-b border-white/5 pb-10">
          <Link 
            href="/profile" 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#f2994a] transition-all mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Account Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Contact Support</h1>
          <p className="text-gray-500 mt-2 text-base">How can we help you with your Qube ecosystem today?</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Direct Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-[#f2994a]/10 rounded-xl flex items-center justify-center mb-6 text-[#f2994a]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Live Chat</h2>
              <p className="text-sm text-gray-500 mb-6 italic">Current wait time: ~2 mins</p>
              <button className="w-full py-4 bg-[#f2994a] text-black font-black uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-all">
                Start Chat Now
              </button>
            </div>

            <div className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Call Center</h2>
              <p className="text-sm text-gray-400 font-medium">+91 1800-QUBE-HELP</p>
              <p className="text-[10px] text-gray-600 uppercase mt-1 tracking-wider">Mon-Sat, 9am - 8pm IST</p>
            </div>
          </div>

          {/* Right Column: Message Form */}
          <div className="lg:col-span-2">
            <div className="p-8 md:p-12 bg-[#080808] border border-white/5 rounded-3xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-8 text-white">Send us a Message</h2>
              
              {formStatus === 'success' ? (
                <div className="py-20 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-500">Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setFormStatus('idle')} className="mt-8 text-[#f2994a] text-xs font-bold uppercase underline underline-offset-8">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-600 tracking-wide">Subject</label>
                    <select className="w-full bg-black border border-white/10 p-4 rounded-lg focus:border-[#f2994a] outline-none transition-all text-sm text-white">
                      <option>Technical Issue</option>
                      <option>Order Status</option>
                      <option>Returns & Warranty</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-600 tracking-wide">Order ID (Optional)</label>
                    <input type="text" placeholder="#QB-0000" className="w-full bg-black border border-white/10 p-4 rounded-lg focus:border-[#f2994a] outline-none transition-all text-sm text-white" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-600 tracking-wide">How can we help?</label>
                    <textarea rows={5} className="w-full bg-black border border-white/10 p-4 rounded-lg focus:border-[#f2994a] outline-none transition-all text-sm resize-none text-white" placeholder="Describe your issue in detail..."></textarea>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button className="w-full py-4 bg-white/5 border border-white/10 hover:border-[#f2994a] hover:bg-[#f2994a] hover:text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center justify-center gap-3">
                      {formStatus === 'loading' ? (
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : 'Submit Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}