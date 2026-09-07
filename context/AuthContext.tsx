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
        let initialized = false;

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
            const nextRole = (profile?.role as string | undefined) ?? "customer";

            // Token refreshes (routinely hourly, or rapid-fire if the client's
            // clock has drifted from the server's) re-run this same callback
            // with an unchanged user. Keep `user`/`role` referentially stable
            // across those so components that depend on them in a
            // useCallback/useEffect dep array (nearly every admin page) don't
            // re-render and re-fetch every time — only a genuine identity
            // change should do that.
            setUser((prev) =>
                prev && prev.uid === session.user.id && prev.email === (session.user.email ?? "") && prev.displayName === displayName
                    ? prev
                    : { uid: session.user.id, email: session.user.email ?? "", displayName, getIdToken }
            );
            setRole((prev) => (prev === nextRole ? prev : nextRole));
            setLoading(false);
        };

        // onAuthStateChange fires immediately with the current session on
        // subscribe, then again on every login/logout/token refresh. Only the
        // very first resolution should blank the page with the loading
        // state — later events (refreshes) update state in place.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!initialized) setLoading(true);
            initialized = true;
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
