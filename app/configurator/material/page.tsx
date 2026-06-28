"use client";

import { useRouter } from "next/navigation";
import { useConfigurator } from "@/context/ConfiguratorContext";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";
import { MATERIALS } from "@/lib/configuratorData";

export default function MaterialPage() {
  const { state, setMaterial } = useConfigurator();
  const router = useRouter();

  const handleSelect = (id: string) => {
    setMaterial(id);
    setTimeout(() => router.push("/configurator/size"), 180);
  };

  return (
    <ConfiguratorLayout
      currentStep="material"
      canProceed={!!state.material}
      onNext={() => router.push("/configurator/size")}
    >
      <div className="p-6 bg-gray-50">
        <div className="flex flex-wrap gap-4">
          {MATERIALS.map(mat => {
            const isSelected = state.material === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => handleSelect(mat.id)}
                className={`w-[200px] p-5 rounded-xl border-2 bg-white text-left transition-all hover:shadow-md
                  ${isSelected ? "border-[#155cfc] shadow-md shadow-blue-100" : "border-gray-200 hover:border-gray-300"}`}
              >
                {/* Material visual */}
                <div className={`w-full h-16 rounded-lg mb-4 ${
                  mat.id === "glass"
                    ? "bg-gradient-to-br from-white via-blue-50 to-white border border-blue-100"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200"
                }`} />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Material {mat.number}</p>
                <p className="text-lg font-bold text-gray-900">{mat.label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
