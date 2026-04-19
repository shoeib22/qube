"use client";
// components/configurator/ConfiguratorLayout.tsx

import React, { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../context/ConfiguratorContext";
import StepProgress from "./StepProgress";
import { STEPS, calculatePrice, getPanelById, getSizeById, getAccessoryById, getTechById, getMaterialColorById } from "../../lib/configuratorData";
import type { StepId } from "../../types/configurator";

interface ConfiguratorLayoutProps {
  currentStep: StepId;
  children: ReactNode;
  canNext?: boolean;
  nextLabel?: string;
  onNext?: () => void;
  showBottomBar?: boolean;
}

export default function ConfiguratorLayout({
  currentStep,
  children,
  canNext = false,
  nextLabel = "Next",
  onNext,
  showBottomBar = true,
}: ConfiguratorLayoutProps) {
  const router = useRouter();
  const { state, clearAll } = useConfigurator();
  const [autoNext, setAutoNext] = useState(true);
  const [aiMode] = useState(false);

  const currentIndex = STEPS.findIndex(s => s.id === currentStep);
  const prevStep = currentIndex > 0 ? STEPS[currentIndex - 1] : null;

  const price = calculatePrice(state);

  // Build completed choices map for the stepper
  const completedChoices: Record<string, string> = {};
  if (state.panel) completedChoices.panel = getPanelById(state.panel)?.name ?? state.panel;
  if (state.material) completedChoices.material = state.material.charAt(0).toUpperCase() + state.material.slice(1);
  if (state.size) completedChoices.size = getSizeById(state.size)?.label ?? state.size;
  if (state.accessory) completedChoices.accessories = getAccessoryById(state.accessory)?.name ?? state.accessory;
  if (state.slots.length > 0) completedChoices.icons = `${state.slots.filter(s => s.iconId).length} icons`;
  if (state.materialColor) completedChoices.color = getMaterialColorById(state.materialColor)?.name ?? state.materialColor;
  if (state.technology) completedChoices.technology = getTechById(state.technology)?.name ?? state.technology;

  const handleBack = () => {
    if (prevStep) router.push(prevStep.path);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      const nextStep = STEPS[currentIndex + 1];
      if (nextStep) router.push(nextStep.path);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f7f7f7",
      fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .step-content { animation: fadeIn 0.25s ease; }
      `}</style>

      {/* ── Announcement banner ─────────────────────────────────────────── */}
      <AnnouncementBanner />

      {/* ── Top Toolbar ────────────────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e8e8e8",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        {/* Auto-select + AI mode toggles */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Toggle
            label="Auto-select Next"
            checked={autoNext}
            onChange={setAutoNext}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>Auto (AI) Mode</span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
              background: "#e8f0fe", color: "#4a6cf7", borderRadius: 4,
              padding: "2px 6px",
            }}>COMING SOON</span>
          </div>
        </div>

        {/* Step progress */}
        <StepProgress currentStep={currentStep} completedChoices={completedChoices} />
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: "28px 32px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div className="step-content" key={currentStep}>
          {children}
        </div>
      </div>

      {/* ── Bottom action bar ───────────────────────────────────────────── */}
      {showBottomBar && (
        <div style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          borderTop: "1px solid #e8e8e8",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          zIndex: 100,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
        }}>
          {/* Price */}
          <div style={{ fontSize: 20, fontWeight: 800, color: "#D4AF37", letterSpacing: "-0.02em" }}>
            ₹ {price.total.toLocaleString("en-IN")}
          </div>

          <div style={{ flex: 1 }} />

          {/* Clear */}
          <button
            onClick={clearAll}
            style={ghostBtnStyle}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
            Clear Selection
          </button>

          {/* Back */}
          {prevStep && (
            <button onClick={handleBack} style={backBtnStyle}>Back</button>
          )}

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={!canNext}
            style={{
              ...nextBtnStyle,
              opacity: canNext ? 1 : 0.4,
              cursor: canNext ? "pointer" : "not-allowed",
            }}
          >
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div style={{
      background: "#eef2ff",
      borderBottom: "1px solid #d0d9f7",
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}>
      <div style={{
        width: 32, height: 32, background: "#d0d9f7", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a6cf7" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#4a6cf7", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          LATEST UPDATE
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
          HV &amp; Two-way Updated
        </div>
        <div style={{ fontSize: 11, color: "#888" }}>
          Icons updated to indicate HV &amp; Two-Way for every series
        </div>
      </div>
      <button style={{
        marginLeft: "auto", background: "#4a6cf7", color: "#fff",
        border: "none", borderRadius: 6, padding: "6px 14px",
        fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0,
      }}>
        VIEW DETAILS
      </button>
      <button
        onClick={() => setVisible(false)}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 18, lineHeight: 1, padding: 0 }}
      >×</button>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 11,
          background: checked ? "#22c55e" : "#d1d5db",
          position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 3,
          left: checked ? 20 : 3,
          width: 16, height: 16, borderRadius: "50%",
          background: "#fff", transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </div>
      <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ── Button styles ─────────────────────────────────────────────────────────────
const ghostBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "8px 16px", background: "transparent",
  border: "1px solid #ff4444", borderRadius: 6,
  color: "#ff4444", fontSize: 12, fontWeight: 600, cursor: "pointer",
};

const backBtnStyle: React.CSSProperties = {
  padding: "9px 20px", background: "#fff",
  border: "1px solid #e0e0e0", borderRadius: 6,
  color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

const nextBtnStyle: React.CSSProperties = {
  padding: "9px 28px", background: "#D4AF37",
  border: "none", borderRadius: 6,
  color: "#0a0a0a", fontSize: 13, fontWeight: 700, cursor: "pointer",
  letterSpacing: "0.02em",
};
