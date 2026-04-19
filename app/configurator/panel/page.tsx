"use client";
// app/configurator/panel/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../../context/ConfiguratorContext";
import ConfiguratorLayout from "../../../components/configurator/ConfiguratorLayout";
import { PANELS } from "../../../lib/configuratorData";
import Header from "@/components/Header";

export default function PanelPage() {
  const { state, setPanel } = useConfigurator();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setPanel(id);
    // Auto-navigate to next step
    setTimeout(() => router.push("/configurator/material"), 180);
  };

  return (
    <ConfiguratorLayout
      currentStep="panel"
      canNext={!!state.panel}
      onNext={() => router.push("/configurator/material")}
    >
      {/* Step header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div style={{ width: 4, height: 24, background: "#D4AF37", borderRadius: 2 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.01em" }}>
          Select Panel
        </h2>
      </div>

      {/* Panel cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 16,
        maxWidth: 900,
      }}>
        {PANELS.map(panel => {
          const isSelected = state.panel === panel.id;
          const isHov = hovered === panel.id;

          return (
            <button
              key={panel.id}
              onClick={() => handleSelect(panel.id)}
              onMouseEnter={() => setHovered(panel.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                background: "#fff",
                border: `2px solid ${isSelected ? "#D4AF37" : isHov ? "#e0c860" : "#e8e8e8"}`,
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(212,175,55,0.18), 0 4px 16px rgba(0,0,0,0.08)"
                  : isHov
                  ? "0 4px 16px rgba(0,0,0,0.1)"
                  : "0 1px 4px rgba(0,0,0,0.06)",
                transform: isHov || isSelected ? "translateY(-2px)" : "none",
              }}
            >
              {/* Preview area */}
              <div style={{
                height: 120,
                background: panel.imageBg || "#1a1a1a",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <PanelMiniSVG />
                {isSelected && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    width: 22, height: 22, borderRadius: "50%",
                    background: "#D4AF37",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ fontSize: 10, color: "#aaa", fontWeight: 500, marginBottom: 4, letterSpacing: "0.05em" }}>
                  PANEL
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>
                  {panel.name}
                </div>
                <div style={{ fontSize: 11, color: "#888", lineHeight: 1.4 }}>
                  {panel.tagline}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#D4AF37", marginTop: 10 }}>
                  from ₹ {panel.basePrice.toLocaleString("en-IN")}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ConfiguratorLayout>
  );
}

function PanelMiniSVG() {
  return (
    <svg width="100" height="72" viewBox="0 0 100 72">
      <rect x="2" y="2" width="96" height="68" rx="5" fill="none" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" />
      {[12, 36, 60, 84].map((x, i) => (
        <React.Fragment key={i}>
          <rect x={x} y="16" width="16" height="16" rx="2" fill="none" stroke="rgba(100,160,255,0.5)" strokeWidth="1" />
          <rect x={x} y="40" width="16" height="16" rx="2" fill="none" stroke="rgba(100,160,255,0.5)" strokeWidth="1" />
        </React.Fragment>
      ))}
    </svg>
  );
}