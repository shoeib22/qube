'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: null, message: '' });

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: "Passwords don't match." });
            return;
        }

        setIsLoading(true);
        try {
            // Supabase establishes a recovery session client-side from the
            // reset-link URL fragment before this page mounts.
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            setStatus({ type: 'success', message: 'Password updated! Redirecting to login…' });
            setTimeout(() => router.push('/login'), 1500);
        } catch (err) {
            console.error("Password update error", err);
            const message = err instanceof Error ? err.message : '';
            setStatus({ type: 'error', message: message || 'Failed to update password. Please request a new reset link.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-black font-sans selection:bg-[#f2994a]/30">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-[5%] -top-[5%] h-[30%] w-[30%] rounded-full bg-[#f2994a] opacity-[0.03] blur-[100px]" />
            </div>

            <nav className="absolute right-6 top-6 z-20 sm:right-12 sm:top-12">
                <Link
                    href="/login"
                    className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-200 transition-all hover:border-[#f2994a] hover:bg-white/10 hover:text-white shadow-lg"
                >
                    <span>Back to Login</span>
                </Link>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 w-full max-w-[440px] border border-white/5 bg-[#121212] p-10 sm:p-16 shadow-[0_25px_80px_rgba(0,0,0,0.7)]"
            >
                <header className="mb-10">
                    <h1 className="text-sm font-light uppercase tracking-[0.5em] text-white/90">
                        Set New Password
                    </h1>
                    <div className="mt-4 h-[1px] w-8 bg-[#f2994a]" />

                    {status.message && (
                        <p className={`mt-6 text-[10px] uppercase tracking-widest font-bold animate-pulse ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {status.message}
                        </p>
                    )}
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="group relative">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 transition-colors group-focus-within:text-[#f2994a]">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none transition-all focus:border-[#f2994a] placeholder:text-gray-800"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="group relative">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 transition-colors group-focus-within:text-[#f2994a]">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-sm text-white outline-none transition-all focus:border-[#f2994a] placeholder:text-gray-800"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#f2994a] py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Updating…" : "Update Password"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
