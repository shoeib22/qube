"use client";

import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { ShoppingBag, Check, Loader2 } from "lucide-react";

// Define what props this button expects
interface ProductProps {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

export default function AddToCartButton({ product }: { product: ProductProps }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if button is inside a Link
    e.stopPropagation(); // Stop event bubbling

    setIsLoading(true);

    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Add item with initial quantity of 1
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
        flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg active:scale-95 disabled:cursor-not-allowed
        ${isAdded
          ? "bg-green-500 text-white hover:bg-green-600 animate-pulse"
          : isLoading
            ? "bg-gray-600 text-gray-300"
            : "bg-white text-black hover:bg-gray-200 hover:shadow-xl"
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
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
