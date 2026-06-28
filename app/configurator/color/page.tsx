"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "@/context/ConfiguratorContext";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";
import PanelPreview from "@/components/configurator/PanelPreview";
import { MATERIAL_COLORS, FRAME_COLORS, getAccessoryById } from "@/lib/configuratorData";

export default function ColorPage() {
  const { state, setMaterialColor, setFrameColor } = useConfigurator();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"material" | "frame">("material");

  const accessory = state.accessory ? getAccessoryById(state.accessory) : null;
  const canProceed = !!state.materialColor && !!state.frameColor;

  return (
    <ConfiguratorLayout
      currentStep="color"
      canProceed={canProceed}
      onNext={() => router.push("/configurator/technology")}
    >
      <div className="flex h-[calc(100vh-220px)] min-h-[400px]">
        {/* Left — color options */}
        <div className="w-[360px] flex-shrink-0 border-r border-gray-200 flex flex-col">
          {/* Sub-tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveTab("material")}
              className={`flex-1 py-3 text-xs font-bold transition-colors
                ${activeTab === "material" ? "text-[#155cfc] border-b-2 border-[#155cfc]" : "text-gray-500 hover:text-gray-700"}`}
            >
              Material Color
            </button>
            <button
              onClick={() => setActiveTab("frame")}
              className={`flex-1 py-3 text-xs font-bold transition-colors
                ${activeTab === "frame" ? "text-[#155cfc] border-b-2 border-[#155cfc]" : "text-gray-500 hover:text-gray-700"}`}
            >
              Frame Color
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              {(activeTab === "material" ? MATERIAL_COLORS : FRAME_COLORS).map(color => {
                const isSelected = activeTab === "material"
                  ? state.materialColor === color.id
                  : state.frameColor === color.id;

                return (
                  <button
                    key={color.id}
                    onClick={() => activeTab === "material" ? setMaterialColor(color.id) : setFrameColor(color.id)}
                    className={`p-3 rounded-xl border-2 bg-white text-left transition-all hover:shadow-sm
                      ${isSelected ? "border-[#155cfc] shadow-sm shadow-blue-100" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div
                      className="w-full h-8 rounded-lg mb-2 border border-gray-100"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                      {activeTab === "material" ? "Material Color" : "Frame Color"}
                    </p>
                    <p className="text-sm font-bold text-gray-900">{color.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right — live preview */}
        <div className="flex-1 bg-[#111] flex items-center justify-center p-8">
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor}
            frameColorId={state.frameColor}
            slots={state.slots}
            slotCount={accessory?.slots}
            className="w-full max-w-[500px]"
          />
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
