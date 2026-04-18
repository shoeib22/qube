// types/index.ts — Xerovolt Touch Panel Customizer

export interface SlotPosition {
  id: number;
  x: number;
  y: number;
  row: number;
  col: number;
  isSocket?: boolean;
}

export interface IconAsset {
  id: string;
  name: string;
  category: string;
  svgContent: string;
  thumbnailUrl?: string;
  isCustom?: boolean;
  uploadedAt?: number;
}

export interface SlotConfig {
  slotId: number;
  iconId: string | null;
  deviceName: string;
  entityId: string;
  defaultLedState: boolean;
  ledColor: "blue" | "red" | "off";
  iconColor?: string;
}

export interface PanelConfig {
  id: string;
  name: string;
  slots: SlotConfig[];
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface DragState {
  isDragging: boolean;
  iconId: string | null;
  sourceSlotId: number | null;
}

export type LedColor = "blue" | "red" | "off";