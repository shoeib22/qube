"use client";
// app/configurator/material/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../../context/ConfiguratorContext";
import ConfiguratorLayout from "../../../components/configurator/ConfiguratorLayout";
import { MATERIALS } from "../../../lib/configuratorData";

export default function MaterialPage() {
  const { state, setMaterial } = useConfigurator();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setMaterial(id);
    setTimeout(() => router.push("/configurator/size"), 180);
  };

  return (
    <ConfiguratorLayout
      currentStep="material"
      canNext={!!state.material}
      onNext={() => router.push("/configurator/size")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{ width: 4, height: 24, background: "#D4AF37", borderRadius: 2 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Material</h2>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {MATERIALS.map(mat => {
          const isSelected = state.material === mat.id;
          const isHov = hovered === mat.id;

          return (
            <button
              key={mat.id}
              onClick={() => handleSelect(mat.id)}
              onMouseEnter={() => setHovered(mat.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 180,
                padding: "18px 20px",
                background: "#fff",
                border: `2px solid ${isSelected ? "#D4AF37" : isHov ? "#ccc" : "#e8e8e8"}`,
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "left",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(212,175,55,0.18)"
                  : isHov ? "0 4px 12px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.15s",
                transform: isHov || isSelected ? "translateY(-2px)" : "none",
              }}
            >
              {/* Material visual */}
              <div style={{
                width: "100%",
                height: 72,
                borderRadius: 6,
                marginBottom: 14,
                background: mat.id === "glass"
                  ? "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(200,230,255,0.7) 50%, rgba(255,255,255,0.5) 100%)"
                  : "linear-gradient(135deg, #f0f0f0 0%, #ddd 50%, #e8e8e8 100%)",
                border: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 22, opacity: 0.5 }}>
                  {mat.id === "glass" ? "◻" : "⬜"}
                </span>
              </div>

              <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, letterSpacing: "0.05em", marginBottom: 4 }}>
                Material {mat.number}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
                {mat.label}
              </div>
              {mat.priceModifier !== 0 && (
                <div style={{ fontSize: 11, color: mat.priceModifier < 0 ? "#22c55e" : "#D4AF37", marginTop: 6, fontWeight: 600 }}>
                  {mat.priceModifier < 0 ? `− ₹${Math.abs(mat.priceModifier)}` : `+ ₹${mat.priceModifier}`}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </ConfiguratorLayout>
  );
}