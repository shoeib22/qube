"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Check, Loader2 } from "lucide-react";

// Updated to include imageUrl for production Signed URL support
interface ProductProps {
  id: string | number;
  name: string;
  price: number;
  image: string;    // Raw database path
  imageUrl?: string; // Signed production URL
  category?: string;
}

export default function AddToCartButton({ product }: { product: ProductProps }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    setIsLoading(true);

    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Ensure the product object passed to addToCart includes the imageUrl
    addToCart({ ...product, quantity: 1 });

    setIsLoading(false);

    // Show visual feedback
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg active:scale-95 disabled:cursor-not-allowed w-full
        ${isAdded
          ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20"
          : isLoading
            ? "bg-gray-600 text-gray-300"
            : "bg-white text-black hover:bg-gray-200 hover:shadow-white/10"
        }
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Adding...</span>
        </>
      ) : isAdded ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          <span>Add to Bag</span>
        </>
      )}
    </button>
  );
}