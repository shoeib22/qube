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

  const accessories = getAccessoriesByModularSize(activeTab);

  const handleSelect = (id: string) => {
    setAccessory(id);
  };

  const selected = accessories.find(a => a.id === state.accessory);

  return (
    <ConfiguratorLayout
      currentStep="accessories"
      canProceed={!!state.accessory}
      onNext={() => router.push("/configurator/icons")}
    >
      <div className="flex h-[calc(100vh-220px)] min-h-[400px]">
        {/* Left — accessory list */}
        <div className="w-[380px] flex-shrink-0 border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            {MODULAR_TABS.map(tab => (
              <button
                key={tab.size}
                onClick={() => setActiveTab(tab.size)}
                className={`flex-1 py-3 text-xs font-bold transition-colors
                  ${activeTab === tab.size
                    ? "text-[#155cfc] border-b-2 border-[#155cfc]"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accessory cards */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              {accessories.map(acc => {
                const isSelected = state.accessory === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelect(acc.id)}
                    className={`p-3 rounded-xl border-2 bg-white text-left transition-all hover:shadow-sm
                      ${isSelected ? "border-[#155cfc] shadow-sm shadow-blue-100" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">{activeTab} Modular</p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{acc.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{acc.slots} slot{acc.slots !== 1 ? "s" : ""}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right — live preview */}
        <div className="flex-1 bg-[#111] flex items-center justify-center p-8">
          {state.accessory ? (
            <div className="text-center">
              <PanelPreview
                sizeId={state.size}
                materialColorId={state.materialColor ?? "mc-black"}
                frameColorId={state.frameColor}
                slots={state.slots}
                slotCount={selected?.slots}
                className="w-full max-w-[500px]"
              />
              <p className="text-gray-400 text-xs mt-4 font-medium">
                {selected?.name} — {selected?.slots} slot{selected?.slots !== 1 ? "s" : ""}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-xl mx-auto mb-3" />
              <p className="text-sm font-medium">Select an accessory to preview</p>
            </div>
          )}
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
