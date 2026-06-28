"use client";

import { useRouter } from "next/navigation";
import { useConfigurator } from "@/context/ConfiguratorContext";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";
import PanelPreview from "@/components/configurator/PanelPreview";
import { TECHNOLOGIES, getAccessoryById } from "@/lib/configuratorData";

export default function TechnologyPage() {
  const { state, setTechnology } = useConfigurator();
  const router = useRouter();

  const accessory = state.accessory ? getAccessoryById(state.accessory) : null;

  const handleSelect = (id: string) => {
    setTechnology(id);
    setTimeout(() => router.push("/configurator/cart"), 180);
  };

  return (
    <ConfiguratorLayout
      currentStep="technology"
      canProceed={!!state.technology}
      onNext={() => router.push("/configurator/cart")}
    >
      <div className="flex flex-col h-[calc(100vh-220px)] min-h-[480px]">
        {/* Panel preview — full width */}
        <div className="flex-1 bg-[#111] flex items-center justify-center p-8">
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor ?? "mc-black"}
            frameColorId={state.frameColor}
            slots={state.slots}
            slotCount={accessory?.slots}
            className="w-full max-w-[500px]"
          />
        </div>

        {/* Technology cards at bottom */}
        <div className="border-t border-gray-200 bg-white p-5">
          <div className="flex gap-4 max-w-2xl mx-auto">
            {TECHNOLOGIES.map(tech => {
              const isSelected = state.technology === tech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => handleSelect(tech.id)}
                  className={`flex-1 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm
                    ${isSelected ? "border-[#155cfc] bg-blue-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Technology</p>
                  <p className="font-bold text-gray-900 text-sm">{tech.name}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tech.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
