'use client';

import React from 'react';
import Link from 'next/link';

export default function SecurityPage() {
  const securitySections = [
    { label: 'Name', value: 'Kashif User', action: 'Edit' },
    { label: 'Email', value: 'kashif@example.com', action: 'Edit' },
    { label: 'Primary Mobile Number', value: '+91 98765 43210', action: 'Edit' },
    { label: 'Password', value: '••••••••••••', action: 'Edit' },
    { label: 'Two-Step Verification', value: 'Disabled', action: 'Enable' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f2994a]/30">
      
      {/* Decorative background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-[#f2994a] opacity-[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
        
        {/* Navigation Header */}
        <header className="mb-16">
          <Link 
            href="/profile" 
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#f2994a] transition-all mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Account
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Login & Security</h1>
          <p className="text-gray-500 mt-2">Manage your personal information and account protection settings.</p>
        </header>

        {/* Security Settings List */}
        <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#080808] shadow-2xl">
          {securitySections.map((item, index) => (
            <div 
              key={item.label} 
              className={`p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ${
                index !== securitySections.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-base font-medium text-white/90">{item.value}</p>
              </div>
              <button className="w-full sm:w-auto px-8 py-2.5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                {item.action}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Security Info to reduce blank space */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-xl">
            <h4 className="text-sm font-bold text-[#f2994a] mb-2 uppercase tracking-wide">Security Tip</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Use a unique password that you don't use on other websites. We recommend at least 12 characters.
            </p>
          </div>
          <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-xl">
            <h4 className="text-sm font-bold text-[#f2994a] mb-2 uppercase tracking-wide">Login History</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Last login was from Hyderabad, India on Jan 06, 2026. If this wasn't you, secure your account.
            </p>
          </div>
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-center">
          <button className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-red-500 transition-colors">
            Close your account permanently
          </button>
        </footer>
      </div>
    </div>
  );
}