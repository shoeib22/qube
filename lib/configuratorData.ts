import type {
  Step,
  PanelOption,
  MaterialOption,
  SizeOption,
  AccessoryOption,
  ColorOption,
  TechnologyOption,
} from "../types/configurator";

export const STEPS: Step[] = [
  { id: "panel",       label: "Panel",       index: 1, path: "/configurator/panel" },
  { id: "material",    label: "Material",    index: 2, path: "/configurator/material" },
  { id: "size",        label: "Size",        index: 3, path: "/configurator/size" },
  { id: "accessories", label: "Accessories", index: 4, path: "/configurator/accessories" },
  { id: "icons",       label: "Icons",       index: 5, path: "/configurator/icons" },
  { id: "color",       label: "Color",       index: 6, path: "/configurator/color" },
  { id: "technology",  label: "Technology",  index: 7, path: "/configurator/technology" },
  { id: "cart",        label: "Cart",        index: 8, path: "/configurator/cart" },
];

// Edge Series only
export const PANELS: PanelOption[] = [
  { id: "edge", name: "Edge", tagline: "Precision-crafted edge series panel" },
];

export const MATERIALS: MaterialOption[] = [
  { id: "glass",   label: "Glass",   number: 1 },
  { id: "acrylic", label: "Acrylic", number: 2 },
];

export const SIZES: SizeOption[] = [
  { id: "2m",  label: "2 Module",  modules: 2,  cols: 2, rows: 1 },
  { id: "4m",  label: "4 Module",  modules: 4,  cols: 4, rows: 1 },
  { id: "6m",  label: "6 Module",  modules: 6,  cols: 3, rows: 2 },
  { id: "8m",  label: "8 Module",  modules: 8,  cols: 4, rows: 2 },
  { id: "12m", label: "12 Module", modules: 12, cols: 4, rows: 3 },
];

// Accessories matching vdplshop.in Edge Series exactly
export const ACCESSORIES: AccessoryOption[] = [
  // 2 Modular
  { id: "2m-2switch",      modularSize: 2, name: "2 Switch",             slots: 2 },
  { id: "2m-2switch-1hv",  modularSize: 2, name: "2 Switch 1 HV",        slots: 3 },
  { id: "2m-2tw",          modularSize: 2, name: "2 TW",                 slots: 2 },
  { id: "2m-2hv",          modularSize: 2, name: "2 HV",                 slots: 2 },
  { id: "2m-bell",         modularSize: 2, name: "Bell",                 slots: 1 },
  { id: "2m-curtain",      modularSize: 2, name: "Curtain",              slots: 1 },
  { id: "2m-2dimmer",      modularSize: 2, name: "2 Dimmer (Phase Cut)", slots: 2 },
  { id: "2m-4scene",       modularSize: 2, name: "4 Scene Controller",   slots: 4 },
  { id: "2m-4switch-2mod", modularSize: 2, name: "4 Switch (2-Module)",  slots: 4 },
  { id: "2m-2curtain",     modularSize: 2, name: "2 Curtain",            slots: 2 },

  // 4 Modular
  { id: "4m-4switch",      modularSize: 4, name: "4 Switch (4-Module)",  slots: 4 },
  { id: "4m-4switch-1fan", modularSize: 4, name: "4 Switch + 1 Fan",     slots: 5 },
  { id: "4m-4hv",          modularSize: 4, name: "4 HV",                 slots: 4 },
  { id: "4m-6switch",      modularSize: 4, name: "6 Switch",             slots: 6 },
  { id: "4m-6hv",          modularSize: 4, name: "6 HV",                 slots: 6 },
  { id: "4m-4tw",          modularSize: 4, name: "4 TW",                 slots: 4 },
  { id: "4m-6tw",          modularSize: 4, name: "6 TW",                 slots: 6 },

  // 6 Modular
  { id: "6m-8switch",      modularSize: 6, name: "8 Switch",             slots: 8 },
  { id: "6m-8tw",          modularSize: 6, name: "8 TW",                 slots: 8 },
  { id: "6m-6switch-1fan", modularSize: 6, name: "6 Switch + 1 Fan",     slots: 7 },
  { id: "6m-4switch-2fan", modularSize: 6, name: "4 Switch + 2 Fan",     slots: 6 },
];

export const MATERIAL_COLORS: ColorOption[] = [
  { id: "mc-black",      name: "Black",      hex: "#000000", type: "material" },
  { id: "mc-white",      name: "White",      hex: "#FFFFFF", type: "material" },
  { id: "mc-grey",       name: "Grey",       hex: "#808080", type: "material" },
  { id: "mc-royal-blue", name: "Royal Blue", hex: "#3B4BC8", type: "material" },
  { id: "mc-gold",       name: "Gold",       hex: "#C8A951", type: "material" },
  { id: "mc-light-gray", name: "Light Gray", hex: "#D1D5DB", type: "material" },
];

export const FRAME_COLORS: ColorOption[] = [
  { id: "fc-black",     name: "Black",     hex: "#111111", type: "frame" },
  { id: "fc-grey",      name: "Grey",      hex: "#6B7280", type: "frame" },
  { id: "fc-silver",    name: "Silver",    hex: "#C0C0C0", type: "frame" },
  { id: "fc-gold",      name: "Gold",      hex: "#C8A951", type: "frame" },
  { id: "fc-rose-gold", name: "Rose Gold", hex: "#B76E79", type: "frame" },
  { id: "fc-chrome",    name: "Chrome",    hex: "#E8E8E8", type: "frame" },
];

export const TECHNOLOGIES: TechnologyOption[] = [
  { id: "remote", name: "Remote Based", description: "RF remote control — no internet required" },
  { id: "tuya",   name: "Tuya",         description: "Wi-Fi smart control via Tuya app" },
  { id: "zigbee", name: "Zigbee",       description: "Zigbee mesh protocol — ultra reliable" },
];

export const ICON_CATEGORIES = [
  "Lighting",
  "Climate",
  "Entertainment",
  "Security",
  "Appliances",
  "Power",
];

// Helpers
export const getAccessoriesByModularSize = (modularSize: 2 | 4 | 6) =>
  ACCESSORIES.filter(a => a.modularSize === modularSize);

export const getSizeById     = (id: string) => SIZES.find(s => s.id === id);
export const getMaterialById = (id: string) => MATERIALS.find(m => m.id === id);
export const getAccessoryById = (id: string) => ACCESSORIES.find(a => a.id === id);
export const getMaterialColorById = (id: string) => MATERIAL_COLORS.find(c => c.id === id);
export const getFrameColorById    = (id: string) => FRAME_COLORS.find(c => c.id === id);
export const getTechnologyById    = (id: string) => TECHNOLOGIES.find(t => t.id === id);
