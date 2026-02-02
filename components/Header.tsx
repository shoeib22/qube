"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { ShoppingCart } from "lucide-react";

import LoginButton from "../components/ui/LoginButton";
import UserMenu from "../components/auth/UserMenu";
import { useCart } from "../context/CartContext";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cartCount } = useCart();

  // Handle Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="w-full fixed top-0 left-0 z-50 transition-all duration-300 bg-transparent backdrop-blur-sm">
      <div className="w-full px-6 md:px-8 py-2 flex justify-between items-center md:grid md:grid-cols-3">
        {/* LEFT — LOGO */}
        <div className="flex items-center z-50">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Image
              src="/logo/xerovolt.png"
              alt="Xerovolt Tech Logo"
              width={160}
              height={160}
              className="object-contain cursor-pointer w-[120px] md:w-[160px]"
              priority
            />
          </Link>
        </div>

        {/* CENTER — NAVIGATION (Desktop Only) */}
        <nav className="hidden md:flex justify-center space-x-10 text-neutral-300 font-medium">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/services" className="hover:text-white transition">Solutions</Link>
          <Link href="/shop" className="hover:text-white transition">Shop</Link>
          <Link href="/support" className="hover:text-white transition">Support</Link>
          <Link href="/contact" className="hover:text-white transition">Contact</Link>
        </nav>

        {/* RIGHT — ACTIONS (Desktop Only) */}
        <div className="hidden md:flex justify-end items-center gap-6">
          <Link
            href="/cart"
            className="relative text-neutral-300 hover:text-white transition p-1"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-black">
                {cartCount}
              </span>
            )}
          </Link>

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
        <div className="md:hidden flex items-center gap-4 z-50">
          <Link href="/cart" className="relative text-white mr-2">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-black">
                {cartCount}
              </span>
            )}
          </Link>

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

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col pt-24 px-6 space-y-6 md:hidden">
          <nav className="flex flex-col space-y-6 text-center text-xl text-neutral-300 font-medium">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2">Home</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2">Solutions</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2">Shop</Link>
            <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-2 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart ({cartCount})
            </Link>
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