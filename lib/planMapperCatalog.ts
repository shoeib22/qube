// Xerovolt product catalog and placement guidelines for the Plan Mapper tool.
// Mirrors the standalone Python prototype's catalog.py 1:1 in spirit — sourced
// from Xerovolt's real product lineup (Modular/Premium/Full Glass/Magnetic
// touch panels, Smart Lock, Smart Lighting, Strip Controller, Sensor,
// Motorised curtain controller, Smart QR). Shared between the server route
// (prompt construction) and the client page (marker colors/labels), so it
// must stay free of server-only secrets.

export type ProductCode =
  | "modular_touch"
  | "premium_touch"
  | "full_glass_touch"
  | "magnetic_touch"
  | "smart_lock"
  | "smart_lighting"
  | "strip_controller"
  | "sensor"
  | "motorised"
  | "smart_qr";

export interface ProductMeta {
  label: string;
  short: string;
  color: string; // hex, for CSS
  purpose: string;
}

export const PRODUCTS: Record<ProductCode, ProductMeta> = {
  modular_touch: {
    label: "Modular Touch Panel",
    short: "MT",
    color: "#6495ED",
    purpose:
      "Budget/mid-tier snap-in touch switch panel (Basic/Pro/RF variants). Used for small switch-board points (typically <=4M) -- toilets, utility, store, wardrobes.",
  },
  premium_touch: {
    label: "Premium Touch Panel",
    short: "PT",
    color: "#1E3A8A",
    purpose:
      "Higher-finish touch panel (Acrylic/HD/Metal/Chrome Glass variants). Used for small-to-mid switch-board points in guest-facing areas (entrance/lobby, dress rooms) where finish quality matters more than switch count.",
  },
  full_glass_touch: {
    label: "Full Glass Touch Panel",
    short: "FGT",
    color: "#10B981",
    purpose:
      "Large modular glass panel combining many switches with fan/socket/curtain circuits in one plate (6M-12M+). Used at high-circuit-count switch-board points -- living/family rooms, kitchens, master bedrooms.",
  },
  magnetic_touch: {
    label: "Magnetic Touch Panel",
    short: "MGT",
    color: "#059669",
    purpose:
      "Magnetic modular panel, 4-9 gang combos with fan/HD/socket options. Alternate premium tier for mid-size switch-board points -- secondary bedrooms, dining.",
  },
  smart_lock: {
    label: "Smart Lock",
    short: "SL",
    color: "#7C3AED",
    purpose:
      "Smart Lock Pro/Ultra product line. Fitted on exterior/main entry doors (front door, unit entrance from a shared lobby/lift, patio doors). Not for interior room doors.",
  },
  smart_lighting: {
    label: "Smart Lighting",
    short: "LT",
    color: "#EAB308",
    purpose:
      "Panel Light / Dimmable CCT panel / LED Dimmer Driver. Represents a room's main ceiling \"Light point\" circuit(s) made smart/dimmable -- one marker per room, not per fixture.",
  },
  strip_controller: {
    label: "Strip/Profile Light Controller",
    short: "SC",
    color: "#EC4899",
    purpose:
      "RGBW 12V/24V strip driver or RGBW/CCT controller. Used wherever the plan marks cove/profile lighting (\"PROFILE LIGHT\" runs) or an LED strip.",
  },
  sensor: {
    label: "Sensor",
    short: "SN",
    color: "#EA580C",
    purpose:
      "Microwave Motion Sensor or Sensor Hub (IR + temperature). Drives automation (occupancy lighting, AC control) in hallways and shared living spaces -- not a security camera. Avoid bedrooms/bathrooms.",
  },
  motorised: {
    label: "Motorised Curtain Controller",
    short: "MC",
    color: "#DC2626",
    purpose:
      "Pulse Switch/Curtain Controller. Used in rooms with a curtain circuit already on the switch-board schedule (\"...1 Curtain...\") or with balcony-facing curtained windows -- bedrooms, living hall.",
  },
  smart_qr: {
    label: "Smart QR Product",
    short: "QR",
    color: "#64748B",
    purpose:
      "NFC tag/business card or QR tag. Optional: one at the main entrance for guest Wi-Fi/info tap-on. Not a room-by-room product -- place at most once per home.",
  },
};

export const PLACEMENT_GUIDELINES = `
1. Touch panel family is chosen in two steps, using the switch-board module
   count from the plan (e.g. "(18M) Switch Board @4'6" ht.") only as a signal
   for circuit load, not as a rigid cutoff:
     a. Size class first: a small standalone circuit point (roughly <=4M --
        one toilet, one utility nook) only needs a small panel, never a full
        multi-gang board. A multi-gang board combining several switch/fan/
        socket/curtain circuits (roughly 6M+) needs a large panel.
     b. Within each size class, room prestige picks the specific family:
        - Small point in a purely functional room (toilet, store, utility) ->
          modular_touch (budget/mid-tier).
        - Small point in a guest-facing room (entrance/lobby, dress area)
          where finish quality outweighs switch count -> premium_touch.
        - Large board in a principal/guest-facing room (kitchen, living/
          family hall, primary bedroom, dining) -> full_glass_touch,
          Xerovolt's flagship glass-finish line.
        - Large board in a secondary/private room (secondary bedroom, a
          wardrobe/dress corridor) -> magnetic_touch, a lower-profile
          alternative to the flagship line.
   When no module count is legible at all, default by room type using the
   same two-step logic (e.g. kitchen/living hall -> full_glass_touch, small
   utility rooms -> modular_touch, entrance -> premium_touch).
   Place at most one touch-panel marker per room, at its main switch-board
   location.
2. Smart lock: on every exterior/main entry door only -- the home's front
   door, and the unit's entrance from a shared lift lobby/staircase if that's
   how the home is accessed. Never on interior room doors.
3. Smart lighting: one marker per room that has a ceiling "Light point"
   circuit, at the room's center -- represents that room's lighting made
   smart/dimmable, not each individual fixture.
4. Strip controller: one per distinct "PROFILE LIGHT"/cove-lighting run shown
   on the plan.
5. Sensor: Sensor Hub (IR+temperature) in the main shared living space,
   central to the home, for whole-home automation. Microwave Motion Sensor in
   hallways/entries/lobbies -- shared through-paths only. Never in bedrooms or
   bathrooms.
6. Motorised curtain controller: in rooms whose switch-board schedule already
   includes a curtain circuit, or bedrooms/living areas with balcony-facing
   windows likely to be curtained.
7. Smart QR: optional, at most one NFC tag at the main entrance. Skip it
   entirely unless there's an obvious guest-facing reception point.
8. Only place a product where the plan gives a reasonable basis for it. If a
   room's circuit needs can't be read from the plan, say so in the reasoning
   and make the inferred tier/count explicit rather than guessing silently.
`;

export function describeCatalog(): string {
  return (Object.keys(PRODUCTS) as ProductCode[])
    .map((code) => `- ${code} (${PRODUCTS[code].label}): ${PRODUCTS[code].purpose}`)
    .join("\n");
}
