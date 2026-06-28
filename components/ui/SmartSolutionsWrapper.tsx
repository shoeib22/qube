"use client";

import dynamic from "next/dynamic";

// Dynamically import the 3D WebGPU component to bypass server-side rendering
const SmartSolutions = dynamic(
  () => import("./SmartSolutions"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen w-full bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent border-brand rounded-full animate-spin" />
          <p className="eyebrow">
            Initializing Engine...
          </p>
        </div>
      </div>
    )
  }
);

export default function SmartSolutionsWrapper() {
  return <SmartSolutions />;
}