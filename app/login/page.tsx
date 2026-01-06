"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { getUserRole } from "../../lib/getUserRole";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ Firebase sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // ✅ Small delay to allow Firestore to initialize
      await new Promise((resolve) => setTimeout(resolve, 300));

      // ✅ Fetch role safely
      const role = await getUserRole(uid);

      if (!role) {
        throw new Error("User role not found");
      }

      const normalizedRole = role.toLowerCase();

      // ✅ Redirect based on role
      if (normalizedRole === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/shop");
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#121212] p-8 rounded-2xl w-[360px] space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

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
          type="submit"
          disabled={loading}
          className="w-full bg-[#ec8e45] text-black py-3 rounded-full font-semibold disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
