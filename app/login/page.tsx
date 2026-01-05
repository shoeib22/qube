'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API Call for Authentication
    setTimeout(() => {
      // Logic: Simulate a "User" object coming from your DB/Auth provider
      const mockUser = {
        email: email,
        role: email.includes('admin') ? 'admin' : 'customer', // Role based on email for demo
      };

      // Role-Based Access Control (RBAC) Logic
      if (mockUser.role === 'admin' || mockUser.role === 'customer') {
        console.log("Authorized as:", mockUser.role);
        // You would typically set a cookie or JWT here
        router.push('/'); 
      } else {
        setError('Access Denied: You do not have the required permissions.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black font-sans selection:bg-[#f2994a]/30">
      
      <nav className="absolute right-6 top-6 z-20 sm:right-12 sm:top-12">
        <Link href="/" className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-200 transition-all hover:border-[#f2994a] hover:bg-white/10 hover:text-white shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors group-hover:text-[#f2994a]"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          <span>Home</span>
        </Link>
      </nav>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="z-10 w-full max-w-[440px] border border-white/5 bg-[#121212] p-10 sm:p-16 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
        <header className="mb-12">
          <h1 className="text-sm font-light uppercase tracking-[0.5em] text-white/90">Sign In</h1>
          <div className="mt-4 h-[1px] w-8 bg-[#f2994a]" />
          {error && <p className="mt-4 text-[10px] text-red-500 uppercase tracking-widest font-bold">{error}</p>}
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="group relative">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 transition-colors group-focus-within:text-[#f2994a]">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none transition-all focus:border-[#f2994a] placeholder:text-gray-800" required />
          </div>

          <div className="group relative">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 transition-colors group-focus-within:text-[#f2994a]">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none transition-all focus:border-[#f2994a] placeholder:text-gray-800" required />
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#f2994a] py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-white active:scale-[0.98] disabled:opacity-50">
            {isLoading ? "Verifying..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}