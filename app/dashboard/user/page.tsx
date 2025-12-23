"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  User, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  ExternalLink,
  CreditCard,
  Clock
} from "lucide-react";

// Import Auth Wrapper
import RequireAuth from "../../../components/auth/RequireAuth";
// Import Header/Footer (optional, usually user dashboards keep the main site header)
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function UserAccountPage() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex flex-col">
        <Header />

        <main className="flex-grow pt-24 pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
            
            {/* --- SIDEBAR NAV --- */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 sticky top-28">
                {/* User Profile Summary */}
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-800">
                  <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-900/20">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Shoeib M.</h3>
                    <p className="text-xs text-gray-400">shoeib@example.com</p>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  <NavButton 
                    active={activeTab === "orders"} 
                    onClick={() => setActiveTab("orders")} 
                    icon={<Package size={20} />} 
                    label="My Orders" 
                  />
                  <NavButton 
                    active={activeTab === "profile"} 
                    onClick={() => setActiveTab("profile")} 
                    icon={<User size={20} />} 
                    label="Profile Details" 
                  />
                  <NavButton 
                    active={activeTab === "addresses"} 
                    onClick={() => setActiveTab("addresses")} 
                    icon={<MapPin size={20} />} 
                    label="Saved Addresses" 
                  />
                  <NavButton 
                    active={activeTab === "settings"} 
                    onClick={() => setActiveTab("settings")} 
                    icon={<Settings size={20} />} 
                    label="Account Settings" 
                  />
                  
                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <button className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={20} />
                        <span className="ml-3 font-medium">Sign Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 min-w-0">
              
              {/* TAB: MY ORDERS */}
              {activeTab === "orders" && (
                <div className="space-y-6 animate-fade-in">
                  <h1 className="text-2xl font-bold mb-6">Order History</h1>
                  
                  {/* Mock Order Card 1 */}
                  <OrderCard 
                    id="#ORD-7721" 
                    date="Oct 24, 2025" 
                    total="₹ 5,000" 
                    status="Delivered" 
                    items={["Smart Hub Pro", "Smart Bulb (x2)"]}
                    image="/images/products/smart-hub-pro.png"
                  />
                  
                  {/* Mock Order Card 2 */}
                  <OrderCard 
                    id="#ORD-7718" 
                    date="Sep 12, 2025" 
                    total="₹ 12,500" 
                    status="Delivered" 
                    items={["Smart Lock Ultra"]}
                    image="/images/products/smart-lock-ultra.png"
                  />
                </div>
              )}

              {/* TAB: PROFILE */}
              {activeTab === "profile" && (
                <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 animate-fade-in">
                  <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">First Name</label>
                        <input type="text" defaultValue="Shoeib" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Last Name</label>
                        <input type="text" defaultValue="Mutayyib" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</label>
                        <input type="email" defaultValue="shoeib@example.com" disabled className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone Number</label>
                        <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <button className="mt-8 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Save Changes
                  </button>
                </div>
              )}

               {/* TAB: ADDRESSES */}
               {activeTab === "addresses" && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Saved Addresses</h2>
                        <button className="text-sm bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200">
                            + Add New
                        </button>
                    </div>
                    
                    <div className="bg-[#121212] border border-blue-500/50 rounded-3xl p-6 relative">
                        <div className="absolute top-6 right-6 bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded">DEFAULT</div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-black rounded-full border border-gray-800">
                                <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Home</h4>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    Plot No. 42, Jubilee Hills,<br />
                                    Hyderabad, Telangana - 500033
                                </p>
                                <div className="flex gap-4 text-sm font-medium">
                                    <button className="text-blue-500 hover:text-blue-400">Edit</button>
                                    <button className="text-red-500 hover:text-red-400">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               )}

            </div>
          </div>
        </main>
        <Footer />
      </div>
    </RequireAuth>
  );
}

// --- SUB-COMPONENTS ---

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                active 
                ? "bg-white text-black font-bold shadow-lg" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
        >
            <span className={active ? "text-black" : "text-gray-500"}>{icon}</span>
            <span className="ml-3">{label}</span>
            {active && <ChevronRight size={16} className="ml-auto" />}
        </button>
    )
}

function OrderCard({ id, date, total, status, items, image }: { id: string, date: string, total: string, status: string, items: string[], image?: string }) {
    return (
        <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 group hover:border-gray-600 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-6 border-b border-gray-800 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg">{id}</h3>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded uppercase tracking-wide">
                            {status}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span className="flex items-center gap-1"><Clock size={14} /> {date}</span>
                        <span className="flex items-center gap-1"><CreditCard size={14} /> {total}</span>
                    </div>
                </div>
                <button className="px-4 py-2 border border-gray-700 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-colors">
                    View Invoice
                </button>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-xl border border-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {/* Placeholder image logic */}
                    <Image src={image || "/logo/qube.png"} alt="Order Item" width={40} height={40} className="object-contain" />
                </div>
                <div>
                    <p className="font-medium text-white">{items[0]}</p>
                    {items.length > 1 && (
                        <p className="text-sm text-gray-500">and {items.length - 1} other item(s)</p>
                    )}
                </div>
                <div className="ml-auto">
                     <button className="text-blue-500 hover:text-white text-sm font-medium flex items-center gap-1">
                        Track Order <ExternalLink size={14} />
                     </button>
                </div>
            </div>
        </div>
    )
}