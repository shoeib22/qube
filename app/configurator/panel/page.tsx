"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";

export default function PanelPage() {
  const router = useRouter();

  // Edge is always pre-selected; auto-advance on mount
  useEffect(() => {
    const timer = setTimeout(() => router.push("/configurator/material"), 600);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ConfiguratorLayout currentStep="panel" canProceed={true} onNext={() => router.push("/configurator/material")}>
      <div className="p-6 bg-gray-50 min-h-[300px]">
        <div className="flex flex-wrap gap-4">
          {/* Single Edge card — pre-selected */}
          <div className="border-2 border-[#155cfc] rounded-xl p-6 bg-white w-[200px] cursor-default shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Panel</p>
            <p className="text-xl font-bold text-gray-900">Edge</p>
            <p className="text-xs text-gray-500 mt-1">Precision edge series panel</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Advancing to Material selection…</p>
      </div>
    </ConfiguratorLayout>
  );
}
