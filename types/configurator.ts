// types/configurator.ts

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
  basePrice: number;
  imageBg: string; // css color for preview
}

export interface MaterialOption {
  id: string;
  label: string;
  number: number;
  priceModifier: number;
}

export interface SizeOption {
  id: string;
  label: string;
  sizeNum: number;
  cols: number;
  rows: number;
  totalModules: number;
  priceModifier: number;
}

export interface AccessoryOption {
  id: string;
  modularSize: 2 | 4;
  name: string;
  slots: number;
  priceModifier: number;
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
  priceModifier?: number;
}

export interface TechnologyOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
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
}

export interface PriceBreakdown {
  base: number;
  gst: number;
  total: number;
}
