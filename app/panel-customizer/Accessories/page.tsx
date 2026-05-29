"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

// ======================================================
// MODULE DATABASE
// ======================================================

const MODULE_DATABASE: Record<
  number,
  { id: string; name: string; size: number }[]
> = {
  1: [
    { id: "1m-tel", name: "Telephone (RJ11)", size: 1 },
    { id: "1m-eth", name: "Ethernet (RJ45)", size: 1 },
    { id: "1m-tv", name: "TV Socket", size: 1 },
  ],
  2: [
    { id: "2m-2sw", name: "2 Switch", size: 2 },
    { id: "2m-2sw1hv", name: "2 Switch 1 HV", size: 2 },
    { id: "2m-hv", name: "2 HV", size: 2 },
    { id: "2m-curtain", name: "Curtain", size: 2 },
    { id: "2m-16a", name: "16A Socket", size: 2 },
    { id: "2m-usb", name: "USB Type-C", size: 2 },
  ],
  4: [
    { id: "4m-4sw", name: "4 Switch", size: 4 },
    { id: "4m-4sw1fan", name: "4 Switch + 1 Fan", size: 4 },
    { id: "4m-6sw", name: "6 Switch", size: 4 },
  ],
  6: [
    { id: "6m-8sw", name: "8 Switch", size: 6 },
    { id: "6m-6sw1fan", name: "6 Switch + 1 Fan", size: 6 },
  ],
  8: [
    { id: "8m-10sw", name: "10 Switch", size: 8 },
  ],
};

// ======================================================
// COLOR THEMES
// ======================================================

const FRAME_COLOR_MAP: Record<
  string,
  { background: string; border: string; glow: string }
> = {
  "frm-black": {
    background: "#0A0A0A",
    border: "#1A1A1A",
    glow: "rgba(255,255,255,0.08)",
  },
  "frm-gold": {
    background: "linear-gradient(135deg, #E6C27A 0%, #D4AF37 50%, #997A15 100%)",
    border: "#D4AF37",
    glow: "rgba(212,175,55,0.25)",
  },
  "frm-silver": {
    background: "linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)",
    border: "#9CA3AF",
    glow: "rgba(255,255,255,0.18)",
  },
  "frm-bronze": {
    background: "#4A3B32",
    border: "#3A2A22",
    glow: "rgba(120,90,70,0.25)",
  },
};

const MATERIAL_COLOR_MAP: Record<
  string,
  { background: string; border: string; text: string; module: string }
> = {
  "mat-black": {
    background: "#111111",
    border: "#222222",
    text: "#ffffff",
    module: "rgba(255,255,255,0.05)",
  },
  "mat-white": {
    background: "#F8F8F8",
    border: "#E5E5E5",
    text: "#000000",
    module: "rgba(0,0,0,0.04)",
  },
  "mat-grey": {
    background: "#4B5563",
    border: "#374151",
    text: "#ffffff",
    module: "rgba(255,255,255,0.04)",
  },
  "mat-blue": {
    background: "#1D4ED8",
    border: "#1E3A8A",
    text: "#ffffff",
    module: "rgba(255,255,255,0.04)",
  },
  "mat-gold": {
    background: "#D4AF37",
    border: "#B4952F",
    text: "#000000",
    module: "rgba(0,0,0,0.05)",
  },
  "mat-lightgray": {
    background: "#D1D5DB",
    border: "#9CA3AF",
    text: "#000000",
    module: "rgba(0,0,0,0.04)",
  },
};

// ======================================================
// ICONS — full set covering every module type
// ======================================================

