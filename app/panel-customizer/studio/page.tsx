"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FRAME_COLOR_MAP: Record<string, { background: string; border: string; glow: string }> = {
  "frm-black": { background: "#0A0A0A", border: "#1A1A1A", glow: "rgba(255,255,255,0.08)" },
  "frm-gold": { background: "linear-gradient(135deg, #E6C27A 0%, #D4AF37 50%, #997A15 100%)", border: "#D4AF37", glow: "rgba(212,175,55,0.25)" },
  "frm-silver": { background: "linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)", border: "#9CA3AF", glow: "rgba(255,255,255,0.18)" },
  "frm-bronze": { background: "#4A3B32", border: "#3A2A22", glow: "rgba(120,90,70,0.25)" },
};

const MATERIAL_COLOR_MAP: Record<string, { background: string; border: string; text: string; module: string }> = {
  "mat-black": { background: "#111111", border: "#222222", text: "#ffffff", module: "rgba(255,255,255,0.05)" },
  "mat-white": { background: "#F8F8F8", border: "#E5E5E5", text: "#000000", module: "rgba(0,0,0,0.04)" },
  "mat-grey": { background: "#4B5563", border: "#374151", text: "#ffffff", module: "rgba(255,255,255,0.04)" },
  "mat-blue": { background: "#1D4ED8", border: "#1E3A8A", text: "#ffffff", module: "rgba(255,255,255,0.04)" },
  "mat-gold": { background: "#D4AF37", border: "#B4952F", text: "#000000", module: "rgba(0,0,0,0.05)" },
  "mat-lightgray": { background: "#D1D5DB", border: "#9CA3AF", text: "#000000", module: "rgba(0,0,0,0.04)" },
};

const getModuleIcon = (name: string, iconColor: string) => {
  const n = name.toLowerCase();

  if (n.includes("switch")) {
    const count = n.includes("10") ? 10 : n.includes("8") ? 8 : n.includes("6") ? 6 : n.includes("4") ? 4 : n.includes("2") ? 2 : 1;
    const dots = Array.from({ length: Math.min(count, 6) });
    const cols = count <= 2 ? count : count <= 4 ? 2 : 3;
    const rows = Math.ceil(dots.length / cols);
    const spacing = 7;
    const startX = 12 - ((cols - 1) * spacing) / 2;
    const startY = 12 - ((rows - 1) * spacing) / 2;
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        {dots.map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cx = startX + col * spacing;
          const cy = startY + row * spacing;
          return (
            <g key={i}>
              <rect x={cx - 4} y={cy - 2} width="8" height="4" rx="2" fill="none" stroke={iconColor} strokeWidth="1" />
              <circle cx={cx + 1.5} cy={cy} r="1.2" fill={iconColor} />
            </g>
          );
        })}
      </svg>
    );
  }
  if (n.includes("fan")) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <circle cx="12" cy="12" r="2" fill={iconColor} stroke="none" />
      <path d="M12 10C12 7 14 4 12 2C10 4 10 7 12 10Z" />
      <path d="M14 12C17 12 20 10 22 12C20 14 17 14 14 12Z" />
      <path d="M12 14C12 17 10 20 12 22C14 20 14 17 12 14Z" />
      <path d="M10 12C7 12 4 14 2 12C4 10 7 10 10 12Z" />
    </svg>
  );
  if (n.includes("usb")) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <rect x="7" y="7" width="10" height="7" rx="1.5" />
      <path d="M9 7V5M15 7V5" strokeLinecap="round" />
      <path d="M12 14v3" strokeLinecap="round" />
      <path d="M9 17h6" strokeLinecap="round" />
    </svg>
  );
  if (n.includes("16a") || (n.includes("hv") && !n.includes("switch"))) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.5" fill={iconColor} stroke="none" />
      <circle cx="15" cy="10" r="1.5" fill={iconColor} stroke="none" />
      <rect x="9" y="13.5" width="6" height="2.5" rx="1" fill={iconColor} stroke="none" />
    </svg>
  );
  if (n.includes("curtain")) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <path d="M3 4h18" strokeLinecap="round" />
      <path d="M12 4v3" strokeLinecap="round" />
      <path d="M5 7C5 13 3 16 3 20" strokeLinecap="round" />
      <path d="M19 7C19 13 21 16 21 20" strokeLinecap="round" />
      <path d="M5 7C7 9 12 7 12 7C12 7 17 9 19 7" strokeLinecap="round" />
      <path d="M5 20h14" strokeLinecap="round" strokeDasharray="2 2" />
      <path d="M11 15l1-1.5 1 1.5M11 17l1 1.5 1-1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (n.includes("telephone") || n.includes("rj11")) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (n.includes("ethernet") || n.includes("rj45")) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <rect x="5" y="8" width="14" height="10" rx="1.5" />
      <path d="M8 8V5M12 8V5M16 8V5" strokeLinecap="round" />
      <path d="M8 14v2M12 14v2M16 14v2" strokeLinecap="round" />
    </svg>
  );
  if (n.includes("tv")) return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M8 8L12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14.5" r="2.5" />
      <path d="M12 12v-1M12 18v-1M9.5 14.5h-1M15.5 14.5h-1" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

