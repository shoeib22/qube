"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase"; // Ensure this path is correct
import { getUserRole } from "../lib/getUserRole"; // Ensure this path is correct

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
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(true);

            if (currentUser) {
                try {
                    // 1. Try to get role from Custom Claims (IdTokenResult) first for performance
                    const tokenResult = await currentUser.getIdTokenResult();
                    let userRole = tokenResult.claims.role as string;

                    // 2. If no custom claim, fallback to Firestore
                    if (!userRole) {
                        console.warn("No role in custom claims, fetching from Firestore...");
                        const firestoreRole = await getUserRole(currentUser.uid);
                        userRole = firestoreRole || "customer"; // Default to customer if nothing found
                    }

                    setRole(userRole);
                } catch (error) {
                    console.error("Failed to fetch user role:", error);
                    setRole(null);
                }
            } else {
                setRole(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
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
