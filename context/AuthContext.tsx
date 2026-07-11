"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getCustomerProfile } from "../lib/getUserRole";
import Cookies from "js-cookie"; // Import js-cookie

// Firebase-compatible shape so existing consumers (user.uid, user.getIdToken(),
// user.displayName) keep working unchanged after the Supabase migration.
export interface AppUser {
    uid: string;
    email: string;
    displayName: string | null;
    getIdToken: () => Promise<string>;
}

interface AuthContextType {
    user: AppUser | null;
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

const getIdToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const applySession = async (session: Session | null) => {
            if (!session?.user) {
                if (!active) return;
                setUser(null);
                setRole(null);
                Cookies.remove('token', { path: '/' });
                setLoading(false);
                return;
            }

            // Store the access token in a cookie for Server Components
            Cookies.set('token', session.access_token, { expires: 1 / 24, path: '/' });

            const profile = await getCustomerProfile(supabase, session.user.id, "role, first_name, last_name");

            if (!active) return;

            const displayName = profile
                ? [profile.first_name as string | null, profile.last_name as string | null]
                      .filter(Boolean)
                      .join(" ") || null
                : null;

            setUser({
                uid: session.user.id,
                email: session.user.email ?? "",
                displayName,
                getIdToken,
            });
            setRole((profile?.role as string | undefined) ?? "customer");
            setLoading(false);
        };

        // onAuthStateChange fires immediately with the current session on
        // subscribe, then again on every login/logout/token refresh.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoading(true);
            applySession(session);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            Cookies.remove('token', { path: '/' });
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
