'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OrderManagement() {
  const [filter, setFilter] = useState('All');

  const orders = [
    { id: '#QB-100', customer: 'Kashif User', product: 'Smart Hub Pro', amount: '₹19,990', status: 'Processing' },
    { id: '#QB-101', customer: 'Kashif User', product: 'Smart Hub Pro', amount: '₹19,990', status: 'Shipped' },
    { id: '#QB-102', customer: 'Kashif User', product: 'Smart Hub Pro', amount: '₹19,990', status: 'Delivered' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/5 pb-10">
        <div>
          <Link href="/dashboard/admin" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-[#f2994a] mb-4 block">
            ← Back to Overview
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white">Order Management</h1>
          <p className="text-gray-500 mt-2 font-medium">Full list of transactions and logistics tracking.</p>
        </div>
        
        <div className="flex gap-3">
           {['All', 'Processing', 'Shipped', 'Delivered'].map(status => (
             <button 
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filter === status ? 'bg-[#f2994a] text-black border-[#f2994a]' : 'border-white/5 text-gray-500 hover:border-white/20'
                }`}
             >
               {status}
             </button>
           ))}
        </div>
      </header>

      <div className="space-y-4">
        {orders.filter(o => filter === 'All' || o.status === filter).map((order) => (
          <div key={order.id} className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-wrap items-center justify-between gap-8 group hover:border-[#f2994a]/30 transition-all">
            <div className="flex items-center gap-8">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-[#f2994a] shadow-inner uppercase">
                {order.id.slice(1, 3)}
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">{order.customer}</h4>
                <p className="text-xs text-gray-500 font-medium">Order ID: {order.id} • Hyderabad, India</p>
              </div>
            </div>
            
            <div className="flex items-center gap-10">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-2">Change Status</p>
                <select className="bg-black text-[11px] font-black text-[#f2994a] uppercase border-none outline-none cursor-pointer">
                   <option selected={order.status === 'processing'}>processing</option>
                  <option selected={order.status === 'Shipped'}>Shipped</option>
                  <option selected={order.status === 'Delivered'}>Delivered</option>
                </select>
              </div>
              <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#f2994a] hover:text-black hover:border-[#f2994a] transition-all">
                Track Shipment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}