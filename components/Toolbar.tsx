// components/Toolbar.tsx — Xerovolt Top Toolbar

"use client";

import React, { useState } from "react";
import { PanelConfig } from "../types";

interface ToolbarProps {
  configName: string;
  isDirty: boolean;
  isSaving: boolean;
  savedConfigs: PanelConfig[];
  onSave: () => void;
  onNew: () => void;
  onLoadConfig: (id: string) => void;
  onExportSVG: () => void;
  onDeleteSlots: () => void;
}

export default function Toolbar({
  configName,
  isDirty,
  isSaving,
  savedConfigs,
  onSave,
  onNew,
  onLoadConfig,
  onExportSVG,
  onDeleteSlots,
}: ToolbarProps) {
  const [showConfigs, setShowConfigs] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header
      style={{
        height: 52,
        background: "#0d0d0d",
        borderBottom: "1px solid #1e1e1e",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 0,
        position: "relative",
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginRight: 28,
        }}
      >
        <XerovoltLogo />
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#D4AF37",
              letterSpacing: "0.12em",
              lineHeight: 1,
            }}
          >
            XEROVOLT
          </div>
          <div
            style={{
              fontSize: 8,
              color: "#555",
              letterSpacing: "0.08em",
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            PANEL CUSTOMIZER
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: "#222", marginRight: 20 }} />

      {/* Config name indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginRight: 16,
        }}
      >
        <span style={{ fontSize: 12, color: "#888" }}>{configName}</span>
        {isDirty && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#D4AF37",
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <ToolbarButton onClick={onNew} variant="ghost">
          + New
        </ToolbarButton>

        {/* Load dropdown */}
        <div style={{ position: "relative" }}>
          <ToolbarButton
            onClick={() => setShowConfigs((v) => !v)}
            variant="ghost"
          >
            Load ▾
          </ToolbarButton>
          {showConfigs && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 4,
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                minWidth: 200,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                zIndex: 200,
              }}
            >
              {savedConfigs.length === 0 ? (
                <div
                  style={{ padding: "10px 14px", fontSize: 11, color: "#444" }}
                >
                  No saved configs
                </div>
              ) : (
                savedConfigs.map((cfg) => (
                  <button
                    key={cfg.id}
                    onClick={() => {
                      onLoadConfig(cfg.id);
                      setShowConfigs(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px 14px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid #1a1a1a",
                      color: "#ccc",
                      fontSize: 11,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.background = "#1a1600")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.background = "none")
                    }
                  >
                    <div style={{ fontWeight: 600, color: "#ddd" }}>
                      {cfg.name}
                    </div>
                    <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>
                      {new Date(cfg.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
          {/* Click-away */}
          {showConfigs && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 199,
              }}
              onClick={() => setShowConfigs(false)}
            />
          )}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right side actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ToolbarButton onClick={onDeleteSlots} variant="ghost">
          Clear All
        </ToolbarButton>

        {/* Export */}
        <div style={{ position: "relative" }}>
          <ToolbarButton
            onClick={() => setShowExportMenu((v) => !v)}
            variant="ghost"
          >
            Export ▾
          </ToolbarButton>
          {showExportMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 4,
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                minWidth: 220,
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                zIndex: 200,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => {
                  onExportSVG();
                  setShowExportMenu(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid #1a1a1a",
                  color: "#ccc",
                  fontSize: 11,
                  textAlign: "left",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.background = "#1a1600")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.background = "none")
                }
              >
                <div style={{ fontWeight: 700, color: "#D4AF37" }}>
                  ⬡ Engraving SVG
                </div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>
                  Production-ready for laser engraving
                </div>
              </button>
              <div
                style={{
                  padding: "8px 16px",
                  fontSize: 9,
                  color: "#333",
                }}
              >
                More formats coming soon
              </div>
            </div>
          )}
          {showExportMenu && (
            <div
              style={{ position: "fixed", inset: 0, zIndex: 199 }}
              onClick={() => setShowExportMenu(false)}
            />
          )}
        </div>

        <div style={{ width: 1, height: 24, background: "#222" }} />

        <ToolbarButton
          onClick={onSave}
          variant="gold"
          disabled={isSaving || !isDirty}
        >
          {isSaving ? "Saving…" : "Save"}
        </ToolbarButton>
      </div>
    </header>
  );
}

// ── Shared button ─────────────────────────────────────────────────────────────
function ToolbarButton({
  children,
  onClick,
  variant = "ghost",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "ghost" | "gold";
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const base: React.CSSProperties = {
    padding: "5px 12px",
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 5,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.12s",
    letterSpacing: "0.03em",
  };

  const styles: Record<string, React.CSSProperties> = {
    ghost: {
      ...base,
      background: hovered ? "#1a1a1a" : "transparent",
      border: `1px solid ${hovered ? "#333" : "transparent"}`,
      color: "#aaa",
    },
    gold: {
      ...base,
      background: hovered ? "#c9a52f" : "#D4AF37",
      border: "1px solid #D4AF37",
      color: "#0a0a0a",
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

// ── Xerovolt Logo SVG ─────────────────────────────────────────────────────────
function XerovoltLogo() {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="https://xerovolt.in/logo/xerovolt-logo.svg"
    >
      <rect width={28} height={28} rx={5} fill="#D4AF37" />
      <path
        d="M7 7l5 7-5 7h4l3-4.2 3 4.2h4l-5-7 5-7h-4l-3 4.2L11 7H7z"
        fill="#0a0a0a"
      />
    </svg>
  );
}