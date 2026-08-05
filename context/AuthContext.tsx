"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { getUserRole } from "../lib/getUserRole";

interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const resolveRole = async (currentUser: User) => {
            try {
                // 1. Try app_metadata first (Supabase's equivalent of Firebase custom
                //    claims, included in the session — no extra round trip) for performance.
                let userRole = currentUser.app_metadata?.role as string | undefined;

                // 2. If not set, fall back to the profile table.
                if (!userRole) {
                    console.warn("No role in app_metadata, fetching from profile table...");
                    const profileRole = await getUserRole(currentUser.id);
                    userRole = profileRole || "customer";
                }

                setRole(userRole);
            } catch (error) {
                console.error("Failed to fetch user role:", error);
                setRole(null);
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                resolveRole(session.user).finally(() => setLoading(false));
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(true);

            if (session?.user) {
                resolveRole(session.user).finally(() => setLoading(false));
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