type IconCategory = "lighting" | "climate" | "media" | "blinds" | "power";

interface IconDef {
  id: string;
  name: string;
  category: IconCategory;
  render: (color: string) => React.ReactNode;
}

const ICON_DATABASE: IconDef[] = [
  { id: "icn-1sw",     name: "1 Switch",    category: "lighting", render: (c) => getModuleIcon("1 Switch",   c) },
  { id: "icn-2sw",     name: "2 Switch",    category: "lighting", render: (c) => getModuleIcon("2 Switch",   c) },
  { id: "icn-4sw",     name: "4 Switch",    category: "lighting", render: (c) => getModuleIcon("4 Switch",   c) },
  { id: "icn-6sw",     name: "6 Switch",    category: "lighting", render: (c) => getModuleIcon("6 Switch",   c) },
  { id: "icn-8sw",     name: "8 Switch",    category: "lighting", render: (c) => getModuleIcon("8 Switch",   c) },
  { id: "icn-fan",     name: "Ceiling Fan", category: "climate",  render: (c) => getModuleIcon("Fan",        c) },
  { id: "icn-curtain", name: "Curtains",    category: "blinds",   render: (c) => getModuleIcon("Curtain",    c) },
  { id: "icn-usb",     name: "USB Type-C",  category: "power",    render: (c) => getModuleIcon("USB",        c) },
  { id: "icn-16a",     name: "16A Socket",  category: "power",    render: (c) => getModuleIcon("16a",        c) },
  { id: "icn-2hv",     name: "2 HV Socket", category: "power",    render: (c) => getModuleIcon("2 HV",       c) },
  { id: "icn-tv",      name: "TV Socket",   category: "media",    render: (c) => getModuleIcon("TV",         c) },
  { id: "icn-eth",     name: "Ethernet",    category: "media",    render: (c) => getModuleIcon("Ethernet",   c) },
  { id: "icn-tel",     name: "Telephone",   category: "media",    render: (c) => getModuleIcon("Telephone",  c) },
];

const CATEGORIES = [
  { id: "all",      label: "All Icons" },
  { id: "lighting", label: "Lighting"  },
  { id: "climate",  label: "Climate"   },
  { id: "media",    label: "Media"     },
  { id: "blinds",   label: "Blinds"    },
  { id: "power",    label: "Power"     },
];

type SelectedModule = {
  instanceId: string;
  id: string;
  name: string;
  size: number;
};

