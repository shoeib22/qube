// lib/iconLibrary.ts — Xerovolt Built-in SVG Icons

export interface BuiltInIcon {
  id: string;
  name: string;
  category: string;
  svg: string;
}

const icon = (id: string, name: string, category: string, path: string): BuiltInIcon => ({
  id,
  name,
  category,
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`,
});

export const BUILT_IN_ICONS: BuiltInIcon[] = [
  // Lighting
  icon("light-bulb", "Light", "Lighting", '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>'),
  icon("light-strip", "LED Strip", "Lighting", '<rect x="2" y="10" width="20" height="4" rx="2"/><circle cx="6" cy="12" r="1" fill="currentColor"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/>'),
  icon("spotlight", "Spotlight", "Lighting", '<path d="M12 3v1M12 20v1M4.22 4.22l.7.7M19.07 19.07l.71.71M1 12h1M22 12h1M4.22 19.78l.7-.7M19.07 4.93l.71-.71"/><circle cx="12" cy="12" r="4"/><path d="M12 8v8M8 12h8"/>'),
  icon("ceiling-light", "Ceiling Light", "Lighting", '<path d="M12 2v3M6 6l2 2M18 6l-2 2"/><path d="M8 16h8l-1-7H9l-1 7z"/><path d="M6 16h12"/><path d="M9 20h6"/>'),
  icon("dimmer", "Dimmer", "Lighting", '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M9 3.6A9 9 0 0 0 3.6 9"/>'),

  // Climate
  icon("fan", "Fan", "Climate", '<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/><path d="M12 4a3 3 0 0 1 3 3c0 1.5-1 2.5-1 4"/><path d="M20 12a3 3 0 0 1-3 3c-1.5 0-2.5-1-4-1"/><path d="M12 20a3 3 0 0 1-3-3c0-1.5 1-2.5 1-4"/><path d="M4 12a3 3 0 0 1 3-3c1.5 0 2.5 1 4 1"/>'),
  icon("ac", "Air Conditioner", "Climate", '<rect x="2" y="6" width="20" height="10" rx="2"/><path d="M7 16v4M17 16v4M2 11h20"/><path d="M6 11v1M10 11v1M14 11v1M18 11v1"/>'),
  icon("thermostat", "Thermostat", "Climate", '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>'),
  icon("heater", "Heater", "Climate", '<path d="M2 12h2M6 8v8M10 6v12M14 8v8M18 6v12M22 12h-2"/>'),
  icon("exhaust", "Exhaust Fan", "Climate", '<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/><circle cx="12" cy="12" r="3"/>'),

  // Entertainment
  icon("tv", "TV", "Entertainment", '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8M12 18v2"/>'),
  icon("speaker", "Speaker", "Entertainment", '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="6" r="1" fill="currentColor"/>'),
  icon("music", "Music", "Entertainment", '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
  icon("projector", "Projector", "Entertainment", '<path d="M5 7H3a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h2"/><rect x="5" y="5" width="14" height="14" rx="1"/><circle cx="12" cy="12" r="3"/><path d="M19 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>'),

  // Security
  icon("lock", "Lock", "Security", '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
  icon("camera", "Camera", "Security", '<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>'),
  icon("alarm", "Alarm", "Security", '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
  icon("doorbell", "Doorbell", "Security", '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><circle cx="12" cy="14" r="1" fill="currentColor"/>'),

  // Appliances
  icon("socket", "Socket/Outlet", "Appliances", '<rect x="2" y="2" width="20" height="20" rx="4"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="15" cy="10" r="1.5" fill="currentColor"/><path d="M9 15h6"/>'),
  icon("washing", "Washing Machine", "Appliances", '<rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/><path d="M5 6h1M8 6h1"/>'),
  icon("oven", "Oven/Microwave", "Appliances", '<rect x="2" y="4" width="20" height="16" rx="2"/><rect x="6" y="8" width="12" height="8" rx="1"/><circle cx="17" cy="6" r="1" fill="currentColor"/>'),
  icon("curtain", "Curtains", "Appliances", '<path d="M2 3h20M2 21h20"/><path d="M12 3v18M6 3c0 5 3 7 6 9-3 2-6 4-6 9M18 3c0 5-3 7-6 9 3 2 6 4 6 9"/>'),
  icon("garage", "Garage Door", "Appliances", '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><path d="M2 14h20"/><path d="M10 4v16M14 4v16"/>'),

  // Power
  icon("power", "Master Power", "Power", '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>'),
  icon("timer", "Timer Switch", "Power", '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  icon("scene", "Scene", "Power", '<path d="M12 3l1.9 5.87H20l-5 3.63 1.9 5.87L12 15l-4.9 3.37L9 12.5 4 8.87h6.1L12 3z"/>'),
];

export const ICON_CATEGORIES = [...new Set(BUILT_IN_ICONS.map((i) => i.category))];

export function getIconById(id: string): BuiltInIcon | undefined {
  return BUILT_IN_ICONS.find((i) => i.id === id);
}