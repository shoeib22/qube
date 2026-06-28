"use client";

import { useRouter } from "next/navigation";
import { STEPS, getMaterialById, getSizeById, getAccessoryById, getMaterialColorById, getTechnologyById } from "@/lib/configuratorData";
import { useConfigurator } from "@/context/ConfiguratorContext";
import type { ConfiguratorState } from "@/types/configurator";

function getSelectionLabel(stepId: string, state: ConfiguratorState): string | null {
  switch (stepId) {
    case "panel":       return "Edge";
    case "material":    return state.material ? getMaterialById(state.material)?.label ?? null : null;
    case "size":        return state.size ? getSizeById(state.size)?.label ?? null : null;
    case "accessories": return state.accessory ? getAccessoryById(state.accessory)?.name ?? null : null;
    case "icons":       return state.slots.length > 0 ? `${state.slots.length} icon${state.slots.length !== 1 ? "s" : ""}` : null;
    case "color":       return state.materialColor ? getMaterialColorById(state.materialColor)?.name ?? null : null;
    case "technology":  return state.technology ? getTechnologyById(state.technology)?.name ?? null : null;
    default:            return null;
  }
}

interface StepProgressProps {
  currentStep: string;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  const router = useRouter();
  const { state } = useConfigurator();
  const currentIndex = STEPS.find(s => s.id === currentStep)?.index ?? 1;

  return (
    <div className="flex items-center justify-center">
      {STEPS.map((step, i) => {
        const isCompleted = step.index < currentIndex;
        const isCurrent   = step.id === currentStep;
        const selLabel    = getSelectionLabel(step.id, state);

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              {/* Selection label above dot */}
              <span className="text-[9px] font-bold text-gray-400 mb-0.5 h-3 leading-none truncate max-w-[64px] text-center">
                {selLabel ?? ""}
              </span>

              {/* Dot */}
              <button
                onClick={() => isCompleted && router.push(step.path)}
                disabled={!isCompleted}
                title={step.label}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all
                  ${isCompleted
                    ? "bg-[#f2994a] text-black cursor-pointer hover:scale-110"
                    : isCurrent
                    ? "bg-[#f2994a] text-black ring-2 ring-[#f2994a]/40"
                    : "bg-[#1a1a1a] text-gray-600 border border-white/10 cursor-default"
                  }`}
              >
                {isCompleted
                  ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></svg>
                  : step.index
                }
              </button>

              {/* Step label below dot */}
              <span className={`text-[9px] mt-1 font-bold uppercase tracking-wider ${isCurrent ? "text-[#f2994a]" : "text-gray-600"}`}>
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-[2px] mb-5 mx-0.5 transition-colors ${step.index < currentIndex ? "bg-[#f2994a]" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
