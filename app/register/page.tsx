'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login immediately on success
        router.push('/login');
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black font-sans">
      <nav className="absolute right-6 top-6 z-20 sm:right-12 sm:top-12">
        <Link href="/" className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-200 transition-all hover:border-[#f2994a] hover:bg-white/10 hover:text-white shadow-lg">
          <span>Home</span>
        </Link>
      </nav>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-[480px] border border-white/5 bg-[#121212] p-10 sm:p-16 shadow-2xl">
        <header className="mb-10 text-left">
          <h1 className="text-sm font-light uppercase tracking-[0.5em] text-white/90">Create Account</h1>
          <div className="mt-4 h-[1px] w-8 bg-[#f2994a]" />
          {error && <p className="mt-4 text-[10px] text-red-500 uppercase tracking-widest font-bold">{error}</p>}
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">First Name</label>
              <input suppressHydrationWarning type="text" onChange={e => setFormData({...formData, firstName: e.target.value})} className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none focus:border-[#f2994a]" required />
            </div>
            <div className="group">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Last Name</label>
              <input suppressHydrationWarning type="text" onChange={e => setFormData({...formData, lastName: e.target.value})} className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none focus:border-[#f2994a]" required />
            </div>
          </div>

          <div className="group">
            <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Email Address</label>
            <input suppressHydrationWarning type="email" onChange={e => setFormData({...formData, email: e.target.value})} className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none focus:border-[#f2994a]" required />
          </div>

          <div className="group">
            <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Password</label>
            <input suppressHydrationWarning type="password" onChange={e => setFormData({...formData, password: e.target.value})} className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none focus:border-[#f2994a]" required />
          </div>

          <button suppressHydrationWarning type="submit" disabled={isLoading} className="w-full bg-[#f2994a] py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-white disabled:opacity-50">
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}