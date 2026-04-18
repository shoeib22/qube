"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onIdTokenChanged, signOut } from "firebase/auth"; // Changed to onIdTokenChanged
import { auth } from "../lib/firebase"; 
import { getUserRole } from "../lib/getUserRole"; 
import Cookies from "js-cookie"; // Import js-cookie

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
        // onIdTokenChanged triggers on login, logout, AND automatic token refreshes
        const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
            setLoading(true);

            if (currentUser) {
                try {
                    setUser(currentUser);

                    // --- NEW: Store the token in a cookie for Server Components ---
                    // The token lasts 1 hour, so we set the cookie to expire in 1/24 of a day
                    const token = await currentUser.getIdToken();
                    Cookies.set('token', token, { expires: 1/24, path: '/' });

                    // 1. Try to get role from Custom Claims
                    const tokenResult = await currentUser.getIdTokenResult();
                    let userRole = tokenResult.claims.role as string;

                    // 2. If no custom claim, fallback to Firestore
                    if (!userRole) {
                        console.warn("No role in custom claims, fetching from Firestore...");
                        const firestoreRole = await getUserRole(currentUser.uid);
                        userRole = firestoreRole || "customer"; 
                    }

                    setRole(userRole);
                } catch (error) {
                    console.error("Failed to fetch user role or token:", error);
                    setRole(null);
                }
            } else {
                // User is logged out
                setUser(null);
                setRole(null);
                
                // --- NEW: Clear the cookie when logged out ---
                Cookies.remove('token', { path: '/' });
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            // Explicitly remove the cookie here as a fallback
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