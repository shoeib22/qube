"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackArrow() {
  const router = useRouter();

  return (
    <div className="fixed left-6 top-24 z-50">
      <button
        onClick={() => router.back()}
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-full
          bg-black/60 backdrop-blur
          border border-white/10
          text-gray-300
          hover:text-yellow-400
          hover:border-yellow-400/40
          hover:bg-black/80
          transition-all duration-200
          shadow-lg
        "
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>
    </div>
  );
}
