// lib/panelLayout.ts — Xerovolt 8M Physical Panel Layout Constants

import { SlotPosition } from "../types";

// ── Canvas dimensions (pixel-perfect 1:1 representation) ─────────────────────
export const PANEL_WIDTH = 680;
export const PANEL_HEIGHT = 420;
export const PANEL_PADDING = 48;
export const PANEL_CORNER_RADIUS = 12;

// ── Slot dimensions ───────────────────────────────────────────────────────────
export const SLOT_WIDTH = 96;
export const SLOT_HEIGHT = 96;
export const SLOT_RADIUS = 8;
export const SLOT_GAP_X = 20;
export const SLOT_GAP_Y = 28;

// ── LED slit dimensions (matches physical panel) ──────────────────────────────
export const LED_WIDTH = 40;
export const LED_HEIGHT = 5;
export const LED_OFFSET_Y = 72; // from slot top

// ── Socket slot (bottom-right, larger) ───────────────────────────────────────
export const SOCKET_WIDTH = 96;
export const SOCKET_HEIGHT = 96;

// ── Calculate the 10 switch slots + 1 socket ─────────────────────────────────
// Row 1: slots 1-5, Row 2: slots 6-10, plus socket bottom-right
function calculateSlots(): SlotPosition[] {
  const slots: SlotPosition[] = [];

  const totalRowWidth = 5 * SLOT_WIDTH + 4 * SLOT_GAP_X;
  const startX = (PANEL_WIDTH - totalRowWidth) / 2;
  const startY = PANEL_PADDING + 30;

  // Row 1: 5 switches
  for (let col = 0; col < 5; col++) {
    slots.push({
      id: col + 1,
      x: startX + col * (SLOT_WIDTH + SLOT_GAP_X),
      y: startY,
      row: 1,
      col: col + 1,
    });
  }

  // Row 2: 5 switches
  const row2Y = startY + SLOT_HEIGHT + SLOT_GAP_Y;
  for (let col = 0; col < 5; col++) {
    slots.push({
      id: col + 6,
      x: startX + col * (SLOT_WIDTH + SLOT_GAP_X),
      y: row2Y,
      row: 2,
      col: col + 1,
    });
  }

  // Socket: slot 11, positioned below row 2, centered right
  slots.push({
    id: 11,
    x: startX + 4 * (SLOT_WIDTH + SLOT_GAP_X),
    y: row2Y + SLOT_HEIGHT + SLOT_GAP_Y,
    row: 3,
    col: 5,
    isSocket: true,
  });

  return slots;
}

export const PANEL_SLOTS: SlotPosition[] = calculateSlots();

// ── Default empty slot config ─────────────────────────────────────────────────
export function createDefaultSlotConfig(slotId: number) {
  return {
    slotId,
    iconId: null,
    deviceName: "",
    entityId: "",
    defaultLedState: false,
    ledColor: "blue" as const,
  };
}

export function createDefaultConfig(userId: string, name = "New Panel Config") {
  const id = `panel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    name,
    userId,
    slots: PANEL_SLOTS.map((s) => createDefaultSlotConfig(s.id)),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}