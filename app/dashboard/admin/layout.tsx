'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Analytics', href: '/dashboard/admin', icon: '📊' },
    { name: 'Order Management', href: '/dashboard/admin/orders', icon: '📦' },
    { name: 'Product Catalog', href: '/dashboard/admin/products', icon: '🏷️' },
    { name: 'User Directory', href: '/dashboard/admin/users', icon: '👥' },
    { name: 'System Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-[#080808] p-6 hidden lg:flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f2994a] rounded-lg flex items-center justify-center font-black text-black">Q</div>
          <span className="text-xl font-bold tracking-tighter">ADMIN PANEL</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                pathname === item.href ? 'bg-[#f2994a] text-black shadow-lg shadow-[#f2994a]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <Link href="/profile" className="text-xs font-bold text-gray-600 hover:text-[#f2994a] transition-colors flex items-center gap-2">
             ← Exit to Store
          </Link>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-black p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}