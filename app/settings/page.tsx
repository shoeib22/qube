'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SecurityPage() {
  // State to manage user data
  const [userData, setUserData] = useState({
    name: 'Kashif User',
    email: 'kashif@example.com',
    mobile: '+91 98765 43210',
    password: '••••••••••••',
    twoStep: 'Disabled'
  });

  // State to track which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleSave = () => {
    // Here you would normally trigger a Firebase or API update
    setEditingField(null);
  };

  const renderSection = (label: string, field: keyof typeof userData, type: string = "text") => {
    const isEditing = editingField === field;

    return (
      <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 last:border-0">
        <div className="flex-1 w-full">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">{label}</p>
          {isEditing ? (
            <input 
              type={type}
              value={userData[field]}
              onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
              className="bg-black border border-[#f2994a] text-white p-2 rounded w-full max-w-md outline-none focus:ring-1 focus:ring-[#f2994a]"
              autoFocus
            />
          ) : (
            <p className="text-base font-medium text-white/90">{userData[field]}</p>
          )}
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-[#f2994a] text-black text-xs font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all"
              >
                Save
              </button>
              <button 
                onClick={() => setEditingField(null)}
                className="px-6 py-2 bg-white/5 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setEditingField(field)}
              className="px-8 py-2.5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#f2994a]/30">
      <div className="relative z-10 max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
        
        <header className="mb-16">
          <Link href="/profile" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#f2994a] mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
            Back to Account
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Login & Security</h1>
          <p className="text-gray-500 mt-2">Update your information and keep your account secure.</p>
        </header>

        <div className="border border-white/5 rounded-2xl overflow-hidden bg-[#080808] shadow-2xl">
          {renderSection("Name", "name")}
          {renderSection("Email", "email", "email")}
          {renderSection("Primary Mobile Number", "mobile", "tel")}
          {renderSection("Password", "password", "password")}
          
          {/* Two-Step Verification (Toggle Style) */}
          <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">Two-Step Verification</p>
              <p className="text-base font-medium text-white/90">{userData.twoStep}</p>
            </div>
            <button 
              onClick={() => setUserData({...userData, twoStep: userData.twoStep === 'Enabled' ? 'Disabled' : 'Enabled'})}
              className={`px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                userData.twoStep === 'Enabled' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-white border border-white/10'
              }`}
            >
              {userData.twoStep === 'Enabled' ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Security Tips Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-xl">
            <h4 className="text-sm font-bold text-[#f2994a] mb-2 uppercase tracking-wide">Security Tip</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Use a unique password with at least 12 characters to keep your Qube ecosystem safe.</p>
          </div>
          <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded-xl">
            <h4 className="text-sm font-bold text-[#f2994a] mb-2 uppercase tracking-wide">Login History</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Last login from Hyderabad, India on Jan 06, 2026.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
{/* Additional Security Info Section */}
<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
  
  {/* Security Tip Card */}
  <div className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl shadow-lg group hover:border-[#f2994a]/30 transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-[#f2994a]/10 rounded-lg text-[#f2994a]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      </div>
      <h4 className="text-sm font-bold text-[#f2994a] uppercase tracking-wider">Security Tip</h4>
    </div>
    <p className="text-sm text-gray-500 leading-relaxed">
      Use a unique password that you don't use on other websites. We recommend at least 12 characters with a mix of symbols.
    </p>
  </div>

  {/* Login History Card */}
  <div className="p-8 bg-[#0c0c0c] border border-white/5 rounded-2xl shadow-lg group hover:border-[#f2994a]/30 transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-[#f2994a] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Login History</h4>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-400 font-medium">Last login: Hyderabad, India</p>
      <p className="text-xs text-gray-600">Jan 06, 2026 at 4:35 PM</p>
    </div>
    <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#f2994a] hover:underline decoration-2 underline-offset-4">
      See all activity →
    </button>
  </div>

</div>