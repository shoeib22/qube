"use client";
// app/configurator/size/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../../context/ConfiguratorContext";
import ConfiguratorLayout from "../../../components/configurator/ConfiguratorLayout";
import { SIZES } from "../../../lib/configuratorData";

export default function SizePage() {
  const { state, setSize } = useConfigurator();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSize(id);
    setTimeout(() => router.push("/configurator/accessories"), 180);
  };

  return (
    <ConfiguratorLayout
      currentStep="size"
      canNext={!!state.size}
      onNext={() => router.push("/configurator/accessories")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{ width: 4, height: 24, background: "#D4AF37", borderRadius: 2 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Size</h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {SIZES.map(size => {
          const isSelected = state.size === size.id;
          const isHov = hovered === size.id;

          return (
            <button
              key={size.id}
              onClick={() => handleSelect(size.id)}
              onMouseEnter={() => setHovered(size.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 174,
                padding: "16px 18px 18px",
                background: "#fff",
                border: `2px solid ${isSelected ? "#D4AF37" : isHov ? "#ccc" : "#e8e8e8"}`,
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(212,175,55,0.18)"
                  : isHov ? "0 4px 12px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.05)",
                transform: isHov || isSelected ? "translateY(-2px)" : "none",
              }}
            >
              <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, letterSpacing: "0.05em", marginBottom: 8 }}>
                Size {size.sizeNum}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}>
                  {size.label}
                </span>
                <SizePreviewIcon cols={size.cols} rows={size.rows} />
              </div>

              {/* Module grid preview */}
              <ModuleGrid cols={size.cols} rows={size.rows} selected={isSelected} />

              {size.priceModifier > 0 && (
                <div style={{ fontSize: 11, color: "#D4AF37", marginTop: 10, fontWeight: 600 }}>
                  + ₹{size.priceModifier.toLocaleString("en-IN")}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </ConfiguratorLayout>
  );
}

function SizePreviewIcon({ cols, rows }: { cols: number; rows: number }) {
  const w = Math.min(cols * 8 + (cols - 1) * 2, 48);
  const h = rows * 8 + (rows - 1) * 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink: 0 }}>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * 10} y={r * 10}
            width={8} height={8}
            rx={1}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={1}
          />
        ))
      )}
    </svg>
  );
}

function ModuleGrid({ cols, rows, selected }: { cols: number; rows: number; selected: boolean }) {
  const cellW = Math.min(120 / cols - 2, 32);
  const cellH = 18;
  const gap = 2;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
      gap: `${gap}px`,
    }}>
      {Array.from({ length: cols * rows }, (_, i) => (
        <div
          key={i}
          style={{
            height: cellH,
            border: `1px solid ${selected ? "rgba(212,175,55,0.5)" : "rgba(100,160,255,0.3)"}`,
            borderRadius: 2,
            background: selected ? "rgba(212,175,55,0.05)" : "rgba(100,160,255,0.04)",
          }}
        />
      ))}
    </div>
  );
}