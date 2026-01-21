'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AccountDashboard() {
  const [mounted, setMounted] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 md:p-12 lg:p-20">
      
      {/* Header with Integrated Profile Picture */}
      <header className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/5 pb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Picture Upload */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full border border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#f2994a]/50 bg-[#0c0c0c]">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              )}
            </div>
            <div className="absolute inset-0 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold">
              EDIT
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight">Your Account</h1>
            <p className="text-orange-300 mt-1 text-lg">Kashif User  personalaccount</p>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-orange-300 hover:text-[#f2994a] transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Return to Store
        </Link>
      </header>

      {/* Account Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tile: Orders */}
        <Link href="/orders" className="flex items-start gap-6 p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group">
          <div className="p-4 bg-white/5 rounded-xl group-hover:text-[#f2994a] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Your Orders</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Track, return, or buy items again</p>
          </div>
        </Link>

        {/* Tile: Login & Security */}
        <Link href="/settings" className="flex items-start gap-6 p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group">
          <div className="p-4 bg-white/5 rounded-xl group-hover:text-[#f2994a] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Login & Security</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Manage password, email, and mobile</p>
          </div>
        </Link>

        {/* Tile: Addresses */}
        <Link href="/addresses" className="flex items-start gap-6 p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group">
          <div className="p-4 bg-white/5 rounded-xl group-hover:text-[#f2994a] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Your Addresses</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Edit delivery addresses and defaults</p>
          </div>
        </Link>

        {/* Tile: Payments */}
<Link href="/payments" className="flex items-start gap-6 p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group cursor-pointer">
  <div className="p-4 bg-white/5 rounded-xl group-hover:text-[#f2994a] transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  </div>
  <div>
    <h2 className="text-xl font-bold text-white">Payments</h2>
    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Manage credit cards and transactions</p>
  </div>
</Link>

        {/* Tile: Wishlist */}
<Link href="/wishlist" className="flex items-start gap-6 p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group cursor-pointer">
  <div className="p-4 bg-white/5 rounded-xl group-hover:text-[#f2994a] transition-colors">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  </div>
  <div>
    <h2 className="text-xl font-bold">Wishlist</h2>
    <p className="text-sm text-gray-500 mt-2 leading-relaxed">Items you want to purchase later</p>
  </div>
</Link>

{/* Tile: Contact Support */}
        <Link 
          href="/contact-support" 
          className="flex items-start gap-5 p-6 bg-[#0c0c0c] border border-white/5 rounded-xl hover:bg-white/[0.03] transition-all group"
        >
          <div className="mt-1 p-3 bg-white/5 rounded-lg group-hover:text-[#f2994a] transition-colors">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="28" 
              height="28" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold">Contact Support</h2>
            <p className="text-sm text-gray-500 mt-1">Chat with us or find help topics</p>
          </div>
        </Link>
      </main>

      {/* Account Footer Links */}
      <footer className="max-w-6xl mx-auto mt-24 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
        <div className="space-y-4">
          <h3 className="font-bold text-gray-300 uppercase tracking-wider text-xs">Content and devices</h3>
          <ul className="space-y-3 text-gray-500">
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">Apps & more</li>
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">Digital content</li>
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">Device Management</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-300 uppercase tracking-wider text-xs">Email alerts & ads</h3>
          <ul className="space-y-3 text-gray-500">
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">Advertising preferences</li>
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">Communication Centre</li>
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">SMS Notifications</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-300 uppercase tracking-wider text-xs">More ways to pay</h3>
          <ul className="space-y-3 text-gray-500">
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">Default Purchase Settings</li>
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">Manage Gift Cards</li>
            <li className="hover:text-[#f2994a] cursor-pointer transition-colors">Coupons & Credits</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}