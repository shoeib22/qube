"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <p className="animate-pulse">Loading access rights...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <button
                    onClick={() => router.push("/")}
                    className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
