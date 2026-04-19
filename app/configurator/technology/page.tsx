"use client";
// app/configurator/technology/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../../context/ConfiguratorContext";
import ConfiguratorLayout from "../../../components/configurator/ConfiguratorLayout";
import PanelPreview from "../../../components/configurator/PanelPreview";
import { TECHNOLOGIES } from "../../../lib/configuratorData";

const TECH_ICONS: Record<string, string> = {
  remote: `<path d="M12 2a4 4 0 0 1 4 4v12a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><circle cx="12" cy="7" r="1" fill="currentColor"/><line x1="10" y1="11" x2="14" y2="11"/><line x1="10" y1="14" x2="14" y2="14"/>`,
  tuya:   `<path d="M1.05 4.5h21.9M1.05 12h21.9M1.05 19.5h21.9"/><circle cx="12" cy="4.5" r="2.5"/><circle cx="7" cy="12" r="2.5"/><circle cx="17" cy="19.5" r="2.5"/>`,
  zigbee: `<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>`,
};

export default function TechnologyPage() {
  const { state, setTechnology } = useConfigurator();
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setTechnology(id);
  };

  return (
    <ConfiguratorLayout
      currentStep="technology"
      canNext={!!state.technology}
      onNext={() => router.push("/configurator/cart")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <div style={{ width: 4, height: 24, background: "#D4AF37", borderRadius: 2 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Select Technology</h2>
      </div>

      <div style={{ display: "flex", gap: 28 }}>
        {/* Panel preview - large center */}
        <div style={{ flex: 1 }}>
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor}
            slots={state.slots}
            width={560}
            height={340}
          />

          {/* Technology cards below preview */}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {TECHNOLOGIES.map(tech => {
              const isSelected = state.technology === tech.id;
              const isHov = hovered === tech.id;

              return (
                <button
                  key={tech.id}
                  onClick={() => handleSelect(tech.id)}
                  onMouseEnter={() => setHovered(tech.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    background: isSelected ? "#fffbeb" : "#fff",
                    border: `2px solid ${isSelected ? "#D4AF37" : isHov ? "#e0c860" : "#e8e8e8"}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                    boxShadow: isSelected
                      ? "0 0 0 3px rgba(212,175,55,0.18)"
                      : isHov ? "0 4px 12px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.05)",
                    transform: isSelected || isHov ? "translateY(-2px)" : "none",
                  }}
                >
                  {/* Icon */}
                  <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: isSelected ? "#D4AF37" : "#f0f0f0",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke={isSelected ? "#0a0a0a" : "#888"} strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        dangerouslySetInnerHTML={{ __html: TECH_ICONS[tech.id] || "" }}
                      />
                    </div>
                    {isSelected && (
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", background: "#D4AF37",
                        display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto",
                      }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: 9, color: "#bbb", fontWeight: 500, letterSpacing: "0.05em", marginBottom: 4 }}>
                    Technology
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? "#a07820" : "#1a1a1a", marginBottom: 4 }}>
                    {tech.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#aaa", lineHeight: 1.4, marginBottom: 8 }}>
                    {tech.description}
                  </div>
                  {tech.priceModifier > 0 && (
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#D4AF37" }}>
                      + ₹{tech.priceModifier.toLocaleString("en-IN")}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ConfiguratorLayout>
  );
}