import "./globals.css";
import type { Metadata } from "next";
// 1. IMPORT THE PROVIDER
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "qubeTech",
  description: "Smart automation built around your lifestyle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 2. ADD suppressHydrationWarning HERE TOO IF NEEDED */}
      <body className="font-sans text-white bg-black min-h-screen" suppressHydrationWarning>

        {/* 3. WRAP EVERYTHING INSIDE THE BODY WITH CARTPROVIDER */}
        {/* 3. WRAP EVERYTHING INSIDE THE BODY WITH PROVIDERS */}
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>

      </body>
    </html>
  );
}