const getModuleIcon = (name: string, iconColor: string) => {
  const n = name.toLowerCase();

  // Switch variants
  if (n.includes("switch")) {
    const count = n.includes("10")
      ? 10
      : n.includes("8")
      ? 8
      : n.includes("6")
      ? 6
      : n.includes("4")
      ? 4
      : n.includes("2")
      ? 2
      : 1;

    // Render a grid of toggle dots scaled to count
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
              <rect
                x={cx - 4}
                y={cy - 2}
                width="8"
                height="4"
                rx="2"
                fill="none"
                stroke={iconColor}
                strokeWidth="1"
              />
              <circle cx={cx + 1.5} cy={cy} r="1.2" fill={iconColor} />
            </g>
          );
        })}
      </svg>
    );
  }

  // Fan
  if (n.includes("fan")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
        <circle cx="12" cy="12" r="2" fill={iconColor} stroke="none" />
        <path d="M12 10C12 7 14 4 12 2C10 4 10 7 12 10Z" />
        <path d="M14 12C17 12 20 10 22 12C20 14 17 14 14 12Z" />
        <path d="M12 14C12 17 10 20 12 22C14 20 14 17 12 14Z" />
        <path d="M10 12C7 12 4 14 2 12C4 10 7 10 10 12Z" />
      </svg>
    );
  }

  // USB / Socket with USB label
  if (n.includes("usb")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
        <rect x="7" y="7" width="10" height="7" rx="1.5" />
        <path d="M9 7V5M15 7V5" strokeLinecap="round" />
        <path d="M12 14v3" strokeLinecap="round" />
        <path d="M9 17h6" strokeLinecap="round" />
      </svg>
    );
  }

  // 16A / HV socket
  if (n.includes("16a") || (n.includes("hv") && !n.includes("switch"))) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <circle cx="9" cy="10" r="1.5" fill={iconColor} stroke="none" />
        <circle cx="15" cy="10" r="1.5" fill={iconColor} stroke="none" />
        <rect x="9" y="13.5" width="6" height="2.5" rx="1" fill={iconColor} stroke="none" />
      </svg>
    );
  }

  // 2 HV (2 round pin sockets)
  if (n.includes("2 hv") || n === "2 hv") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
        <rect x="2" y="5" width="9" height="14" rx="2.5" />
        <circle cx="6.5" cy="10" r="1.2" fill={iconColor} stroke="none" />
        <circle cx="6.5" cy="14" r="1.2" fill={iconColor} stroke="none" />
        <rect x="13" y="5" width="9" height="14" rx="2.5" />
        <circle cx="17.5" cy="10" r="1.2" fill={iconColor} stroke="none" />
        <circle cx="17.5" cy="14" r="1.2" fill={iconColor} stroke="none" />
      </svg>
    );
  }

  // Curtain / Blinds
  if (n.includes("curtain")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
        <path d="M3 4h18" strokeLinecap="round" />
        <path d="M12 4v3" strokeLinecap="round" />
        <path d="M5 7C5 13 3 16 3 20" strokeLinecap="round" />
        <path d="M19 7C19 13 21 16 21 20" strokeLinecap="round" />
        <path d="M5 7C7 9 12 7 12 7C12 7 17 9 19 7" strokeLinecap="round" />
        <path d="M5 20h14" strokeLinecap="round" strokeDasharray="2 2" />
        {/* up/down arrows */}
        <path d="M11 15l1-1.5 1 1.5M11 17l1 1.5 1-1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Telephone / RJ11
  if (n.includes("telephone") || n.includes("rj11")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Ethernet / RJ45
  if (n.includes("ethernet") || n.includes("rj45")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
        <rect x="5" y="8" width="14" height="10" rx="1.5" />
        <path d="M8 8V5M12 8V5M16 8V5" strokeLinecap="round" />
        <path d="M8 14v2M12 14v2M16 14v2" strokeLinecap="round" />
      </svg>
    );
  }

  // TV Socket
  if (n.includes("tv")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M8 8L12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="14.5" r="2.5" />
        <path d="M12 12v-1M12 18v-1M9.5 14.5h-1M15.5 14.5h-1" strokeLinecap="round" />
      </svg>
    );
  }

  // Fallback — lightning bolt
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ======================================================
// TYPES
// ======================================================

type SelectedModule = {
  instanceId: string;
  id: string;
  name: string;
  size: number;
};

// ======================================================
// MAIN
// ======================================================

