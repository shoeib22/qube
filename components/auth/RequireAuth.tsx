"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { useRouter } from "next/navigation";

export default function RequireAuth({
  children,
  requiredRole,
  requireAdmin
}: {
  children: React.ReactNode,
  requiredRole?: string,
  requireAdmin?: boolean
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // If a specific role is required, we must check Firestore
      const roleToCheck = requireAdmin ? 'admin' : requiredRole;

      if (roleToCheck) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (!snap.exists() || snap.data().role !== roleToCheck) {
            console.warn(`User ${user.uid} does not have required role: ${roleToCheck}`);
            router.push("/"); // Redirect to home on unauthorized
            return;
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          // On error (e.g. firestore missing), we might want to block or allow?
          // Safe default: block or redirect
          router.push("/login");
          return;
        }
      }

      setLoading(false);
    });

    // Fallback timeout in case auth hangs (e.g. network issues/bad config)
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth check timed out, redirecting to login...");
        router.push("/login");
      }
    }, 4000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [router, requiredRole, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
