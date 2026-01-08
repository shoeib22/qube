'use client';

import React from 'react';

export default function AdminDashboard() {
  const kpis = [
    { label: 'Total Revenue', value: '₹0', trend: '0%', color: 'text-grey-500' },
    { label: 'Active Orders', value: '0', trend: '0 Pending', color: 'text-grey-500' },
    { label: 'Total Customers', value: '0', trend: '0 this month', color: 'text-grey-500' },
    { label: 'Conversion Rate', value: '0%', trend: '0%', color: 'text-grey-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2 font-medium">Monitoring the Qube ecosystem performance.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4">{kpi.label}</p>
            <h2 className="text-3xl font-bold mb-2">{kpi.value}</h2>
            <p className={`text-xs font-bold ${kpi.color}`}>{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-lg">Live Order Stream</h3>
          <button className="text-xs font-black uppercase tracking-widest text-[#f2994a]">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5">
                <th className="p-8">ID</th>
                <th className="p-8">Customer</th>
                <th className="p-8">Product</th>
                <th className="p-8">Amount</th>
                <th className="p-8">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3].map((_, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-8 font-mono text-gray-400">#QB-10{i}</td>
                  <td className="p-8 font-bold text-white/90">Kashif User</td>
                  <td className="p-8 text-gray-500">Qube Smart Hub Pro</td>
                  <td className="p-8 font-black text-[#f2994a]">₹0</td>
                  <td className="p-8">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/20">
                       Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}