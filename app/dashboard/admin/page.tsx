'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface KpiData {
  revenue: number;
  activeOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

interface Order {
  id?: string;
  transactionId?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await user?.getIdToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        const [kpiRes, ordersRes] = await Promise.all([
          fetch('/api/admin/kpis', { headers }),
          fetch('/api/admin/orders', { headers }).catch(() => null),
        ]);

        if (kpiRes.ok) {
          const data = await kpiRes.json();
          setKpiData(data);
        }

        if (ordersRes?.ok) {
          const data = await ordersRes.json();
          setOrders((data.orders || []).slice(0, 5));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const formatCurrency = (paise: number) =>
    `₹${(paise / 100).toLocaleString('en-IN')}`;

  const kpis = [
    {
      label: 'Total Revenue',
      value: kpiData ? formatCurrency(kpiData.revenue) : '—',
      color: 'text-gray-500',
    },
    {
      label: 'Active Orders',
      value: kpiData ? kpiData.activeOrders.toString() : '—',
      color: 'text-green-500',
    },
    {
      label: 'Total Products',
      value: kpiData ? kpiData.totalProducts.toString() : '—',
      color: 'text-blue-500',
    },
    {
      label: 'Total Customers',
      value: kpiData ? kpiData.totalCustomers.toString() : '—',
      color: 'text-gray-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2 font-medium">Monitoring the Xerovolt ecosystem performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-4">{kpi.label}</p>
            <h2 className="text-3xl font-bold mb-2">
              {loading ? <span className="text-gray-600">—</span> : kpi.value}
            </h2>
            <p className={`text-xs font-bold ${kpi.color}`}>
              {loading ? 'Loading...' : 'Live data'}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <a href="/dashboard/admin/devices" className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-[#f2994a]/30 transition-all group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">IoT Devices</p>
          <p className="text-sm text-gray-400 mb-4">Manage device registry and monitor live states.</p>
          <span className="text-[#f2994a] text-xs font-black uppercase tracking-widest group-hover:underline">Manage →</span>
        </a>
        <a href="/dashboard/admin/configs" className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-[#f2994a]/30 transition-all group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">Panel Configs</p>
          <p className="text-sm text-gray-400 mb-4">View saved configurations and link them to devices.</p>
          <span className="text-[#f2994a] text-xs font-black uppercase tracking-widest group-hover:underline">Manage →</span>
        </a>
        <a href="/dashboard/admin/users" className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-[#f2994a]/30 transition-all group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-3">Users</p>
          <p className="text-sm text-gray-400 mb-4">Manage user accounts and roles.</p>
          <span className="text-[#f2994a] text-xs font-black uppercase tracking-widest group-hover:underline">Manage →</span>
        </a>
      </div>

      <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold text-lg">Recent Orders</h3>
          <a href="/dashboard/admin/orders" className="text-xs font-black uppercase tracking-widest text-[#f2994a]">View All →</a>
        </div>
        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5">
                  <th className="p-6">Transaction ID</th>
                  <th className="p-6">Amount</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.01]">
                    <td className="p-6 font-mono text-gray-400">{order.transactionId || order.id}</td>
                    <td className="p-6 font-bold">{formatCurrency(order.amount || 0)}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${
                        order.status === 'SUCCESS'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : order.status === 'PENDING'
                          ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>{order.status}</span>
                    </td>
                    <td className="p-6 text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-8 text-gray-600 text-sm">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
