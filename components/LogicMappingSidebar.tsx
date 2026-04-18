// components/LogicMappingSidebar.tsx — Xerovolt Right Sidebar

"use client";

import React, { useCallback } from "react";
import { SlotConfig } from "../types";
import { PANEL_SLOTS } from "../lib/panelLayout";
import { getIconById } from "../lib/iconLibrary";

interface LogicMappingSidebarProps {
  selectedSlotId: number | null;
  slotConfig: SlotConfig | null;
  customIconDataUrls: Record<string, string>;
  onUpdateSlot: (slotId: number, updates: Partial<SlotConfig>) => void;
  onRemoveIcon: (slotId: number) => void;
  onSelectSlot: (slotId: number | null) => void;
  configName: string;
  onRenameConfig: (name: string) => void;
  isSaving: boolean;
  isDirty: boolean;
  onSave: () => void;
}

export default function LogicMappingSidebar({
  selectedSlotId,
  slotConfig,
  customIconDataUrls,
  onUpdateSlot,
  onRemoveIcon,
  onSelectSlot,
  configName,
  onRenameConfig,
  isSaving,
  isDirty,
  onSave,
}: LogicMappingSidebarProps) {
  const slot = selectedSlotId
    ? PANEL_SLOTS.find((s) => s.id === selectedSlotId)
    : null;

  const builtInIcon = slotConfig?.iconId
    ? getIconById(slotConfig.iconId)
    : null;

  const hasCustomIcon =
    slotConfig?.iconId && customIconDataUrls[slotConfig.iconId];

  return (
    <aside
      style={{
        width: 256,
        minWidth: 256,
        background: "#111111",
        borderLeft: "1px solid #2a2a2a",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Config name + Save */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        <label style={labelStyle}>Config Name</label>
        <input
          type="text"
          value={configName}
          onChange={(e) => onRenameConfig(e.target.value)}
          style={inputStyle}
        />
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          style={{
            ...saveButtonStyle,
            opacity: isSaving || !isDirty ? 0.5 : 1,
            cursor: isSaving || !isDirty ? "not-allowed" : "pointer",
          }}
        >
          {isSaving ? (
            <>
              <span style={spinnerStyle} /> Saving...
            </>
          ) : isDirty ? (
            "Save to Cloud ↑"
          ) : (
            "✓ Saved"
          )}
        </button>
      </div>

      {/* Slot Logic Mapping */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 16px",
        }}
      >
        {!selectedSlotId ? (
          <EmptyState />
        ) : (
          <>
            {/* Slot info header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: "1px solid #1e1e1e",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {hasCustomIcon ? (
                  <img
                    src={customIconDataUrls[slotConfig!.iconId!]}
                    alt=""
                    style={{ width: 20, height: 20, filter: "invert(1)" }}
                  />
                ) : builtInIcon ? (
                  <div
                    style={{ color: "#D4AF37", width: 20, height: 20 }}
                    dangerouslySetInnerHTML={{ __html: builtInIcon.svg }}
                  />
                ) : (
                  <div style={{ color: "#333", fontSize: 10 }}>EMPTY</div>
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#D4AF37",
                    letterSpacing: "0.1em",
                  }}
                >
                  Slot {selectedSlotId}
                  {slot?.isSocket ? " — Socket" : ""}
                </div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>
                  Row {slot?.row} · Column {slot?.col}
                </div>
              </div>
              <button
                onClick={() => onSelectSlot(null)}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: "#444",
                  cursor: "pointer",
                  fontSize: 16,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Device Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Device Name</label>
              <input
                type="text"
                placeholder="e.g. Living Room Light"
                value={slotConfig?.deviceName || ""}
                onChange={(e) =>
                  onUpdateSlot(selectedSlotId, { deviceName: e.target.value })
                }
                style={inputStyle}
              />
            </div>

            {/* Entity ID */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Entity ID</label>
              <input
                type="text"
                placeholder="e.g. light.living_room"
                value={slotConfig?.entityId || ""}
                onChange={(e) =>
                  onUpdateSlot(selectedSlotId, { entityId: e.target.value })
                }
                style={{ ...inputStyle, fontFamily: "monospace", fontSize: 11 }}
              />
              <div style={{ fontSize: 9, color: "#444", marginTop: 4 }}>
                Home Assistant / Custom entity ID
              </div>
            </div>

            {/* LED Config */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>LED Color</label>
              <div style={{ display: "flex", gap: 6 }}>
                {(["blue", "red", "off"] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      onUpdateSlot(selectedSlotId, { ledColor: color })
                    }
                    style={{
                      flex: 1,
                      padding: "6px 4px",
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 5,
                      border: `1px solid ${
                        slotConfig?.ledColor === color ? ledBorderColor(color) : "#2a2a2a"
                      }`,
                      background:
                        slotConfig?.ledColor === color
                          ? ledBgColor(color)
                          : "#0d0d0d",
                      color:
                        slotConfig?.ledColor === color
                          ? ledTextColor(color)
                          : "#555",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.12s",
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Default LED State */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Default LED State</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  onClick={() =>
                    onUpdateSlot(selectedSlotId, {
                      defaultLedState: !slotConfig?.defaultLedState,
                    })
                  }
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    background: slotConfig?.defaultLedState ? "#D4AF37" : "#222",
                    border: `1px solid ${slotConfig?.defaultLedState ? "#D4AF37" : "#333"}`,
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: slotConfig?.defaultLedState ? 20 : 2,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: slotConfig?.defaultLedState ? "#0a0a0a" : "#444",
                      transition: "left 0.2s",
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: "#888" }}>
                  {slotConfig?.defaultLedState ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            {/* Remove icon */}
            {slotConfig?.iconId && (
              <button
                onClick={() => onRemoveIcon(selectedSlotId)}
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "transparent",
                  border: "1px solid #3a1a1a",
                  borderRadius: 6,
                  color: "#aa4444",
                  fontSize: 11,
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = "#1a0a0a";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = "transparent";
                }}
              >
                Remove Icon from Slot
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer hint */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid #1e1e1e",
          fontSize: 9,
          color: "#333",
          lineHeight: 1.5,
          letterSpacing: "0.02em",
        }}
      >
        DRAG icons from the library · DROP onto panel slots · CLICK a slot to configure
      </div>
    </aside>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: 60,
        color: "#333",
      }}
    >
      <svg
        style={{ width: 40, height: 40, margin: "0 auto 12px", display: "block" }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M9 12h6M12 9v6" />
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
      <div style={{ fontSize: 11, marginBottom: 6 }}>No Slot Selected</div>
      <div style={{ fontSize: 10, color: "#2a2a2a", lineHeight: 1.5 }}>
        Click a slot on the panel canvas or drag an icon to begin
      </div>
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: "#666",
  textTransform: "uppercase",
  marginBottom: 5,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0d0d0d",
  border: "1px solid #2a2a2a",
  borderRadius: 6,
  color: "#e0e0e0",
  fontSize: 12,
  padding: "7px 10px",
  outline: "none",
  boxSizing: "border-box",
};

const saveButtonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: "8px",
  background: "#D4AF37",
  border: "none",
  borderRadius: 6,
  color: "#0a0a0a",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.05em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};

const spinnerStyle: React.CSSProperties = {
  display: "inline-block",
  width: 10,
  height: 10,
  border: "1.5px solid #0a0a0a",
  borderTopColor: "transparent",
  borderRadius: "50%",
  animation: "spin 0.7s linear infinite",
};

function ledBorderColor(c: string) {
  return c === "blue" ? "#3399ff" : c === "red" ? "#ff4444" : "#555";
}
function ledBgColor(c: string) {
  return c === "blue" ? "#0a1a2e" : c === "red" ? "#2e0a0a" : "#1a1a1a";
}
function ledTextColor(c: string) {
  return c === "blue" ? "#3399ff" : c === "red" ? "#ff4444" : "#888";
}