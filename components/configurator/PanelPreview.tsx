"use client";

import React from "react";
import { getSizeById, getMaterialColorById, getFrameColorById } from "@/lib/configuratorData";
import { BUILT_IN_ICONS } from "@/lib/iconLibrary";
import type { SlotAssignment } from "@/types/configurator";

interface PanelPreviewProps {
  sizeId: string | null;
  materialColorId: string | null;
  frameColorId?: string | null;
  slots?: SlotAssignment[];
  selectedSlot?: number | null;
  onSlotClick?: (index: number) => void;
  slotCount?: number; // override from accessory
  customIconDataUrls?: Record<string, string>;
  className?: string;
}

export default function PanelPreview({
  sizeId,
  materialColorId,
  frameColorId,
  slots = [],
  selectedSlot = null,
  onSlotClick,
  slotCount,
  customIconDataUrls = {},
  className = "",
}: PanelPreviewProps) {
  const size = sizeId ? getSizeById(sizeId) : null;
  const materialColor = materialColorId ? getMaterialColorById(materialColorId) : null;
  const frameColor = frameColorId ? getFrameColorById(frameColorId) : null;

  const cols = size?.cols ?? 3;
  const rows = size?.rows ?? 2;
  const totalSlots = slotCount ?? (size?.modules ?? 6);

  const panelBg = materialColor?.hex ?? "#111111";
  const frameBorder = frameColor?.hex ?? "#333333";
  const isLight = materialColor ? isLightColor(materialColor.hex) : false;
  const slotStroke = isLight ? "#333" : "#555";
  const iconColor  = isLight ? "#111" : "#60a5fa";

  const slotW = 56;
  const slotH = 56;
  const gapX  = 12;
  const gapY  = 12;
  const padX  = 24;
  const padY  = 24;

  const panelW = padX * 2 + cols * slotW + (cols - 1) * gapX;
  const panelH = padY * 2 + rows * slotH + (rows - 1) * gapY;

  const slotPositions: { x: number; y: number; index: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= totalSlots) break;
      slotPositions.push({
        x: padX + c * (slotW + gapX),
        y: padY + r * (slotH + gapY),
        index: idx,
      });
    }
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${panelW} ${panelH}`}
        width={panelW}
        height={panelH}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        {/* Panel body */}
        <rect
          x={0} y={0}
          width={panelW} height={panelH}
          rx={10}
          fill={panelBg}
          stroke={frameBorder}
          strokeWidth={3}
        />

        {slotPositions.map(({ x, y, index }) => {
          const assignment = slots.find(s => s.slotIndex === index);
          const iconId = assignment?.iconId;
          const isSelected = selectedSlot === index;
          const builtIn = iconId ? BUILT_IN_ICONS.find(ic => ic.id === iconId) : null;
          const customUrl = iconId ? customIconDataUrls[iconId] : null;

          return (
            <g
              key={index}
              onClick={() => onSlotClick?.(index)}
              style={{ cursor: onSlotClick ? "pointer" : "default" }}
            >
              {/* Slot background */}
              <rect
                x={x} y={y}
                width={slotW} height={slotH}
                rx={6}
                fill="transparent"
                stroke={isSelected ? "#f2994a" : slotStroke}
                strokeWidth={isSelected ? 2 : 1}
                strokeDasharray={iconId ? undefined : "4 3"}
              />

              {/* Icon */}
              {builtIn && (
                <foreignObject x={x + 8} y={y + 8} width={slotW - 16} height={slotH - 16}>
                  <div
                    style={{ color: iconColor, width: "100%", height: "100%" }}
                    dangerouslySetInnerHTML={{ __html: builtIn.svg }}
                  />
                </foreignObject>
              )}
              {customUrl && !builtIn && (
                <image
                  href={customUrl}
                  x={x + 8} y={y + 8}
                  width={slotW - 16} height={slotH - 16}
                  style={{ filter: isLight ? "none" : "invert(1)" }}
                />
              )}

              {/* Slot number when empty */}
              {!iconId && (
                <text
                  x={x + slotW / 2}
                  y={y + slotH / 2 + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill={slotStroke}
                  fontFamily="sans-serif"
                >
                  {index + 1}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
