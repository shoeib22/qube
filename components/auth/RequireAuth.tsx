"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

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
    let resolved = false;

    // onAuthStateChange fires immediately with the current session on
    // subscribe, then again on every login/logout/token refresh.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;
      if (!user) {
        router.push("/login");
        return;
      }

      // If a specific role is required, we must check the profiles table
      const roleToCheck = requireAdmin ? 'admin' : requiredRole;

      if (roleToCheck) {
        try {
          const { data: profile, error } = await supabase
            .from("customer_profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (error || !profile || profile.role !== roleToCheck) {
            console.warn(`User ${user.id} does not have required role: ${roleToCheck}`);
            router.push("/"); // Redirect to home on unauthorized
            return;
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          // On error, safe default: block and redirect
          router.push("/login");
          return;
        }
      }

      resolved = true;
      setLoading(false);
    });

    // Fallback timeout in case auth hangs (e.g. network issues/bad config)
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.warn("Auth check timed out, redirecting to login...");
        router.push("/login");
      }
    }, 4000);

    return () => {
      subscription.unsubscribe();
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
