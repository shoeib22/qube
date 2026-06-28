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
      <div className="flex flex-col min-h-0">
        {/* Panel preview — shorter on mobile */}
        <div className="bg-[#111] flex items-center justify-center p-6 md:p-8 min-h-[200px] md:min-h-[320px]">
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor ?? "mc-black"}
            frameColorId={state.frameColor}
            slots={state.slots}
            slotCount={accessory?.slots}
            className="w-full max-w-[420px]"
          />
        </div>

        {/* Technology cards — stack on mobile */}
        <div className="border-t border-gray-200 bg-white p-4 md:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {TECHNOLOGIES.map(tech => {
              const isSelected = state.technology === tech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => handleSelect(tech.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all active:scale-95
                    ${isSelected ? "border-[#155cfc] bg-blue-50" : "border-gray-200 bg-white"}`}
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
