"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, role, logout } = useAuth();

  if (!user) return null;

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition"
      >
        <User className="w-4 h-4" />
        <span className="text-sm">{user.email}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-[#121212] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          <button
            onClick={() => router.push(role === "admin" ? "/dashboard/admin" : "/profile")}
            className="w-full px-4 py-3 text-left text-sm hover:bg-white/10"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
