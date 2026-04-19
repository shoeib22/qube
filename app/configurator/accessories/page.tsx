"use client";
// app/configurator/accessories/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../../context/ConfiguratorContext";
import ConfiguratorLayout from "../../../components/configurator/ConfiguratorLayout";
import PanelPreview from "../../../components/configurator/PanelPreview";
import { ACCESSORIES_2M, ACCESSORIES_4M } from "../../../lib/configuratorData";
import type { AccessoryOption } from "types/configurator";

export default function AccessoriesPage() {
  const { state, setAccessory } = useConfigurator();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"2" | "4">("2");
  const [hovered, setHovered] = useState<string | null>(null);

  const accessories = activeTab === "2" ? ACCESSORIES_2M : ACCESSORIES_4M;

  const handleSelect = (acc: AccessoryOption) => {
    setAccessory(acc.id);
  };

  return (
    <ConfiguratorLayout
      currentStep="accessories"
      canNext={!!state.accessory}
      onNext={() => router.push("/configurator/icons")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 24, background: "#D4AF37", borderRadius: 2 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Accessories</h2>
      </div>

      {/* Modular tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e8e8e8", marginBottom: 20, width: "fit-content" }}>
        {(["2", "4"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${activeTab === tab ? "#D4AF37" : "transparent"}`,
              marginBottom: -2,
              fontSize: 13,
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? "#D4AF37" : "#888",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {tab} Modular
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Accessory list */}
        <div style={{
          width: 420,
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e8e8e8",
          overflow: "hidden",
          flexShrink: 0,
          maxHeight: 480,
          overflowY: "auto",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
          }}>
            {accessories.map((acc, idx) => {
              const isSelected = state.accessory === acc.id;
              const isHov = hovered === acc.id;
              const isEvenRow = Math.floor(idx / 2) % 2 === 0;

              return (
                <button
                  key={acc.id}
                  onClick={() => handleSelect(acc)}
                  onMouseEnter={() => setHovered(acc.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: "14px 16px",
                    background: isSelected ? "#fffbeb" : isHov ? "#fafafa" : "#fff",
                    border: "none",
                    borderBottom: "1px solid #f0f0f0",
                    borderRight: idx % 2 === 0 ? "1px solid #f0f0f0" : "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s",
                    outline: isSelected ? "2px solid #D4AF37" : "none",
                    outlineOffset: -2,
                  }}
                >
                  <div style={{ fontSize: 9, color: "#bbb", fontWeight: 500, letterSpacing: "0.05em", marginBottom: 3 }}>
                    {acc.modularSize} Modular
                  </div>
                  <div style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#D4AF37" : "#1a1a1a" }}>
                    {acc.name}
                  </div>
                  {acc.priceModifier > 0 && (
                    <div style={{ fontSize: 10, color: "#D4AF37", marginTop: 2 }}>
                      + ₹{acc.priceModifier}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live panel preview */}
        <div style={{ flex: 1 }}>
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor}
            slots={state.slots}
            width={520}
            height={340}
            clickable={false}
          />
          {state.accessory && (
            <div style={{
              marginTop: 10,
              padding: "8px 14px",
              background: "#fffbeb",
              border: "1px solid #e0c860",
              borderRadius: 6,
              fontSize: 11,
              color: "#a07820",
              fontWeight: 500,
            }}>
              Selected: <strong>{accessories.find(a => a.id === state.accessory)?.name}</strong>
              {" "}— {accessories.find(a => a.id === state.accessory)?.slots} switch slots
            </div>
          )}
        </div>
      </div>
    </ConfiguratorLayout>
  );
}