function AccessoriesConfigurator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL DATA
  const model = searchParams.get("model") || "6-gang";
  const material = searchParams.get("material") || "glass";
  const frameColor = searchParams.get("frameColor") || "frm-black";
  const materialColor = searchParams.get("materialColor") || "mat-black";

  // THEMES
  const frameTheme = FRAME_COLOR_MAP[frameColor] || FRAME_COLOR_MAP["frm-black"];
  const materialTheme = MATERIAL_COLOR_MAP[materialColor] || MATERIAL_COLOR_MAP["mat-black"];
  const iconColor = materialColor === "mat-white" ? "#111" : "#00E5FF";

  // PANEL SIZE
  const panelSize = useMemo(() => {
    const extracted = parseInt(model.split("-")[0]);
    return isNaN(extracted) ? 6 : extracted;
  }, [model]);

  // STATE
  const [activeTab, setActiveTab] = useState(1);
  const [selectedModules, setSelectedModules] = useState<SelectedModule[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // SLOTS
  const slotsUsed = selectedModules.reduce((acc, mod) => acc + mod.size, 0);
  const slotsRemaining = panelSize - slotsUsed;

  // TABS
  const availableTabs = [1, 2, 4, 6, 8].filter((size) => size <= panelSize);

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [panelSize]);

  // ADD MODULE
  const handleAddModule = (module: { id: string; name: string; size: number }) => {
    if (slotsRemaining >= module.size) {
      setSelectedModules((prev) => [
        ...prev,
        { ...module, instanceId: crypto.randomUUID() },
      ]);
    }
  };

  // REMOVE
  const handleRemoveModule = (instanceId: string) => {
    setSelectedModules((prev) => prev.filter((m) => m.instanceId !== instanceId));
  };

  // CLEAR
  const handleClearAll = () => setSelectedModules([]);

  // CONTINUE
  const handleContinue = () => {
    setIsNavigating(true);
    const configData = encodeURIComponent(JSON.stringify(selectedModules));
    router.push(
      `/panel-customizer/summary?model=${model}&material=${material}&materialColor=${materialColor}&frameColor=${frameColor}&config=${configData}`
    );
  };

  // ======================================================
  // GRID LAYOUT
  // Build a flat array of slots. Each entry is either:
  //   { mod, isFirst: true }  — render this cell with icon + controls
  //   { mod, isFirst: false } — skip (return null), first cell spans it
  //   null                    — empty slot
  // ======================================================

  const columns = Math.max(1, Math.ceil(panelSize / 2));
  const rows = 2;
  const totalGridSlots = columns * rows;

  // Fill slots
  const gridSlots: (SelectedModule | null)[] = Array(totalGridSlots).fill(null);
  let currentIndex = 0;
  selectedModules.forEach((mod) => {
    while (currentIndex < totalGridSlots && gridSlots[currentIndex] !== null) {
      currentIndex++;
    }
    if (currentIndex < totalGridSlots) {
      for (let i = 0; i < mod.size; i++) {
        if (currentIndex + i < totalGridSlots) {
          gridSlots[currentIndex + i] = mod;
        }
      }
      currentIndex += mod.size;
    }
  });

  // Next empty slot index (for placeholder dot)
  const nextEmptyIndex = gridSlots.findIndex((s) => s === null);

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
        .xerovolt-card { transition: all 0.2s ease; }
        .xerovolt-card:hover:not(.disabled) {
          transform: translateY(-2px);
          border-color: #555 !important;
          background: linear-gradient(145deg, #151515 0%, #0a0a0a 100%) !important;
        }
        .xerovolt-card.disabled { opacity: 0.3; cursor: not-allowed; }
        .module-scroll::-webkit-scrollbar { width: 4px; }
        .module-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .panel-cell {
          transition: all 0.25s ease;
        }
        .panel-cell:hover .remove-btn { opacity: 1 !important; }
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
        <nav
          style={{
            padding: "20px 40px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#080808",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "2px" }}>
            XERO<span style={{ color: "#D4AF37" }}>VOLT</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: "#555" }}>Panel</span>
            <span style={{ color: "#444" }}>—</span>
            <span style={{ color: "#D4AF37" }}>Accessories</span>
          </div>
        </nav>

        {/* MAIN */}
        <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* ==================== LEFT PANEL ==================== */}
          <div
            style={{
              width: "420px",
              background: "#0a0a0a",
              borderRight: "1px solid #1a1a1a",
              padding: "40px 32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 300, marginBottom: "8px" }}>
                Configure <strong>Modules</strong>
              </h1>
              <p style={{ color: "#777", fontSize: "14px" }}>
                Capacity{" "}
                <strong>
                  {slotsUsed} / {panelSize}
                </strong>
              </p>
            </div>

            {/* TABS */}
            <div
              style={{
                display: "flex",
                gap: "24px",
                borderBottom: "1px solid #222",
                marginBottom: "24px",
              }}
            >
              {availableTabs.map((size) => (
                <button
                  key={size}
                  onClick={() => setActiveTab(size)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0 0 10px 0",
                    fontSize: "14px",
                    color: activeTab === size ? "#D4AF37" : "#777",
                    borderBottom:
                      activeTab === size ? "2px solid #D4AF37" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {size}M
                </button>
              ))}
            </div>

            {/* MODULE CARDS */}
            <div
              className="module-scroll"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              {MODULE_DATABASE[activeTab]?.map((module) => {
                const cannotFit = module.size > slotsRemaining;
                return (
                  <div
                    key={module.id}
                    onClick={() => !cannotFit && handleAddModule(module)}
                    className={`xerovolt-card ${cannotFit ? "disabled" : ""}`}
                    style={{
                      background: "#111",
                      border: "1px solid #222",
                      borderRadius: "10px",
                      padding: "16px 12px",
                      cursor: cannotFit ? "not-allowed" : "pointer",
                      textAlign: "center",
                    }}
                  >
                    {/* mini icon preview */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "8px",
                        opacity: cannotFit ? 0.3 : 0.7,
                      }}
                    >
                      {getModuleIcon(module.name, "#00E5FF")}
                    </div>
                    <div style={{ fontSize: "10px", color: "#666", marginBottom: "6px" }}>
                      {module.size} MODULAR
                    </div>
                    <div style={{ fontSize: "13px", lineHeight: 1.4, color: "#ccc" }}>
                      {module.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== RIGHT: LIVE VISUALIZER ==================== */}
          <div
            style={{
              flex: 1,
              position: "relative",
              background: "linear-gradient(180deg, #0f0f0f 0%, #050505 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              overflow: "hidden",
            }}
          >
            {/* Ambient Glow */}
            <div
              style={{
                position: "absolute",
                width: "700px",
                height: "420px",
                background: frameTheme.glow,
                filter: "blur(180px)",
                opacity: 0.35,
                pointerEvents: "none",
              }}
            />

            {/* Top Label */}
            <div
              style={{
                fontSize: "11px",
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "40px",
                position: "relative",
                zIndex: 2,
              }}
            >
              Live Panel Preview
            </div>

            {/* ==================== PANEL ==================== */}
            <div
              style={{
                width: "100%",
                maxWidth: `${columns * 120 + 36}px`,
                transition: "all 0.4s ease",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* OUTER FRAME */}
              <div
                style={{
                  width: "100%",
                  padding: "4px",
                  background: frameTheme.background,
                  border: `1px solid ${frameTheme.border}`,
                  borderRadius: "18px",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.35s ease",
                }}
              >
                {/* Metallic Reflection */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.12), transparent 30%)",
                    pointerEvents: "none",
                  }}
                />

                {/* INNER MATERIAL SURFACE */}
                <div
                  style={{
                    width: "100%",
                    borderRadius: "14px",
                    background: materialTheme.background,
                    border: `1px solid ${materialTheme.border}`,
                    padding: "18px",
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: "repeat(2, 1fr)",
                    gap: "12px",
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: panelSize >= 12 ? "1.9" : "2.2",
                  }}
                >
                  {/* Glass Reflection */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* ==================== MODULE CELLS ==================== */}
                  {gridSlots.map((mod, index) => {
                    const firstIndex = mod
                      ? gridSlots.findIndex((s) => s?.instanceId === mod.instanceId)
                      : -1;
                    const isFirstSlot = firstIndex === index;

                    // Skip duplicate cells — the first cell spans them via gridColumn
                    if (mod && !isFirstSlot) return null;

                    const isNextEmpty = !mod && index === nextEmptyIndex;

                    return (
                      <div
                        key={index}
                        className="panel-cell"
                        style={{
                          borderRadius: "8px",
                          background: mod
                            ? materialTheme.module
                            : materialColor === "mat-white"
                            ? "rgba(0,0,0,0.03)"
                            : "rgba(255,255,255,0.03)",
                          border:
                            materialColor === "mat-white"
                              ? "1px solid rgba(0,0,0,0.05)"
                              : "1px solid rgba(255,255,255,0.05)",
                          boxShadow: mod
                            ? "inset 0 2px 8px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)"
                            : "none",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                          transition: "all 0.25s ease",
                          // KEY FIX: span multiple columns for multi-slot modules
                          gridColumn: mod ? `span ${mod.size}` : "span 1",
                        }}
                      >
                        {/* MODULE ICON — always shown since isFirstSlot is always true here */}
                        {mod && (
                          <div
                            style={{
                              opacity: 0.9,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {getModuleIcon(mod.name, iconColor)}
                          </div>
                        )}

                        {/* MODULE NAME LABEL */}
                        {mod && (
                          <div
                            style={{
                              fontSize: "9px",
                              color: iconColor,
                              opacity: 0.45,
                              marginTop: "5px",
                              textAlign: "center",
                              letterSpacing: "0.3px",
                              lineHeight: 1.3,
                              maxWidth: "90%",
                            }}
                          >
                            {mod.name}
                          </div>
                        )}

                        {/* EMPTY SLOT PLACEHOLDER */}
                        {isNextEmpty && (
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              border:
                                materialColor === "mat-white"
                                  ? "1px solid rgba(0,0,0,0.18)"
                                  : "1px solid rgba(255,255,255,0.25)",
                              borderRadius: "4px",
                              opacity: 0.7,
                            }}
                          />
                        )}

                        {/* LED */}
                        <div
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background:
                              materialColor === "mat-white" ? "#111" : "#00E5FF",
                            position: "absolute",
                            bottom: "8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            opacity: mod ? 1 : 0.25,
                            boxShadow:
                              materialColor === "mat-white"
                                ? "none"
                                : "0 0 8px rgba(0,229,255,0.6)",
                          }}
                        />

                        {/* REMOVE BUTTON */}
                        {mod && (
                          <div
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveModule(mod.instanceId);
                            }}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              background: "rgba(0,0,0,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#ef4444",
                              fontSize: "10px",
                              cursor: "pointer",
                              backdropFilter: "blur(4px)",
                              opacity: 0,
                              transition: "opacity 0.2s ease",
                            }}
                          >
                            ✕
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ==================== ACTIONS ==================== */}
            <div
              style={{
                width: "100%",
                maxWidth: "860px",
                marginTop: "50px",
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* CLEAR */}
              <button
                onClick={handleClearAll}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#ef4444",
                  borderRadius: "8px",
                  padding: "0 20px",
                  height: "42px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Clear
              </button>

              {/* RIGHT ACTIONS */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => router.back()}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "0 24px",
                    height: "42px",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>

                <button
                  onClick={handleContinue}
                  disabled={slotsUsed !== panelSize || isNavigating}
                  style={{
                    background:
                      slotsUsed === panelSize
                        ? frameColor === "frm-gold"
                          ? "linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%)"
                          : "#1976d2"
                        : "#2a2a2a",
                    color: slotsUsed === panelSize ? "#fff" : "#666",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0 34px",
                    height: "42px",
                    fontWeight: 600,
                    cursor: slotsUsed === panelSize ? "pointer" : "not-allowed",
                    transition: "all 0.25s ease",
                  }}
                >
                  {isNavigating ? "Saving..." : "Next"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function AccessoriesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#050505" }} />
      }
    >
      <AccessoriesConfigurator />
    </Suspense>
  );
}