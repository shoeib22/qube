"use client";
// components/configurator/PanelPreview.tsx

import React from "react";
import { SIZES, ICONS, getMaterialColorById } from "../../lib/configuratorData";
import type { SlotAssignment } from "../../types/configurator";

interface PanelPreviewProps {
  sizeId: string | null;
  materialColorId: string | null;
  slots: SlotAssignment[];
  selectedSlot?: number | null;
  onSlotClick?: (index: number) => void;
  width?: number;
  height?: number;
  showLabels?: boolean;
  clickable?: boolean;
}

export default function PanelPreview({
  sizeId,
  materialColorId,
  slots,
  selectedSlot,
  onSlotClick,
  width = 520,
  height = 320,
  showLabels = false,
  clickable = false,
}: PanelPreviewProps) {
  const size = SIZES.find(s => s.id === sizeId);
  const matColor = getMaterialColorById(materialColorId || "");

  // Panel background color from material
  const panelBg = matColor ? matColor.hex : "#1a1a1a";
  const isDarkPanel = !matColor || ["#1a1a1a", "#2c4de0"].includes(matColor.hex);
  const slotBorderColor = isDarkPanel ? "rgba(100,160,255,0.5)" : "rgba(0,0,0,0.2)";
  const slotBg = isDarkPanel ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.25)";

  if (!size) {
    // No size selected yet — show placeholder
    return (
      <div
        style={{
          width,
          height,
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#333", fontSize: 11, letterSpacing: "0.1em" }}>
          SELECT A SIZE TO PREVIEW
        </span>
      </div>
    );
  }

  const { cols, rows, totalModules } = size;
  const panelW = width - 32;
  const panelH = height - 32;
  const padX = 40;
  const padY = 36;
  const gapX = 12;
  const gapY = 14;
  const slotW = (panelW - padX * 2 - gapX * (cols - 1)) / cols;
  const slotH = (panelH - padY * 2 - gapY * (rows - 1)) / rows;

  const slotPositions = Array.from({ length: totalModules }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    return {
      x: padX + col * (slotW + gapX),
      y: padY + row * (slotH + gapY),
      index: i,
    };
  });

  const getSlotIcon = (index: number) => {
    const assignment = slots.find(s => s.slotIndex === index);
    if (!assignment?.iconId) return null;
    return ICONS.find(ic => ic.id === assignment.iconId);
  };

  // Slot stroke based on light/dark panel
  const iconColor = isDarkPanel ? "rgba(80,140,255,0.9)" : "rgba(0,0,0,0.7)";
  const selectedBg = isDarkPanel ? "rgba(212,175,55,0.1)" : "rgba(212,175,55,0.15)";
  const selectedBorder = "#D4AF37";

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        borderRadius: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid dots bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, #1a1a1a 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        pointerEvents: "none",
      }} />

      {/* Panel body */}
      <div
        style={{
          width: panelW,
          height: panelH,
          background: panelBg,
          borderRadius: 10,
          position: "relative",
          boxShadow: "0 4px 32px rgba(0,0,0,0.6)",
          border: "1px solid rgba(212,175,55,0.2)",
          overflow: "hidden",
          transition: "background 0.3s",
        }}
      >
        {/* Gold top strip */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: 3, background: "#D4AF37", opacity: 0.7,
        }} />

        {/* Slots */}
        {slotPositions.map(({ x, y, index }) => {
          const icon = getSlotIcon(index);
          const isSelected = selectedSlot === index;
          const hasX = slots.some(s => s.slotIndex === index && !s.iconId);

          return (
            <div
              key={index}
              onClick={() => clickable && onSlotClick?.(index)}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: slotW,
                height: slotH,
                background: isSelected ? selectedBg : slotBg,
                border: `1px solid ${isSelected ? selectedBorder : slotBorderColor}`,
                borderRadius: 5,
                cursor: clickable ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
                overflow: "hidden",
              }}
            >
              {icon ? (
                <>
                  <svg
                    width={Math.min(slotW * 0.45, 28)}
                    height={Math.min(slotH * 0.45, 28)}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={iconColor}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  {showLabels && (
                    <span style={{
                      fontSize: 7,
                      color: isDarkPanel ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                      marginTop: 3,
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}>
                      {icon.name}
                    </span>
                  )}
                </>
              ) : (
                /* Red X for invalid/empty slot in some views */
                clickable && (
                  <span style={{ color: "rgba(255,60,60,0.5)", fontSize: 12, lineHeight: 1 }}>
                    ×
                  </span>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
