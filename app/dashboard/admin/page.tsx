"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Bell,
  MoreVertical,
  ArrowUpRight,
  DollarSign
} from "lucide-react";

// Import Auth Wrapper
import RequireAuth from "../../../components/auth/RequireAuth";
// Import Product Data (to show in product list)
import { products } from "../../../data/products";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <RequireAuth>
      <div className="flex h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-hidden">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-20 lg:w-64 border-r border-gray-800 bg-[#0a0a0a] flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-800">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">
                Q
              </div>
              <span className="ml-3 font-bold text-lg hidden lg:block">qubeAdmin</span>
            </div>

            <nav className="mt-8 px-2 space-y-2">
              <SidebarItem 
                icon={<LayoutDashboard size={20} />} 
                label="Overview" 
                active={activeTab === "overview"} 
                onClick={() => setActiveTab("overview")}
              />
              <SidebarItem 
                icon={<ShoppingBag size={20} />} 
                label="Orders" 
                active={activeTab === "orders"} 
                onClick={() => setActiveTab("orders")}
              />
              <SidebarItem 
                icon={<Package size={20} />} 
                label="Products" 
                active={activeTab === "products"} 
                onClick={() => setActiveTab("products")}
              />
              <SidebarItem 
                icon={<Users size={20} />} 
                label="Customers" 
                active={activeTab === "customers"} 
                onClick={() => setActiveTab("customers")}
              />
            </nav>
          </div>

          <div className="p-2 mb-4">
             <SidebarItem 
                icon={<Settings size={20} />} 
                label="Settings" 
                active={activeTab === "settings"} 
                onClick={() => setActiveTab("settings")}
              />
              <Link href="/" className="flex items-center px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group">
                <LogOut size={20} />
                <span className="ml-3 font-medium hidden lg:block">Exit</span>
              </Link>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Top Header */}
          <header className="h-20 border-b border-gray-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-8">
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
            
            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-[#121212] border border-gray-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64 transition-colors"
                />
              </div>
              <button className="relative text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20"></div>
            </div>
          </header>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            
            {/* VIEW: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <StatCard title="Total Revenue" value="₹ 12,45,000" change="+12.5%" icon={<DollarSign className="text-green-500" />} />
                  <StatCard title="Active Orders" value="24" change="+4.2%" icon={<ShoppingBag className="text-blue-500" />} />
                  <StatCard title="Total Products" value="18" change="0%" icon={<Package className="text-purple-500" />} />
                  <StatCard title="Total Customers" value="1,204" change="+8.1%" icon={<Users className="text-orange-500" />} />
                </div>

                {/* Recent Orders Table */}
                <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                    <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
                          <th className="pb-4 pl-4">Order ID</th>
                          <th className="pb-4">Product</th>
                          <th className="pb-4">Customer</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-300">
                        <OrderRow id="#ORD-7721" product="Smart Hub Pro" customer="Rahul V." status="Completed" amount="₹ 5,000" />
                        <OrderRow id="#ORD-7722" product="RGB Controller" customer="Sarah K." status="Pending" amount="₹ 1,200" />
                        <OrderRow id="#ORD-7723" product="Smart Lock Ultra" customer="Amit S." status="Processing" amount="₹ 12,500" />
                        <OrderRow id="#ORD-7724" product="Retro Switch 4G" customer="Priya M." status="Completed" amount="₹ 3,500" />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: PRODUCTS */}
            {activeTab === "products" && (
              <div className="space-y-6">
                 <div className="flex justify-end">
                    <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Plus size={16} /> Add Product
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(p => (
                        <div key={p.id} className="bg-[#121212] border border-gray-800 rounded-2xl p-4 group hover:border-gray-600 transition-all">
                            <div className="relative h-40 w-full bg-black/50 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-4">
                                <Image src={p.image || `/images/products/${p.id}.png`} alt={p.name} fill className="object-contain" />
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-white mb-1">{p.name}</h4>
                                    <p className="text-xs text-gray-500">{p.category}</p>
                                </div>
                                <button className="text-gray-500 hover:text-white">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
                                <span className="font-mono text-sm">₹ {p.price?.toLocaleString() || "N/A"}</span>
                                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">In Stock</span>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
            )}

            {/* VIEW: ORDERS OR CUSTOMERS (Placeholder) */}
            {(activeTab === "orders" || activeTab === "customers" || activeTab === "settings") && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                        <Settings className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold">Work in Progress</h3>
                    <p className="text-gray-500">This module is currently under development.</p>
                </div>
            )}

          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

// --- SUB COMPONENTS FOR CLEANER CODE ---

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all group ${
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className={`${active ? "text-white" : "text-gray-500 group-hover:text-white"}`}>{icon}</span>
      <span className="ml-3 font-medium hidden lg:block">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full hidden lg:block"></div>}
    </button>
  );
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: any }) {
    return (
        <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-black rounded-2xl border border-gray-800">
                    {icon}
                </div>
                <div className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    {change} <ArrowUpRight size={12} className="ml-1" />
                </div>
            </div>
            <h4 className="text-gray-400 text-sm font-medium mb-1">{title}</h4>
            <h2 className="text-2xl font-bold text-white">{value}</h2>
        </div>
    )
}

function OrderRow({ id, product, customer, status, amount }: { id: string, product: string, customer: string, status: string, amount: string }) {
    let statusColor = "bg-gray-800 text-gray-400";
    if (status === "Completed") statusColor = "bg-green-500/10 text-green-500";
    if (status === "Pending") statusColor = "bg-yellow-500/10 text-yellow-500";
    if (status === "Processing") statusColor = "bg-blue-500/10 text-blue-500";

    return (
        <tr className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
            <td className="py-4 pl-4 font-mono text-gray-400">{id}</td>
            <td className="py-4 font-medium text-white">{product}</td>
            <td className="py-4">{customer}</td>
            <td className="py-4">
                <span className={`text-xs px-2 py-1 rounded font-medium ${statusColor}`}>
                    {status}
                </span>
            </td>
            <td className="py-4 font-bold">{amount}</td>
        </tr>
    )
}