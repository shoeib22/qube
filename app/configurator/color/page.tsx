"use client";
// app/configurator/color/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../../context/ConfiguratorContext";
import ConfiguratorLayout from "../../../components/configurator/ConfiguratorLayout";
import PanelPreview from "../../../components/configurator/PanelPreview";
import { MATERIAL_COLORS, FRAME_COLORS } from "lib/configuratorData";
import type { ColorOption } from "lib/configuratorData";

export default function ColorPage() {
  const { state, setMaterialColor, setFrameColor } = useConfigurator();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"material" | "frame">("material");

  const colors = activeTab === "material" ? MATERIAL_COLORS : FRAME_COLORS;
  const selectedId = activeTab === "material" ? state.materialColor : state.frameColor;

  const handleSelect = (color: ColorOption) => {
    if (activeTab === "material") setMaterialColor(color.id);
    else setFrameColor(color.id);
  };

  return (
    <ConfiguratorLayout
      currentStep="color"
      canNext={!!state.materialColor}
      onNext={() => router.push("/configurator/technology")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 24, background: "#D4AF37", borderRadius: 2 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Color</h2>
      </div>

      <div style={{ display: "flex", gap: 28 }}>
        {/* Left: color pickers */}
        <div style={{ width: 420, flexShrink: 0 }}>
          {/* Tabs */}
          <div style={{
            display: "flex", borderBottom: "2px solid #e8e8e8", marginBottom: 20, width: "fit-content"
          }}>
            {(["material", "frame"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 18px",
                  background: "none", border: "none",
                  borderBottom: `2px solid ${activeTab === tab ? "#D4AF37" : "transparent"}`,
                  marginBottom: -2,
                  fontSize: 13,
                  fontWeight: activeTab === tab ? 700 : 500,
                  color: activeTab === tab ? "#D4AF37" : "#888",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textTransform: "capitalize",
                }}
              >
                {tab === "material" ? "Material Color" : "Frame Color"}
              </button>
            ))}
          </div>

          {/* Color swatches grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}>
            {colors.map(color => {
              const isSelected = selectedId === color.id;
              const isDark = isHexDark(color.hex);

              return (
                <button
                  key={color.id}
                  onClick={() => handleSelect(color)}
                  style={{
                    height: 64,
                    background: color.hex,
                    borderRadius: 8,
                    border: `2px solid ${isSelected ? "#D4AF37" : "transparent"}`,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "8px 12px",
                    position: "relative",
                    transition: "all 0.15s",
                    boxShadow: isSelected
                      ? "0 0 0 3px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.15)"
                      : "0 2px 6px rgba(0,0,0,0.1)",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <div style={{ fontSize: 9, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)", fontWeight: 500, letterSpacing: "0.05em" }}>
                    {activeTab === "material" ? "Material Color" : "Frame Color"}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? "#fff" : "#1a1a1a" }}>
                    {color.name}
                  </div>
                  {isSelected && (
                    <div style={{
                      position: "absolute", top: 8, right: 8,
                      width: 18, height: 18, borderRadius: "50%",
                      background: "#D4AF37",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Live preview */}
        <div style={{ flex: 1 }}>
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor}
            slots={state.slots}
            width={520}
            height={340}
          />
          {state.materialColor && (
            <div style={{
              marginTop: 10, fontSize: 11, color: "#888",
              display: "flex", alignItems: "center", gap: 6
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: MATERIAL_COLORS.find(c => c.id === state.materialColor)?.hex || "#ccc",
                border: "1px solid rgba(0,0,0,0.1)",
              }} />
              Material: {MATERIAL_COLORS.find(c => c.id === state.materialColor)?.name}
              {state.frameColor && (
                <>
                  {" · "}
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: FRAME_COLORS.find(c => c.id === state.frameColor)?.hex || "#ccc",
                    border: "1px solid rgba(0,0,0,0.1)",
                  }} />
                  Frame: {FRAME_COLORS.find(c => c.id === state.frameColor)?.name}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </ConfiguratorLayout>
  );
}

function isHexDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
}