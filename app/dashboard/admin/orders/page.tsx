'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';

interface OrderData {
  id: string;
  transactionId: string;
  customer: string;
  product: string;
  amount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
}

const STATUSES = ['Processing', 'Shipped', 'Delivered'];

export default function OrderManagement() {
  const [filter, setFilter] = useState('All');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'Failed to load orders');
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, fulfillmentStatus: string) => {
    if (!currentUser) return;
    setUpdating(orderId);
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus } : o)));
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, fulfillmentStatus }),
      });
      if (!res.ok) {
        setOrders(previous);
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status', err);
      setOrders(previous);
      alert('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter((o) => filter === 'All' || o.fulfillmentStatus === filter);

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
           {['All', ...STATUSES].map(status => (
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

      {loading ? (
        <p className="animate-pulse text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl flex flex-wrap items-center justify-between gap-8 group hover:border-[#f2994a]/30 transition-all">
              <div className="flex items-center gap-8">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-[#f2994a] shadow-inner uppercase">
                  {order.transactionId ? order.transactionId.slice(-2) : order.id.slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">{order.customer}</h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {order.product} • ₹{order.amount.toLocaleString('en-IN')} • {order.paymentStatus}
                  </p>
                  <p className="text-[10px] text-gray-600 font-mono mt-1">{order.transactionId || order.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest mb-2">Change Status</p>
                  <select
                    value={order.fulfillmentStatus}
                    disabled={updating === order.id}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="bg-black text-[11px] font-black text-[#f2994a] uppercase border-none outline-none cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {updating === order.id && <span className="ml-2 text-[10px] animate-pulse text-gray-500">...</span>}
                </div>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500 border border-white/5 rounded-2xl">No orders found.</div>
          )}
        </div>
      )}
    </div>
  );
}
