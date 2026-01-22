'use client';

import React from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const orders = [
    {
      id: '#QB-9001',
      date: '12 Dec 2025',
      status: 'Delivered',
      total: '₹19,990',
      items: 'Xerovolt Smart Hub, 2x Smart Bulbs'
    },
    {
      id: '#QB-8922',
      date: '02 Jan 2026',
      status: 'Processing',
      total: '₹8,450',
      items: 'Smart Door Lock'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f2994a]/30">

      {/* Background Accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-[#f2994a] opacity-[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-8 md:p-16 lg:p-24">

        {/* Navigation & Header */}
        <header className="mb-16 border-b border-white/5 pb-8">
          <Link
            href="/profile"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#f2994a] transition-all mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Account Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">Your Orders</h1>
          <p className="text-gray-500 mt-2 text-base">Manage your purchases and track shipments.</p>
        </header>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#080808] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all shadow-2xl"
            >
              {/* Card Header Section */}
              <div className="bg-white/[0.02] p-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-10">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-1">Order Placed</p>
                    <p className="text-sm font-medium text-white">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-1">Total Amount</p>
                    <p className="text-sm font-bold text-[#f2994a]">{order.total}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-1">Order ID</p>
                  <p className="text-sm font-mono text-white">{order.id}</p>
                </div>
              </div>

              {/* Card Body Section */}
              <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex-1">
                  <p className={`text-xs font-black uppercase tracking-widest mb-3 ${order.status === 'Delivered' ? 'text-green-500' : 'text-[#f2994a]'}`}>
                    ● {order.status}
                  </p>
                  <h3 className="text-lg font-medium text-white/90">{order.items}</h3>

                  {/* Visual Status Bar */}
                  <div className="mt-6 h-1 w-full max-w-xs bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${order.status === 'Delivered' ? 'w-full bg-green-500' : 'w-1/2 bg-[#f2994a]'}`}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white">
                    Track Package
                  </button>
                  <button className="px-6 py-3 bg-[#f2994a] text-black rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
                    Order Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Helpful Footer Section */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-gray-600 text-[11px] uppercase tracking-widest font-bold">
          <div className="flex gap-8">
            <Link href="/returns" className="hover:text-[#f2994a] cursor-pointer transition-colors">
              Return Policy
            </Link>
            <Link href="/contact-support" className="hover:text-[#f2994a] cursor-pointer transition-colors">
              Customer Service
            </Link>
          </div>
          <p>© 2026 Xerovolt Automation</p>
        </footer>
      </div>
    </div>
  );
}