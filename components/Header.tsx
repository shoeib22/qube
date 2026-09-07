"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";

import LoginButton from "../components/ui/LoginButton";
import UserMenu from "../components/auth/UserMenu";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled && !isMobileMenuOpen
          ? "bg-bg/70 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Container is now w-full with horizontal padding instead of a fixed max-width */}
      <div className="w-full px-6 md:px-10 h-30 md:h-28 flex justify-between items-center">
        
        {/* LEFT — LOGO (Leftmost) */}
       <div className="flex-1 flex items-center justify-start h-20 z-50">
  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
    <Image
      src="/logo/xerovolt.svg"
      alt="Xerovolt Tech Logo"
      width={600}
      height={120}
      className="object-contain cursor-pointer w-[180px] md:w-[220px]"
      priority
    />
  </Link>
</div>

        {/* CENTER — NAVIGATION (Perfectly Centered) */}
        <nav className="hidden md:flex flex-none justify-center space-x-10 text-neutral-300 font-medium">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          <Link href="/services" className="hover:text-brand transition-colors">Solutions</Link>
          <Link href="/shop" className="hover:text-brand transition-colors">Shop</Link>
          <Link href="/plan-mapper" className="hover:text-brand transition-colors">Plan Mapper</Link>
          <Link href="/support" className="hover:text-brand transition-colors">Support</Link>
          <Link href="/contact" className="hover:text-brand transition-colors">Contact</Link>
        </nav>

        {/* RIGHT — ACTIONS (Rightmost) */}
        <div className="flex-1 hidden md:flex justify-end items-center gap-6">
          <Link
            href="/cart"
            className="relative text-neutral-300 hover:text-white transition p-1"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-black">
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

        {/* MOBILE TOGGLE (Rightmost on Mobile) */}
        <div className="md:hidden flex items-center gap-5 z-50">
          <Link href="/cart" className="relative text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div 
        className={`fixed inset-0 z-40 bg-black backdrop-blur-xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-28 px-8 space-y-8">
          <nav className="flex flex-col space-y-6 text-left text-2xl text-neutral-300 font-semibold">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>Solutions</Link>
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link href="/plan-mapper" onClick={() => setIsMobileMenuOpen(false)}>Plan Mapper</Link>
            <Link href="/support" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          </nav>

          <div className="pt-8 border-t border-white/10">
            {user ? (
              <div onClick={() => setIsMobileMenuOpen(false)}><UserMenu /></div>
            ) : (
              <LoginButton
                label="Get Started"
                variant="outline"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/login");
                }}
                className="w-full py-4 text-lg"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}