"use client";

import { useRouter } from "next/navigation";
import { useConfigurator } from "@/context/ConfiguratorContext";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";
import { SIZES } from "@/lib/configuratorData";

export default function SizePage() {
  const { state, setSize } = useConfigurator();
  const router = useRouter();

  const handleSelect = (id: string) => {
    setSize(id);
    setTimeout(() => router.push("/configurator/accessories"), 180);
  };

  return (
    <ConfiguratorLayout
      currentStep="size"
      canProceed={!!state.size}
      onNext={() => router.push("/configurator/accessories")}
    >
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-3xl">
          {SIZES.map((size, i) => {
            const isSelected = state.size === size.id;
            return (
              <button
                key={size.id}
                onClick={() => handleSelect(size.id)}
                className={`p-4 rounded-xl border-2 bg-white text-left transition-all hover:shadow-md
                  ${isSelected ? "border-[#155cfc] shadow-md shadow-blue-100" : "border-gray-200 hover:border-gray-300"}`}
              >
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Size {i + 1}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base font-bold text-gray-900">{size.label}</span>
                  <GridIcon cols={size.cols} rows={size.rows} selected={isSelected} />
                </div>
                <ModuleGrid cols={size.cols} rows={size.rows} selected={isSelected} />
              </button>
            );
          })}
        </div>
      </div>
    </ConfiguratorLayout>
  );
}

function GridIcon({ cols, rows, selected }: { cols: number; rows: number; selected: boolean }) {
  const cell = 7;
  const gap = 2;
  const w = cols * cell + (cols - 1) * gap;
  const h = rows * cell + (rows - 1) * gap;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * (cell + gap)} y={r * (cell + gap)} width={cell} height={cell} rx={1}
            fill="none" stroke={selected ? "#155cfc" : "#9ca3af"} strokeWidth={1} />
        ))
      )}
    </svg>
  );
}

function ModuleGrid({ cols, rows, selected }: { cols: number; rows: number; selected: boolean }) {
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${Math.min(cols, 4)}, 1fr)` }}>
      {Array.from({ length: Math.min(cols * rows, 12) }, (_, i) => (
        <div key={i} className={`h-2.5 rounded-sm border ${selected ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`} />
      ))}
    </div>
  );
}
