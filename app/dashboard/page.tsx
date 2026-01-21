'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function DashboardRedirect() {
    const router = useRouter();
    const { user, role, loading } = useAuth();

    useEffect(() => {
        // Wait for auth to finish loading
        if (loading) return;

        // If not authenticated, redirect to login
        if (!user) {
            router.replace('/login');
            return;
        }

        // Route based on role
        if (role === 'admin') {
            router.replace('/dashboard/admin');
        } else {
            // Default to customer dashboard for 'customer' role or any other role
            router.replace('/dashboard/user');
        }
    }, [user, role, loading, router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#f2994a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
