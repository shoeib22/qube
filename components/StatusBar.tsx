// components/StatusBar.tsx — Xerovolt Bottom Status Bar

"use client";

import React from "react";
import { PanelConfig } from "../types";

interface StatusBarProps {
  config: PanelConfig;
  userId: string | null;
  selectedSlotId: number | null;
  isDirty: boolean;
}

export default function StatusBar({
  config,
  userId,
  selectedSlotId,
  isDirty,
}: StatusBarProps) {
  const filledSlots = config.slots.filter((s) => !!s.iconId).length;
  const configuredSlots = config.slots.filter(
    (s) => !!s.iconId && !!s.deviceName
  ).length;
  const totalSlots = config.slots.length;

  return (
    <div
      style={{
        height: 28,
        background: "#080808",
        borderTop: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 20,
        flexShrink: 0,
      }}
    >
      {/* Status indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: isDirty ? "#D4AF37" : "#22aa44",
          }}
        />
        <span
          style={{
            fontSize: 9,
            color: isDirty ? "#888" : "#555",
            letterSpacing: "0.08em",
          }}
        >
          {isDirty ? "UNSAVED CHANGES" : "SAVED"}
        </span>
      </div>

      <Divider />

      <StatusItem label="Slots Filled" value={`${filledSlots} / ${totalSlots}`} />
      <StatusItem
        label="Configured"
        value={`${configuredSlots} / ${totalSlots}`}
      />

      {selectedSlotId !== null && (
        <>
          <Divider />
          <StatusItem label="Selected" value={`Slot ${selectedSlotId}`} highlight />
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Session info */}
      <StatusItem
        label="Session"
        value={userId ? `${userId.slice(0, 8)}…` : "Connecting…"}
      />
      <Divider />
      <StatusItem label="Config ID" value={config.id.slice(0, 12) + "…"} />
    </div>
  );
}

function StatusItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span
        style={{
          fontSize: 8,
          color: "#333",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}:
      </span>
      <span
        style={{
          fontSize: 9,
          color: highlight ? "#D4AF37" : "#555",
          fontFamily: "monospace",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 14,
        background: "#1a1a1a",
      }}
    />
  );
}