"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Register attempt:", email);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User created:", userCredential.user.uid);

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Register error:", err.message);
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleRegister}
        className="bg-[#121212] p-8 rounded-2xl w-96 space-y-5 border border-white/10"
      >
        <h1 className="text-2xl font-bold text-center">Create Account</h1>
        <p className="text-gray-400 text-sm text-center">
          Join qubeTech to manage your smart ecosystem
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full mt-1 px-4 py-3 bg-black border border-white/10 rounded-xl outline-none focus:border-[#ec8e45]"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Password</label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="Minimum 6 characters"
            className="w-full mt-1 px-4 py-3 bg-black border border-white/10 rounded-xl outline-none focus:border-[#ec8e45]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-[#ec8e45] text-black py-3 rounded-full font-semibold hover:bg-[#e07f34] transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#ec8e45] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
