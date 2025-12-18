"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

import LoginButton from "../components/ui/LoginButton";
import UserMenu from "../components/auth/UserMenu";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-transparent">
      <div className="w-full px-6 md:px-8 py-4 flex justify-between items-center md:grid md:grid-cols-3">
        {/* LEFT — LOGO */}
        <div className="flex items-center z-50">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Image
              src="/logo/qube.png"
              alt="qubeTech Logo"
              width={70}
              height={70}
              className="object-contain cursor-pointer w-[50px] md:w-[70px]"
              priority
            />
          </Link>
        </div>

        {/* CENTER — NAVIGATION (Desktop Only) */}
        <nav className="hidden md:flex justify-center space-x-10 text-neutral-300 font-medium">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/features" className="hover:text-white transition">Features</Link>
          <Link href="/shop" className="hover:text-white transition">Shop</Link>
          <Link href="/support" className="hover:text-white transition">Support</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </nav>

        {/* RIGHT — AUTH ACTION (Desktop Only) */}
        <div className="hidden md:flex justify-end">
          {user ? (
            <UserMenu />
          ) : (
            <LoginButton
              label="Login"
              variant="outline"
              onClick={() => router.push("/login")}
            />
          )}
        </div>

        {/* RIGHT — HAMBURGER (Mobile Only) */}
        <div className="md:hidden flex items-center z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN - Fixed Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col pt-24 px-6 space-y-6 md:hidden">
          <nav className="flex flex-col space-y-6 text-center text-xl text-neutral-300 font-medium">
            <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2">Features</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2">Shop</Link>
            <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2">Support</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2">Contact</Link>
          </nav>

          <div className="flex justify-center pt-8 border-t border-white/10">
            {user ? (
              <div onClick={() => setIsMobileMenuOpen(false)}>
                 <UserMenu />
              </div>
            ) : (
              <LoginButton
                label="Login"
                variant="outline"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/login");
                }}
                className="w-full max-w-xs"
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
}