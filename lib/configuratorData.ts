// lib/configuratorData.ts

import type {
  PanelOption, MaterialOption, SizeOption, AccessoryOption,
  IconItem, ColorOption, TechnologyOption, Step
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

export const PANELS: PanelOption[] = [
  { id: "royal-edge",  name: "Royal Edge",  tagline: "Premium beveled frame with gold accent trim",    basePrice: 5999,  imageBg: "#1a1400" },
  { id: "slim-pro",    name: "Slim Pro",    tagline: "Ultra-thin minimalist profile, 4mm bezel",       basePrice: 4999,  imageBg: "#0a1020" },
  { id: "neo-frame",   name: "Neo Frame",   tagline: "Industrial brushed finish, sharp corners",       basePrice: 5499,  imageBg: "#0f0f0f" },
  { id: "arc-series",  name: "Arc Series",  tagline: "Curved glass face with seamless edges",         basePrice: 6499,  imageBg: "#0a1a0a" },
  { id: "volt-edge",   name: "Volt Edge",   tagline: "Matte obsidian surface with etched detailing",  basePrice: 7299,  imageBg: "#120010" },
  { id: "apex",        name: "Apex",        tagline: "Mirror-polished face plate, executive tier",    basePrice: 8499,  imageBg: "#1a1000" },
];

export const MATERIALS: MaterialOption[] = [
  { id: "glass",   label: "Glass",   number: 1, priceModifier: 0 },
  { id: "acrylic", label: "Acrylic", number: 2, priceModifier: -500 },
];

export const SIZES: SizeOption[] = [
  { id: "2m",  label: "2 Module",  sizeNum: 1, cols: 1, rows: 1, totalModules: 2,  priceModifier: 0 },
  { id: "4m",  label: "4 Module",  sizeNum: 3, cols: 2, rows: 2, totalModules: 4,  priceModifier: 800 },
  { id: "6m",  label: "6 Module",  sizeNum: 4, cols: 3, rows: 2, totalModules: 6,  priceModifier: 1600 },
  { id: "8m",  label: "8 Module",  sizeNum: 5, cols: 4, rows: 2, totalModules: 8,  priceModifier: 2400 },
  { id: "12m", label: "12 Module", sizeNum: 7, cols: 4, rows: 3, totalModules: 12, priceModifier: 3800 },
];

export const ACCESSORIES_2M: AccessoryOption[] = [
  { id: "2sw",      modularSize: 2, name: "2 Switch",             slots: 2, priceModifier: 0 },
  { id: "2sw1hv",   modularSize: 2, name: "2 Switch 1 HV",        slots: 2, priceModifier: 200 },
  { id: "2tw",      modularSize: 2, name: "2 TW",                 slots: 2, priceModifier: 150 },
  { id: "2hv",      modularSize: 2, name: "2 HV",                 slots: 2, priceModifier: 300 },
  { id: "bell",     modularSize: 2, name: "Bell",                 slots: 1, priceModifier: 100 },
  { id: "curtain",  modularSize: 2, name: "Curtain",              slots: 2, priceModifier: 250 },
  { id: "3pin",     modularSize: 2, name: "3 Pin Socket",         slots: 1, priceModifier: 150 },
  { id: "usocket",  modularSize: 2, name: "Universal Socket",     slots: 1, priceModifier: 200 },
  { id: "16a",      modularSize: 2, name: "16A Socket",           slots: 1, priceModifier: 350 },
  { id: "dimmer",   modularSize: 2, name: "2 Dimmer (Phase Cut)", slots: 2, priceModifier: 500 },
  { id: "scene4",   modularSize: 2, name: "4 Scene Controller",   slots: 4, priceModifier: 600 },
  { id: "4sw2m",    modularSize: 2, name: "4 Switch (2-Module)",  slots: 4, priceModifier: 0 },
  { id: "2curtain", modularSize: 2, name: "2 Curtain",            slots: 2, priceModifier: 400 },
];

export const ACCESSORIES_4M: AccessoryOption[] = [
  { id: "4sw",      modularSize: 4, name: "4 Switch",             slots: 4, priceModifier: 0 },
  { id: "4sw2hv",   modularSize: 4, name: "4 Switch 2 HV",        slots: 4, priceModifier: 400 },
  { id: "4dimmer",  modularSize: 4, name: "4 Dimmer",             slots: 4, priceModifier: 900 },
  { id: "scene8",   modularSize: 4, name: "8 Scene Controller",   slots: 8, priceModifier: 1100 },
  { id: "4socket",  modularSize: 4, name: "4 Socket",             slots: 4, priceModifier: 600 },
  { id: "mix4",     modularSize: 4, name: "2 Switch + 2 Socket",  slots: 4, priceModifier: 350 },
  { id: "fan4m",    modularSize: 4, name: "Fan + 3 Switch",       slots: 4, priceModifier: 500 },
];

export const ICON_CATEGORIES = [
  "Accessories","Lamp","Lighting","Fan","Scene","Appliances","Numbers","COB Lights","BLDC Fan","My Icons"
];

// SVG paths use 24x24 viewBox, currentColor, stroke-based
export const ICONS: IconItem[] = [
  // Accessories
  { id:"socket-3pin",  name:"3 Pin Socket",  category:"Accessories", svg:`<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M9 15h6"/>` },
  { id:"socket-16a",   name:"16A Socket",    category:"Accessories", svg:`<rect x="2" y="4" width="20" height="16" rx="3"/><circle cx="8" cy="10" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/><rect x="10" y="14" width="4" height="2" rx="1" fill="currentColor"/>` },
  { id:"usb-port",     name:"USB",           category:"Accessories", svg:`<path d="M12 2v12M8 10l4 4 4-4"/><path d="M6 14h12a2 2 0 0 1 0 4H6a2 2 0 0 1 0-4z"/>` },
  { id:"dimmer-icon",  name:"Dimmer",        category:"Accessories", svg:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M9 3.6A9 9 0 0 0 3.6 9"/>` },
  { id:"ev-charge",    name:"EV Charger",    category:"Accessories", svg:`<path d="M5 8h14M5 12h14M9 16h6"/><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M18 4V2M22 8l-4-4"/>` },
  { id:"plug",         name:"Plug",          category:"Accessories", svg:`<path d="M7 2v5M17 2v5M6 7h12l-1 8H7L6 7z"/><path d="M9 15v5M15 15v5"/>` },
  { id:"bell-icon",    name:"Bell",          category:"Accessories", svg:`<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>` },
  { id:"curtain-icon", name:"Curtain",       category:"Accessories", svg:`<path d="M2 3h20M2 21h20"/><path d="M12 3v18M6 3c0 5 3 7 6 9-3 2-6 4-6 9M18 3c0 5-3 7-6 9 3 2 6 4 6 9"/>` },
  // Lamp
  { id:"bulb",         name:"Bulb",          category:"Lamp", svg:`<path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>` },
  { id:"table-lamp",   name:"Table Lamp",    category:"Lamp", svg:`<path d="M12 2L6 13h12L12 2z"/><line x1="9" y1="13" x2="9" y2="19"/><line x1="15" y1="13" x2="15" y2="19"/><line x1="6" y1="19" x2="18" y2="19"/>` },
  { id:"floor-lamp",   name:"Floor Lamp",    category:"Lamp", svg:`<path d="M12 3L7 14h10L12 3z"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>` },
  { id:"pendant",      name:"Pendant",       category:"Lamp", svg:`<line x1="12" y1="2" x2="12" y2="6"/><circle cx="12" cy="10" r="4"/><path d="M9 18h6M10 22h4"/>` },
  // Lighting
  { id:"ceiling-light",name:"Ceiling Light", category:"Lighting", svg:`<path d="M8 16h8l-1-7H9l-1 7z"/><path d="M6 16h12M9 20h6M12 2v3M6 6l2 2M18 6l-2 2"/>` },
  { id:"spotlight",    name:"Spotlight",     category:"Lighting", svg:`<circle cx="12" cy="11" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>` },
  { id:"strip-light",  name:"LED Strip",     category:"Lighting", svg:`<rect x="2" y="10" width="20" height="4" rx="2"/><circle cx="6" cy="12" r="1" fill="currentColor"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/>` },
  { id:"wall-light",   name:"Wall Light",    category:"Lighting", svg:`<path d="M4 12h16M4 6h8a4 4 0 0 1 4 4v1"/><path d="M4 18h8a4 4 0 0 0 4-4v-1"/>` },
  // Fan
  { id:"fan",          name:"Fan",           category:"Fan", svg:`<circle cx="12" cy="12" r="2"/><path d="M12 10a3 3 0 0 1 3-3c1.5 0 2.5 1 2.5 2.5 0 1-.5 2-1.5 2.5"/><path d="M14 12a3 3 0 0 1 3 3c0 1.5-1 2.5-2.5 2.5-1 0-2-.5-2.5-1.5"/><path d="M12 14a3 3 0 0 1-3 3c-1.5 0-2.5-1-2.5-2.5 0-1 .5-2 1.5-2.5"/><path d="M10 12a3 3 0 0 1-3-3c0-1.5 1-2.5 2.5-2.5 1 0 2 .5 2.5 1.5"/>` },
  { id:"ceiling-fan",  name:"Ceiling Fan",   category:"Fan", svg:`<circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M18.36 5.64l-2.83 2.83M8.46 15.54l-2.83 2.83"/>` },
  { id:"exhaust-fan",  name:"Exhaust Fan",   category:"Fan", svg:`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>` },
  // Scene
  { id:"scene",        name:"Scene",         category:"Scene", svg:`<path d="M12 3l1.9 5.87H20l-5 3.63 1.9 5.87L12 15l-4.9 3.37L9 12.5 4 8.87h6.1L12 3z"/>` },
  { id:"sunset",       name:"Sunset",        category:"Scene", svg:`<path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/>` },
  { id:"moon",         name:"Night Mode",    category:"Scene", svg:`<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>` },
  { id:"movie",        name:"Movie Mode",    category:"Scene", svg:`<rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>` },
  // Appliances
  { id:"ac",           name:"AC",            category:"Appliances", svg:`<rect x="2" y="6" width="20" height="10" rx="2"/><path d="M7 16v4M17 16v4M2 11h20"/><path d="M6 11v1M10 11v1M14 11v1M18 11v1"/>` },
  { id:"washing",      name:"Washing Machine",category:"Appliances", svg:`<rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/><path d="M5 6h1M8 6h1"/>` },
  { id:"tv",           name:"TV",            category:"Appliances", svg:`<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/>` },
  { id:"fridge",       name:"Refrigerator",  category:"Appliances", svg:`<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="10" y1="5" x2="10" y2="9"/><line x1="10" y1="13" x2="10" y2="18"/>` },
  { id:"microwave",    name:"Microwave",     category:"Appliances", svg:`<rect x="2" y="4" width="20" height="16" rx="2"/><rect x="6" y="8" width="12" height="8" rx="1"/><circle cx="18" cy="6" r="1" fill="currentColor"/>` },
  { id:"geyser",       name:"Geyser",        category:"Appliances", svg:`<rect x="8" y="2" width="8" height="16" rx="2"/><path d="M8 18h8M12 18v4M6 8H4a2 2 0 0 0 0 4h2M18 8h2a2 2 0 0 1 0 4h-2"/>` },
  // Numbers
  ...[1,2,3,4,5,6,7,8,9,0].map(n => ({
    id: `num-${n}`, name: `${n}`, category: "Numbers",
    svg: `<text x="12" y="17" text-anchor="middle" font-size="14" font-weight="bold" fill="currentColor">${n}</text>`
  })),
  // COB Lights
  { id:"cob-round",    name:"COB Round",     category:"COB Lights", svg:`<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>` },
  { id:"cob-square",   name:"COB Square",    category:"COB Lights", svg:`<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/><rect x="10" y="10" width="4" height="4" fill="currentColor"/>` },
  { id:"cob-strip",    name:"COB Strip",     category:"COB Lights", svg:`<rect x="2" y="8" width="20" height="8" rx="3"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="10" cy="12" r="1.5" fill="currentColor"/><circle cx="14" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/>` },
  // BLDC Fan
  { id:"bldc-fan",     name:"BLDC Fan",      category:"BLDC Fan", svg:`<circle cx="12" cy="12" r="2"/><path d="M12 10c0-3-2-5-4-5s-3 2-1 4"/><path d="M14 12c3 0 5-2 5-4s-2-3-4-1"/><path d="M12 14c0 3 2 5 4 5s3-2 1-4"/><path d="M10 12c-3 0-5 2-5 4s2 3 4 1"/>` },
  { id:"bldc-remote",  name:"BLDC Remote",   category:"BLDC Fan", svg:`<rect x="8" y="2" width="8" height="20" rx="3"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/><line x1="10" y1="13" x2="14" y2="13"/><line x1="10" y1="16" x2="14" y2="16"/>` },
  // My Icons placeholder
  { id:"custom-upload",name:"Upload Custom", category:"My Icons", svg:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>` },
];

export const MATERIAL_COLORS: ColorOption[] = [
  { id: "black",      name: "Black",      hex: "#1a1a1a", type: "material" },
  { id: "white",      name: "White",      hex: "#f5f5f5", type: "material" },
  { id: "grey",       name: "Grey",       hex: "#9e9e9e", type: "material" },
  { id: "royal-blue", name: "Royal Blue", hex: "#2c4de0", type: "material" },
  { id: "gold",       name: "Gold",       hex: "#D4AF37", type: "material" },
  { id: "light-gray", name: "Light Gray", hex: "#d0d0d0", type: "material" },
];

export const FRAME_COLORS: ColorOption[] = [
  { id: "f-black",    name: "Black",      hex: "#1a1a1a", type: "frame" },
  { id: "f-white",    name: "White",      hex: "#f5f5f5", type: "frame" },
  { id: "f-gold",     name: "Gold",       hex: "#D4AF37", type: "frame" },
  { id: "f-silver",   name: "Silver",     hex: "#c0c0c0", type: "frame" },
  { id: "f-champagne",name: "Champagne",  hex: "#e8d8a0", type: "frame" },
  { id: "f-gunmetal", name: "Gunmetal",   hex: "#3a3a3a", type: "frame" },
];

export const TECHNOLOGIES: TechnologyOption[] = [
  { id: "remote",  name: "Remote Based", description: "RF remote control, no internet needed",          priceModifier: 0 },
  { id: "tuya",    name: "Tuya",         description: "WiFi smart control via Tuya / Smart Life app",   priceModifier: 800 },
  { id: "zigbee",  name: "Zigbee",       description: "Zigbee mesh protocol, works with Home Assistant", priceModifier: 1200 },
];

// Utility
export function getPanelById(id: string): PanelOption | undefined {
  return PANELS.find(p => p.id === id);
}
export function getSizeById(id: string): SizeOption | undefined {
  return SIZES.find(s => s.id === id);
}
export function getAccessoryById(id: string): AccessoryOption | undefined {
  return [...ACCESSORIES_2M, ...ACCESSORIES_4M].find(a => a.id === id);
}
export function getMaterialColorById(id: string): ColorOption | undefined {
  return MATERIAL_COLORS.find(c => c.id === id);
}
export function getTechById(id: string): TechnologyOption | undefined {
  return TECHNOLOGIES.find(t => t.id === id);
}

export function calculatePrice(state: {
  panel: string | null;
  material: string | null;
  size: string | null;
  accessory: string | null;
  technology: string | null;
  qty: number;
}): { base: number; gst: number; total: number } {
  const panel = PANELS.find(p => p.id === state.panel);
  const size = SIZES.find(s => s.id === state.size);
  const acc = [...ACCESSORIES_2M, ...ACCESSORIES_4M].find(a => a.id === state.accessory);
  const tech = TECHNOLOGIES.find(t => t.id === state.technology);
  const mat = MATERIALS.find(m => m.id === state.material);

  const base =
    ((panel?.basePrice ?? 0) +
    (size?.priceModifier ?? 0) +
    (acc?.priceModifier ?? 0) +
    (tech?.priceModifier ?? 0) +
    (mat?.priceModifier ?? 0)) * state.qty;

  const gst = Math.round(base * 0.18 * 10) / 10;
  return { base, gst, total: base + gst };
}

// Re-export type for convenience
export type { ColorOption };
