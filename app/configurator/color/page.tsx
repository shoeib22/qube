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
  const [showPreview, setShowPreview] = useState(false);

  const accessory = state.accessory ? getAccessoryById(state.accessory) : null;
  const canProceed = !!state.materialColor && !!state.frameColor;

  return (
    <ConfiguratorLayout
      currentStep="color"
      canProceed={canProceed}
      onNext={() => router.push("/configurator/technology")}
    >
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-220px)]">

        {/* Left — color options */}
        <div className="w-full md:w-[360px] md:flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
          {/* Sub-tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveTab("material")}
              className={`flex-1 py-3 text-xs font-bold transition-colors
                ${activeTab === "material" ? "text-[#155cfc] border-b-2 border-[#155cfc]" : "text-gray-500"}`}
            >
              Material Color
              {state.materialColor && <span className="ml-1 text-green-500">✓</span>}
            </button>
            <button
              onClick={() => setActiveTab("frame")}
              className={`flex-1 py-3 text-xs font-bold transition-colors
                ${activeTab === "frame" ? "text-[#155cfc] border-b-2 border-[#155cfc]" : "text-gray-500"}`}
            >
              Frame Color
              {state.frameColor && <span className="ml-1 text-green-500">✓</span>}
            </button>
          </div>

          {/* Color swatches — scrollable on mobile with height cap */}
          <div className="overflow-y-auto p-4 bg-gray-50 max-h-[44vh] md:max-h-none md:flex-1">
            <div className="grid grid-cols-2 gap-3">
              {(activeTab === "material" ? MATERIAL_COLORS : FRAME_COLORS).map(color => {
                const isSelected = activeTab === "material"
                  ? state.materialColor === color.id
                  : state.frameColor === color.id;

                return (
                  <button
                    key={color.id}
                    onClick={() => activeTab === "material" ? setMaterialColor(color.id) : setFrameColor(color.id)}
                    className={`p-3 rounded-xl border-2 bg-white text-left transition-all active:scale-95
                      ${isSelected ? "border-[#155cfc] shadow-sm shadow-blue-100" : "border-gray-200"}`}
                  >
                    <div
                      className="w-full h-8 rounded-lg mb-2 border border-gray-100"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                      {activeTab === "material" ? "Material" : "Frame"}
                    </p>
                    <p className="text-sm font-bold text-gray-900">{color.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile: toggle preview */}
          <button
            onClick={() => setShowPreview(v => !v)}
            className="md:hidden py-2.5 text-xs font-bold text-[#155cfc] border-t border-gray-200 bg-white"
          >
            {showPreview ? "Hide Preview ▲" : "Show Panel Preview ▼"}
          </button>
        </div>

        {/* Right — live preview */}
        <div className={`flex-1 bg-[#111] items-center justify-center p-6
          ${showPreview ? "flex" : "hidden"} md:flex`}
        >
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
