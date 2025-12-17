"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Login attempt:", email);

      const res = await signInWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      console.log("User UID:", uid);

      // 🔥 Fetch user profile
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        throw new Error("User profile not found");
      }

      const role = snap.data().role;
      console.log("User role:", role);

      // ✅ Role-based redirect
      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/shop");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login error:", err.message);
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#121212] p-8 rounded-2xl w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold">Welcome Back</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-black border border-white/10 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 bg-black border border-white/10 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-[#ec8e45] text-black py-3 rounded-full font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
