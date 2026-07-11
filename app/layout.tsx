import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
// 1. Import the Google Analytics component
import { GoogleAnalytics } from '@next/third-parties/google';
import AskWidget from "../components/ai/AskWidget";

export const metadata: Metadata = {
  title: "Xerovolt Tech",
  description: "Smart automation built around your lifestyle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Added data-scroll-behavior="smooth" right here
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans text-white bg-black min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>

        <AskWidget />

        {/* 2. Add the component here using your Measurement ID */}
        <GoogleAnalytics gaId="G-CT3T4W3CF5" />
      </body>
    </html>
  );
}