"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "@/context/ConfiguratorContext";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";
import PanelPreview from "@/components/configurator/PanelPreview";
import { getAccessoriesByModularSize } from "@/lib/configuratorData";
import type { ModularSize } from "@/types/configurator";

const MODULAR_TABS: { size: ModularSize; label: string }[] = [
  { size: 2, label: "2 Modular" },
  { size: 4, label: "4 Modular" },
  { size: 6, label: "6 Modular" },
];

export default function AccessoriesPage() {
  const { state, setAccessory } = useConfigurator();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ModularSize>(2);
  const [showPreview, setShowPreview] = useState(false);

  const accessories = getAccessoriesByModularSize(activeTab);
  const selected = accessories.find(a => a.id === state.accessory);

  return (
    <ConfiguratorLayout
      currentStep="accessories"
      canProceed={!!state.accessory}
      onNext={() => router.push("/configurator/icons")}
    >
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-220px)]">

        {/* Left — accessory list */}
        <div className="w-full md:w-[360px] md:flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            {MODULAR_TABS.map(tab => (
              <button
                key={tab.size}
                onClick={() => setActiveTab(tab.size)}
                className={`flex-1 py-3 text-xs font-bold transition-colors
                  ${activeTab === tab.size
                    ? "text-[#155cfc] border-b-2 border-[#155cfc]"
                    : "text-gray-500"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accessory cards — capped height on mobile so it doesn't take full screen */}
          <div className="overflow-y-auto p-3 bg-gray-50 max-h-[45vh] md:max-h-none md:flex-1">
            <div className="grid grid-cols-2 gap-2">
              {accessories.map(acc => {
                const isSelected = state.accessory === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setAccessory(acc.id)}
                    className={`p-3 rounded-xl border-2 bg-white text-left transition-all active:scale-95
                      ${isSelected ? "border-[#155cfc] shadow-sm shadow-blue-100" : "border-gray-200"}`}
                  >
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">{activeTab} Modular</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{acc.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{acc.slots} slot{acc.slots !== 1 ? "s" : ""}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile-only: toggle preview */}
          {state.accessory && (
            <button
              onClick={() => setShowPreview(v => !v)}
              className="md:hidden py-2.5 text-xs font-bold text-[#155cfc] border-t border-gray-200 bg-white"
            >
              {showPreview ? "Hide Preview ▲" : "Show Panel Preview ▼"}
            </button>
          )}
        </div>

        {/* Right — live preview */}
        <div className={`flex-1 bg-[#111] items-center justify-center p-6
          ${state.accessory && showPreview ? "flex" : "hidden"} md:flex`}
        >
          {state.accessory ? (
            <div className="text-center w-full">
              <PanelPreview
                sizeId={state.size}
                materialColorId={state.materialColor ?? "mc-black"}
                frameColorId={state.frameColor}
                slots={state.slots}
                slotCount={selected?.slots}
                className="w-full max-w-[400px] mx-auto"
              />
              <p className="text-gray-400 text-xs mt-3">{selected?.name} — {selected?.slots} slots</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded-xl mx-auto mb-2" />
              <p className="text-sm">Select an accessory to preview</p>
            </div>
          )}
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
