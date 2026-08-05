"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (!user) return null;

  async function handleLogout() {
    try {
      console.log("Logging out user:", user!.id);
      const supabase = createClient();
      await supabase.auth.signOut();
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
        <UserIcon className="w-4 h-4" />
        <span className="text-sm">{user.email}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-[#121212] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          <button
            onClick={() => router.push("/dashboard")}
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
