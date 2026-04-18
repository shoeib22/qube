// components/PanelCanvas.tsx — Xerovolt 8M Digital Twin Canvas

"use client";

import React, { useCallback, useState, useRef } from "react";
import { SlotConfig } from "../types";
import {
  PANEL_SLOTS,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  PANEL_PADDING,
  SLOT_WIDTH,
  SLOT_HEIGHT,
  LED_WIDTH,
  LED_HEIGHT,
  LED_OFFSET_Y,
  PANEL_CORNER_RADIUS,
} from "../lib/panelLayout";
import { getIconById } from "../lib/iconLibrary";

interface PanelCanvasProps {
  slots: SlotConfig[];
  selectedSlotId: number | null;
  draggingIconId: string | null;
  customIconDataUrls: Record<string, string>;
  onSlotClick: (slotId: number) => void;
  onDropIcon: (slotId: number, iconId: string) => void;
  onSlotDoubleClick: (slotId: number) => void;
}

export default function PanelCanvas({
  slots,
  selectedSlotId,
  draggingIconId,
  customIconDataUrls,
  onSlotClick,
  onDropIcon,
  onSlotDoubleClick,
}: PanelCanvasProps) {
  const [hoveredSlotId, setHoveredSlotId] = useState<number | null>(null);
  const [dragOverSlotId, setDragOverSlotId] = useState<number | null>(null);

  const getSlotConfig = (id: number): SlotConfig | undefined =>
    slots.find((s) => s.slotId === id);

  const handleDragOver = useCallback(
    (e: React.DragEvent, slotId: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDragOverSlotId(slotId);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, slotId: number) => {
      e.preventDefault();
      const iconId = e.dataTransfer.getData("text/plain");
      if (iconId) onDropIcon(slotId, iconId);
      setDragOverSlotId(null);
    },
    [onDropIcon]
  );

  // Scale to fit container while maintaining aspect ratio
  const scale = 1;
  const svgWidth = PANEL_WIDTH;
  const svgHeight = PANEL_HEIGHT + 60; // extra for label

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        position: "relative",
        overflow: "auto",
        padding: 32,
      }}
    >
      {/* Grid dots background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, #222 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ position: "relative", zIndex: 1, maxWidth: "100%", maxHeight: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Panel Body ───────────────────────────────────────────────── */}
        {/* Outer frame shadow */}
        <rect
          x={6}
          y={6}
          width={PANEL_WIDTH - 12}
          height={PANEL_HEIGHT - 12}
          rx={PANEL_CORNER_RADIUS + 2}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={0.5}
          opacity={0.15}
        />

        {/* Main panel body */}
        <rect
          x={4}
          y={4}
          width={PANEL_WIDTH - 8}
          height={PANEL_HEIGHT - 8}
          rx={PANEL_CORNER_RADIUS}
          fill="#141414"
          stroke="#D4AF37"
          strokeWidth={1.5}
        />

        {/* Xerovolt branding strip (top) */}
        <rect x={4} y={4} width={PANEL_WIDTH - 8} height={32} rx={PANEL_CORNER_RADIUS} fill="#1a1600" />
        <rect x={4} y={24} width={PANEL_WIDTH - 8} height={12} fill="#1a1600" />

        {/* Brand text */}
        <text
          x={PANEL_WIDTH / 2}
          y={22}
          textAnchor="middle"
          fill="#D4AF37"
          fontSize={9}
          fontFamily="'Arial', sans-serif"
          fontWeight={700}
          letterSpacing={4}
        >
          XEROVOLT
        </text>

        {/* Corner detail marks */}
        {[
          [10, 38],
          [PANEL_WIDTH - 10, 38],
          [10, PANEL_HEIGHT - 14],
          [PANEL_WIDTH - 10, PANEL_HEIGHT - 14],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2} fill="#D4AF37" opacity={0.4} />
        ))}

        {/* Model plate */}
        <text
          x={PANEL_WIDTH - 14}
          y={PANEL_HEIGHT - 6}
          textAnchor="end"
          fill="#2a2a2a"
          fontSize={7}
          fontFamily="monospace"
        >
          8M TOUCH PANEL — REV.2
        </text>

        {/* ── Slots ────────────────────────────────────────────────────── */}
        {PANEL_SLOTS.map((slot) => {
          const cfg = getSlotConfig(slot.id);
          const isSelected = selectedSlotId === slot.id;
          const isHovered = hoveredSlotId === slot.id;
          const isDragOver = dragOverSlotId === slot.id;
          const hasIcon = !!cfg?.iconId;

          const slotFill = isDragOver
            ? "#1a1500"
            : isSelected
            ? "#151200"
            : isHovered
            ? "#111100"
            : "#0d0d0d";

          const slotBorder = isDragOver
            ? "#D4AF37"
            : isSelected
            ? "#D4AF37"
            : hasIcon
            ? "#2a2a2a"
            : "#1a1a1a";

          const strokeWidth = isSelected || isDragOver ? 1.5 : 1;

          // LED color
          const ledColor =
            cfg?.defaultLedState && cfg?.ledColor !== "off"
              ? cfg.ledColor === "blue"
                ? "#1E90FF"
                : "#FF2233"
              : "#1a1a1a";

          const ledGlow = cfg?.defaultLedState && cfg?.ledColor !== "off";

          return (
            <g key={slot.id}>
              {/* Drag target overlay */}
              <rect
                x={slot.x}
                y={slot.y}
                width={SLOT_WIDTH}
                height={SLOT_HEIGHT}
                rx={8}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onDragOver={(e) => handleDragOver(e, slot.id)}
                onDragLeave={() => setDragOverSlotId(null)}
                onDrop={(e) => handleDrop(e, slot.id)}
                onClick={() => onSlotClick(slot.id)}
                onDoubleClick={() => onSlotDoubleClick(slot.id)}
                onMouseEnter={() => setHoveredSlotId(slot.id)}
                onMouseLeave={() => setHoveredSlotId(null)}
              />

              {/* Slot body */}
              <rect
                x={slot.x}
                y={slot.y}
                width={SLOT_WIDTH}
                height={SLOT_HEIGHT}
                rx={8}
                fill={slotFill}
                stroke={slotBorder}
                strokeWidth={strokeWidth}
                style={{ pointerEvents: "none" }}
              />

              {/* Slot number */}
              <text
                x={slot.x + 6}
                y={slot.y + 13}
                fill={isSelected ? "#D4AF37" : "#2a2a2a"}
                fontSize={8}
                fontFamily="monospace"
                style={{ pointerEvents: "none" }}
              >
                {slot.isSocket ? "⊙" : `S${slot.id}`}
              </text>

              {/* Icon */}
              {hasIcon && (
                <SlotIcon
                  slotX={slot.x}
                  slotY={slot.y}
                  iconId={cfg!.iconId!}
                  customIconDataUrls={customIconDataUrls}
                  isSelected={isSelected}
                />
              )}

              {/* LED slit */}
              <rect
                x={slot.x + (SLOT_WIDTH - LED_WIDTH) / 2}
                y={slot.y + LED_OFFSET_Y}
                width={LED_WIDTH}
                height={LED_HEIGHT}
                rx={LED_HEIGHT / 2}
                fill={ledColor}
                style={{ pointerEvents: "none" }}
              />
              {ledGlow && (
                <rect
                  x={slot.x + (SLOT_WIDTH - LED_WIDTH) / 2 - 2}
                  y={slot.y + LED_OFFSET_Y - 2}
                  width={LED_WIDTH + 4}
                  height={LED_HEIGHT + 4}
                  rx={(LED_HEIGHT + 4) / 2}
                  fill="none"
                  stroke={ledColor}
                  strokeWidth={1}
                  opacity={0.3}
                  style={{ pointerEvents: "none" }}
                />
              )}

              {/* Drag-over indicator */}
              {isDragOver && (
                <>
                  <rect
                    x={slot.x + 2}
                    y={slot.y + 2}
                    width={SLOT_WIDTH - 4}
                    height={SLOT_HEIGHT - 4}
                    rx={6}
                    fill="none"
                    stroke="#377bd4"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    opacity={0.6}
                    style={{ pointerEvents: "none" }}
                  />
                  <text
                    x={slot.x + SLOT_WIDTH / 2}
                    y={slot.y + SLOT_HEIGHT / 2 + 4}
                    textAnchor="middle"
                    fill="#2e68cd"
                    fontSize={10}
                    style={{ pointerEvents: "none" }}
                  >
                    DROP
                  </text>
                </>
              )}

              {/* Device name label */}
              {cfg?.deviceName && (
                <text
                  x={slot.x + SLOT_WIDTH / 2}
                  y={slot.y + SLOT_HEIGHT - 5}
                  textAnchor="middle"
                  fill={isSelected ? "#37a0d4" : "#555"}
                  fontSize={7}
                  fontFamily="Arial, sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  {cfg.deviceName.length > 12
                    ? cfg.deviceName.slice(0, 11) + "…"
                    : cfg.deviceName}
                </text>
              )}

              {/* Empty slot hint */}
              {!hasIcon && !isDragOver && (
                <text
                  x={slot.x + SLOT_WIDTH / 2}
                  y={slot.y + SLOT_HEIGHT / 2 + 4}
                  textAnchor="middle"
                  fill="#1e1e1e"
                  fontSize={9}
                  style={{ pointerEvents: "none" }}
                >
                  {slot.isSocket ? "SOCKET" : "EMPTY"}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Panel label below ─────────────────────────────────────────── */}
        <text
          x={PANEL_WIDTH / 2}
          y={PANEL_HEIGHT + 20}
          textAnchor="middle"
          fill="#333"
          fontSize={10}
          fontFamily="Arial, sans-serif"
          letterSpacing={2}
        >
          1:1 DIGITAL TWIN — 8M TOUCH PANEL
        </text>
        <text
          x={PANEL_WIDTH / 2}
          y={PANEL_HEIGHT + 38}
          textAnchor="middle"
          fill="#222"
          fontSize={8}
          fontFamily="monospace"
        >
          10 SWITCHES + 1 SOCKET · DRAG ICONS FROM LIBRARY · CLICK TO CONFIGURE
        </text>
      </svg>
    </div>
  );
}

// ── Slot Icon Renderer ────────────────────────────────────────────────────────
function SlotIcon({
  slotX,
  slotY,
  iconId,
  customIconDataUrls,
  isSelected,
}: {
  slotX: number;
  slotY: number;
  iconId: string;
  customIconDataUrls: Record<string, string>;
  isSelected: boolean;
}) {
  const iconSize = 36;
  const iconX = slotX + (SLOT_WIDTH - iconSize) / 2;
  const iconY = slotY + 18;
  const iconColor = isSelected ? "#D4AF37" : "#aaaaaa";

  // Custom icon (image)
  if (customIconDataUrls[iconId]) {
    return (
      <image
        href={customIconDataUrls[iconId]}
        x={iconX}
        y={iconY}
        width={iconSize}
        height={iconSize}
        style={{ pointerEvents: "none", filter: "invert(1)" }}
      />
    );
  }

  // Built-in icon (SVG paths)
  const builtIn = getIconById(iconId);
  if (!builtIn) return null;

  // Extract inner SVG content and render
  const innerMatch = builtIn.svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerSVG = innerMatch ? innerMatch[1] : "";

  return (
    <svg
      x={iconX}
      y={iconY}
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={iconColor}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pointerEvents: "none" }}
      dangerouslySetInnerHTML={{ __html: innerSVG }}
    />
  );
}