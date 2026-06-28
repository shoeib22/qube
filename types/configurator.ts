export type StepId = "panel" | "material" | "size" | "accessories" | "icons" | "color" | "technology" | "cart";

export interface Step {
  id: StepId;
  label: string;
  index: number;
  path: string;
}

export interface PanelOption {
  id: string;
  name: string;
  tagline: string;
}

export interface MaterialOption {
  id: string;
  label: string;
  number: number; // Material 1, Material 2
}

export interface SizeOption {
  id: string;
  label: string;
  modules: number;   // 2, 4, 6, 8, 12
  cols: number;
  rows: number;
}

export type ModularSize = 2 | 4 | 6;

export interface AccessoryOption {
  id: string;
  modularSize: ModularSize;
  name: string;
  slots: number;
}

export interface IconItem {
  id: string;
  name: string;
  category: string;
  svg: string;
}

export interface SlotAssignment {
  slotIndex: number;
  iconId: string | null;
  iconName: string | null;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  type: "material" | "frame";
}

export interface TechnologyOption {
  id: string;
  name: string;
  description: string;
}

export interface ConfiguratorState {
  panel: string | null;
  material: string | null;
  size: string | null;
  accessory: string | null;
  slots: SlotAssignment[];
  materialColor: string | null;
  frameColor: string | null;
  technology: string | null;
  qty: number;
  orderNote: string;
  savedConfigId: string | null;
}

// Saved config as stored in Firestore
export interface SavedPanelConfig {
  id: string;
  userId: string;
  name: string;
  panel: "edge";
  material: string | null;
  size: string | null;
  accessory: string | null;
  slots: SlotAssignment[];
  materialColor: string | null;
  frameColor: string | null;
  technology: string | null;
  qty: number;
  orderNote: string;
  deviceId: string | null;
  orderId: string | null;
  savedAt: any;
  updatedAt: any;
}
