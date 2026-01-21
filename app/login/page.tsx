'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Authentication successful:", { email });
      router.push('/');
    } catch (err: any) {
      console.error("Login failed", err);
      // Map firebase error codes to user friendly messages
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password.");
      } else {
        setError("Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black font-sans selection:bg-[#f2994a]/30">

      {/* Background depth - subtle glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[5%] -top-[5%] h-[30%] w-[30%] rounded-full bg-[#f2994a] opacity-[0.03] blur-[100px]" />
      </div>

      {/* Enlarged and Visible Top Right Navigation */}
      <nav className="absolute right-6 top-6 z-20 sm:right-12 sm:top-12">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-200 transition-all hover:border-[#f2994a] hover:bg-white/10 hover:text-white shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors group-hover:text-[#f2994a]"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </Link>
      </nav>

      {/* Formal Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-[440px] border border-white/5 bg-[#121212] p-10 sm:p-16 shadow-[0_25px_80px_rgba(0,0,0,0.7)]"
      >
        <header className="mb-12">
          <h1 className="text-sm font-light uppercase tracking-[0.5em] text-white/90">
            Sign In
          </h1>
          <div className="mt-4 h-[1px] w-8 bg-[#f2994a]" />
          {error && (
            <p className="mt-4 text-[10px] uppercase tracking-widest text-red-500 font-bold animate-pulse">
              {error}
            </p>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Email Field */}
          <div className="group relative">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 transition-colors group-focus-within:text-[#f2994a]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none transition-all focus:border-[#f2994a] placeholder:text-gray-800"
              required
            />
          </div>

          {/* Password Field */}
          <div className="group relative">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 transition-colors group-focus-within:text-[#f2994a]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none transition-all focus:border-[#f2994a] placeholder:text-gray-800"
              required
            />
          </div>

          {/* Login Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f2994a] py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating..." : "Login"}
            </button>
          </div>
        </form>

        <footer className="mt-16 border-t border-white/5 pt-8 text-center">
          <Link
            href="/forgot-password"
            className="text-[10px] uppercase tracking-widest text-white-600 transition-colors hover:text-white"
          >
            Forgot Password?
          </Link>

          <p className="mt-8 text-[10px] uppercase tracking-widest text-gray-500">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-bold text-white transition-colors hover:text-[#f2994a]"
            >
              Create Account
            </Link>
          </p>

          <div className="mt-6 flex justify-center items-center gap-2 text-gray-700">
            <div className="h-1 w-1 rounded-full bg-green-500/50" />
            <span className="text-[9px] uppercase tracking-widest">
              SSL Encrypted Environment
            </span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}