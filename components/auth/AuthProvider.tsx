"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, getIdTokenResult } from "firebase/auth";
import { auth } from "../../lib/firebase";

type AuthContextType = {
  user: User | null;
  role: string | null; // Added role state
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Fetch the ID token result to get custom claims
        const tokenResult = await getIdTokenResult(u);
        const userRole = tokenResult.claims.role as string; // Assumes you named the claim 'role'
        
        setUser(u);
        setRole(userRole || "user"); // Default to 'user' if no role exists
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);