function IconSelectorConfigurator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const model         = searchParams.get("model")         || "6-gang";
  const material      = searchParams.get("material")      || "glass";
  const frameColor    = searchParams.get("frameColor")    || "frm-black";
  const materialColor = searchParams.get("materialColor") || "mat-black";
  const configData    = searchParams.get("config")        || "[]";

  const frameTheme    = FRAME_COLOR_MAP[frameColor]    || FRAME_COLOR_MAP["frm-black"];
  const materialTheme = MATERIAL_COLOR_MAP[materialColor] || MATERIAL_COLOR_MAP["mat-black"];
  const uiIconColor   = materialColor === "mat-white" ? "#111" : "#00E5FF";

  const selectedModules: SelectedModule[] = useMemo(() => {
    try { return JSON.parse(decodeURIComponent(configData)); }
    catch { return []; }
  }, [configData]);

  const panelSize = useMemo(() => {
    const extracted = parseInt(model.split("-")[0]);
    return isNaN(extracted) ? 6 : extracted;
  }, [model]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isNavigating,   setIsNavigating]   = useState(false);
  const [draggedIconId,  setDraggedIconId]  = useState<string | null>(null);
  const [iconMapping,    setIconMapping]    = useState<Record<number, string>>({});
  const [hoveredZone,    setHoveredZone]    = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("xerovolt_empty_slot_icons");
    if (saved) {
      try { setIconMapping(JSON.parse(saved)); }
      catch (err) { console.error("Failed to parse icon mapping", err); }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(iconMapping).length > 0) {
      localStorage.setItem("xerovolt_empty_slot_icons", JSON.stringify(iconMapping));
    } else {
      localStorage.removeItem("xerovolt_empty_slot_icons");
    }
  }, [iconMapping]);

  const filteredIcons = activeCategory === "all"
    ? ICON_DATABASE
    : ICON_DATABASE.filter((icon) => icon.category === activeCategory);

  const handleContinue = () => {
    setIsNavigating(true);
    const mappingData = encodeURIComponent(JSON.stringify(iconMapping));
    router.push(
      `/panel-customizer/summary?model=${model}&material=${material}&materialColor=${materialColor}&frameColor=${frameColor}&config=${configData}&icons=${mappingData}`
    );
  };

  const handleDragStart = (e: React.DragEvent, iconId: string) => {
    setDraggedIconId(iconId);
    e.dataTransfer.setData("iconId", iconId);
  };
  const handleDragOver  = (e: React.DragEvent, gridIndex: number) => { e.preventDefault(); setHoveredZone(gridIndex); };
  const handleDragLeave = () => setHoveredZone(null);
  const handleDrop      = (e: React.DragEvent, gridIndex: number) => {
    e.preventDefault();
    setHoveredZone(null);
    const iconId = e.dataTransfer.getData("iconId");
    if (iconId) setIconMapping((prev) => ({ ...prev, [gridIndex]: iconId }));
    setDraggedIconId(null);
  };

  const columns       = Math.max(1, Math.ceil(panelSize / 2));
  const totalGridSlots = columns * 2;

  const gridSlots: (SelectedModule | null)[] = Array(totalGridSlots).fill(null);
  let currentIndex = 0;
  selectedModules.forEach((mod) => {
    while (currentIndex < totalGridSlots && gridSlots[currentIndex] !== null) currentIndex++;
    if (currentIndex < totalGridSlots) {
      for (let i = 0; i < mod.size; i++) {
        if (currentIndex + i < totalGridSlots) gridSlots[currentIndex + i] = mod;
      }
      currentIndex += mod.size;
    }
  });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #050505; }
        .bg-grid {
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
        .icon-card { transition: all 0.25s ease; }
        .icon-card:hover { transform: translateY(-2px); border-color: #555 !important; background: linear-gradient(145deg, #151515 0%, #0a0a0a 100%) !important; }
        .scroll-container::-webkit-scrollbar { width: 4px; }
        .scroll-container::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .drop-zone { transition: all 0.2s ease; }
        .drop-zone.hovered { border-color: #D4AF37 !important; background: rgba(212,175,55,0.1) !important; }
      `}</style>

      <div
        className="bg-grid"
        style={{
          minHeight: "100vh",
          backgroundColor: "#050505",
          backgroundImage: "radial-gradient(circle at 50% 0%, #151515 0%, #030303 80%)",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* NAVBAR */}
        <nav style={{
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#080808",
        }}>
          <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "2px" }}>
            XERO<span style={{ color: "#D4AF37" }}>VOLT</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
            <span style={{ color: "#555" }}>Panel</span>
            <span style={{ color: "#444" }}>—</span>
            <span style={{ color: "#D4AF37" }}>Add Icons to Empty Slots</span>
          </div>
        </nav>

        <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* ── LEFT PANEL ── */}
          <div style={{ width: "380px", background: "#0a0a0a", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column" }}>

            <div style={{ padding: "40px 32px 20px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 300, marginBottom: "8px" }}>
                Drag & Drop <strong>Icons</strong>
              </h1>
              <p style={{ color: "#777", fontSize: "13px", lineHeight: 1.5 }}>
                Fill your remaining empty space by assigning functions to blank slots.
              </p>
            </div>

            {/* CATEGORY TABS */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "0 32px 20px", borderBottom: "1px solid #222" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    background: activeCategory === cat.id ? "#222" : "transparent",
                    color: activeCategory === cat.id ? "#D4AF37" : "#888",
                    border: "none", padding: "8px 12px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* ICON GRID */}
            <div
              className="scroll-container"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px 32px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                alignContent: "start",
              }}
            >
              {filteredIcons.map((icon) => (
                <div
                  key={icon.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, icon.id)}
                  onDragEnd={() => setDraggedIconId(null)}
                  className="icon-card"
                  style={{
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: "10px",
                    padding: "16px 12px",
                    cursor: "grab",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    height: "88px",
                    opacity: draggedIconId === icon.id ? 0.4 : 1,
                  }}
                >
                  <div style={{ pointerEvents: "none", lineHeight: 0 }}>
                    {icon.render("#D4AF37")}
                  </div>
                  <div style={{ fontSize: "11px", color: "#999", textAlign: "center", pointerEvents: "none", lineHeight: 1.3 }}>
                    {icon.name}
                  </div>
                </div>
              ))}
            </div>

          </div>{/* ── END LEFT PANEL ── */}

          {/* ── RIGHT PANEL ── */}
          <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>

            <div style={{ position: "absolute", width: "700px", height: "420px", background: frameTheme.glow, filter: "blur(180px)", opacity: 0.35, pointerEvents: "none" }} />

            <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "40px", zIndex: 2 }}>
              Target Empty Areas
            </div>

            {/* PANEL PREVIEW */}
            <div style={{ width: "100%", maxWidth: `${columns * 120 + 36}px`, zIndex: 2 }}>
              <div style={{ padding: "4px", background: frameTheme.background, border: `1px solid ${frameTheme.border}`, borderRadius: "18px", boxShadow: "0 30px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
                <div style={{
                  width: "100%", borderRadius: "14px", background: materialTheme.background,
                  border: `1px solid ${materialTheme.border}`, padding: "18px",
                  display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gridTemplateRows: "repeat(2, 1fr)", gap: "12px",
                  aspectRatio: panelSize >= 12 ? "1.9" : "2.2",
                }}>
                  {gridSlots.map((mod, index) => {
                    if (mod) {
                      const firstIndex = gridSlots.findIndex((s) => s?.instanceId === mod.instanceId);
                      if (firstIndex !== index) return null;
                      return (
                        <div
                          key={`locked-${index}`}
                          style={{
                            borderRadius: "8px", background: materialTheme.module,
                            border: materialColor === "mat-white" ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.05)",
                            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.22)",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            position: "relative", gridColumn: `span ${mod.size}`,
                            opacity: 0.5, cursor: "not-allowed",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {getModuleIcon(mod.name, uiIconColor)}
                          </div>
                          <div style={{ fontSize: "9px", color: uiIconColor, marginTop: "5px", textAlign: "center" }}>
                            {mod.name}
                          </div>
                        </div>
                      );
                    }

                    const mappedIconId  = iconMapping[index];
                    const mappedIconDef = mappedIconId ? ICON_DATABASE.find(i => i.id === mappedIconId) : null;
                    const isHovered     = hoveredZone === index;

                    return (
                      <div
                        key={`empty-${index}`}
                        className={`drop-zone ${isHovered ? "hovered" : ""}`}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        style={{
                          borderRadius: "8px",
                          background: mappedIconId ? materialTheme.module : "rgba(255,255,255,0.02)",
                          border: mappedIconId || isHovered ? "1px solid #D4AF37" : "1px dashed rgba(255,255,255,0.3)",
                          boxShadow: mappedIconId ? "inset 0 2px 8px rgba(0,0,0,0.22)" : "none",
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          position: "relative", gridColumn: "span 1",
                        }}
                      >
                        {mappedIconDef ? (
                          <div style={{ opacity: 0.9 }}>{mappedIconDef.render(uiIconColor)}</div>
                        ) : (
                          <div style={{ fontSize: "10px", color: "#666", textAlign: "center", padding: "0 10px" }}>
                            Empty Slot<br />(Drop Icon)
                          </div>
                        )}
                        <div style={{
                          width: "4px", height: "4px", borderRadius: "50%",
                          background: mappedIconId ? (materialColor === "mat-white" ? "#111" : "#00E5FF") : "#444",
                          position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)",
                          boxShadow: mappedIconId && materialColor !== "mat-white" ? "0 0 8px rgba(0,229,255,0.6)" : "none",
                        }} />
                        {mappedIconId && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setIconMapping(prev => { const n = { ...prev }; delete n[index]; return n; });
                            }}
                            style={{
                              position: "absolute", top: "4px", right: "4px", width: "16px", height: "16px",
                              borderRadius: "50%", background: "rgba(0,0,0,0.5)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#ef4444", fontSize: "10px", cursor: "pointer", opacity: 0.6,
                            }}
                          >✕</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ width: "100%", maxWidth: "860px", marginTop: "50px", display: "flex", justifyContent: "space-between", zIndex: 2 }}>
              <button
                onClick={() => setIconMapping({})}
                style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "8px", padding: "0 20px", height: "42px", cursor: "pointer", fontWeight: 500 }}
              >
                Clear Icons
              </button>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => router.back()}
                  style={{ background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: "8px", padding: "0 24px", height: "42px", cursor: "pointer" }}
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  disabled={isNavigating}
                  style={{
                    background: "linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%)",
                    color: "#000", border: "none", borderRadius: "8px",
                    padding: "0 34px", height: "42px", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {isNavigating ? "Saving..." : "Next"}
                </button>
              </div>
            </div>

          </div>{/* ── END RIGHT PANEL ── */}

        </main>
      </div>
    </>
  );
}

function IconSelectorPageInner() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#050505" }} />}>
      <IconSelectorConfigurator />
    </Suspense>
  );
}
export default function IconSelectorPage() {
  return (
    <Suspense fallback={<div style={{ background: "#050505", height: "100vh" }} />}>
      <IconSelectorPageInner />
    </Suspense>
  );
}
