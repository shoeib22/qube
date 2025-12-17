"use client";

import { useEffect, useState } from "react";
import { auth,db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        router.push("/shop"); // 🚫 not admin
        return;
      }

      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  if (loading) return null;
  return <>{children}</>;
}
