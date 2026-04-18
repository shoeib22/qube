// lib/svgExport.ts — Xerovolt Manufacturing SVG Export (Laser Engraving)

import { PanelConfig, SlotConfig } from "../types";
import { PANEL_SLOTS, SLOT_WIDTH, SLOT_HEIGHT, PANEL_WIDTH, PANEL_HEIGHT } from "./panelLayout";
import { BUILT_IN_ICONS, getIconById } from "./iconLibrary";

interface ExportOptions {
  includeSlotBorders?: boolean;
  iconScale?: number;
  strokeOnly?: boolean;
}

/**
 * Generate a production-ready SVG for laser engraving.
 * - No background, no colors
 * - Icons rendered as pure black paths
 * - Slot outlines as registration marks
 */
export function generateEngravingSVG(
  config: PanelConfig,
  customIconMap: Record<string, string> = {},
  options: ExportOptions = {}
): string {
  const { includeSlotBorders = true, iconScale = 0.6, strokeOnly = true } = options;

  const iconSize = Math.min(SLOT_WIDTH, SLOT_HEIGHT) * iconScale;
  const iconOffset = (SLOT_WIDTH - iconSize) / 2;

  let svgContent = ``;

  // Registration marks (slot outlines)
  if (includeSlotBorders) {
    PANEL_SLOTS.forEach((slot) => {
      svgContent += `
  <!-- Slot ${slot.id} Registration Mark -->
  <rect
    x="${slot.x}"
    y="${slot.y}"
    width="${SLOT_WIDTH}"
    height="${SLOT_HEIGHT}"
    rx="8"
    fill="none"
    stroke="black"
    stroke-width="0.5"
    stroke-dasharray="4 2"
  />`;
    });
  }

  // Icons
  config.slots.forEach((slotConfig) => {
    if (!slotConfig.iconId) return;

    const slot = PANEL_SLOTS.find((s) => s.id === slotConfig.slotId);
    if (!slot) return;

    const cx = slot.x + slot.w / 2;
    const cy = slot.y + slot.h / 2;
    const x = slot.x + iconOffset;
    const y = slot.y + iconOffset;

    // Check custom icon first
    if (customIconMap[slotConfig.iconId]) {
      const svgData = customIconMap[slotConfig.iconId];
      // Embed the icon SVG, forced to black
      svgContent += `
  <!-- Custom Icon: Slot ${slot.id} -->
  <g transform="translate(${x}, ${y})">
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24"
      fill="${strokeOnly ? "none" : "black"}"
      stroke="black"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round">
      ${extractSVGPaths(svgData)}
    </svg>
  </g>`;
      return;
    }

    // Built-in icon
    const builtIn = getIconById(slotConfig.iconId);
    if (!builtIn) return;

    const pathContent = extractSVGPaths(builtIn.svg);
    svgContent += `
  <!-- ${builtIn.name}: Slot ${slot.id} -->
  <g transform="translate(${x}, ${y})">
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24"
      fill="${strokeOnly ? "none" : "black"}"
      stroke="black"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round">
      ${pathContent}
    </svg>
  </g>`;

    // Device name label below icon
    if (slotConfig.deviceName) {
      svgContent += `
  <text
    x="${slot.x + SLOT_WIDTH / 2}"
    y="${slot.y + SLOT_HEIGHT - 8}"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="7"
    fill="black">
    ${escapeXml(slotConfig.deviceName)}
  </text>`;
    }
  });

  // Wrap in SVG root — no background
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${PANEL_WIDTH}"
  height="${PANEL_HEIGHT}"
  viewBox="0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}"
  version="1.1"
  id="xerovolt-engraving-export">
  <!-- Xerovolt Touch Panel — Laser Engraving Layout -->
  <!-- Generated: ${new Date().toISOString()} -->
  <!-- Panel Config: ${config.name} -->
  ${svgContent}
</svg>`;
}

/** Extract just the inner SVG path/shape elements */
function extractSVGPaths(svgString: string): string {
  const match = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1] : svgString;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Trigger browser download of the SVG file */
export function downloadSVG(svgContent: string, filename: string): void {
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Patch PANEL_SLOTS with w/h
import type { SlotPosition } from "../types";
declare module "../types" {
  interface SlotPosition {
    w?: number;
    h?: number;
  }
}
PANEL_SLOTS.forEach((s) => {
  (s as any).w = SLOT_WIDTH;
  (s as any).h = SLOT_HEIGHT;
});