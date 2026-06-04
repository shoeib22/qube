"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ======================================================
// SHARED CONSTANTS
// ======================================================

const FRAME_COLOR_MAP: Record<string, { background: string; border: string; label: string }> = {
  "frm-black":  { background: "#0A0A0A",                                                              border: "#1A1A1A", label: "Black"  },
  "frm-gold":   { background: "linear-gradient(135deg, #E6C27A 0%, #D4AF37 50%, #997A15 100%)",       border: "#D4AF37", label: "Gold"   },
  "frm-silver": { background: "linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)",                    border: "#9CA3AF", label: "Silver" },
  "frm-bronze": { background: "#4A3B32",                                                              border: "#3A2A22", label: "Bronze" },
};

const MATERIAL_COLOR_MAP: Record<string, { background: string; border: string; text: string; module: string; label: string }> = {
  "mat-black":    { background: "#111111", border: "#222222", text: "#ffffff", module: "rgba(255,255,255,0.05)", label: "Black"      },
  "mat-white":    { background: "#F8F8F8", border: "#E5E5E5", text: "#000000", module: "rgba(0,0,0,0.04)",      label: "White"      },
  "mat-grey":     { background: "#4B5563", border: "#374151", text: "#ffffff", module: "rgba(255,255,255,0.04)", label: "Grey"       },
  "mat-blue":     { background: "#1D4ED8", border: "#1E3A8A", text: "#ffffff", module: "rgba(255,255,255,0.04)", label: "Blue"       },
  "mat-gold":     { background: "#D4AF37", border: "#B4952F", text: "#000000", module: "rgba(0,0,0,0.05)",      label: "Gold"       },
  "mat-lightgray":{ background: "#D1D5DB", border: "#9CA3AF", text: "#000000", module: "rgba(0,0,0,0.04)",      label: "Light Gray" },
};

const MATERIAL_LABEL_MAP: Record<string, string> = {
  glass:    "Glass",
  acrylic:  "Acrylic",
  metal:    "Metal",
  wood:     "Wood",
};

// ======================================================
// ICONS
// ======================================================

const getModuleIcon = (name: string, iconColor: string, size = 24) => {
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
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <circle cx="12" cy="12" r="2" fill={iconColor} stroke="none" />
      <path d="M12 10C12 7 14 4 12 2C10 4 10 7 12 10Z" />
      <path d="M14 12C17 12 20 10 22 12C20 14 17 14 14 12Z" />
      <path d="M12 14C12 17 10 20 12 22C14 20 14 17 12 14Z" />
      <path d="M10 12C7 12 4 14 2 12C4 10 7 10 10 12Z" />
    </svg>
  );
  if (n.includes("usb")) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <rect x="7" y="7" width="10" height="7" rx="1.5" />
      <path d="M9 7V5M15 7V5" strokeLinecap="round" />
      <path d="M12 14v3" strokeLinecap="round" />
      <path d="M9 17h6" strokeLinecap="round" />
    </svg>
  );
  if (n.includes("16a") || (n.includes("hv") && !n.includes("switch"))) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.5" fill={iconColor} stroke="none" />
      <circle cx="15" cy="10" r="1.5" fill={iconColor} stroke="none" />
      <rect x="9" y="13.5" width="6" height="2.5" rx="1" fill={iconColor} stroke="none" />
    </svg>
  );
  if (n.includes("curtain")) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <path d="M3 4h18" strokeLinecap="round" />
      <path d="M12 4v3" strokeLinecap="round" />
      <path d="M5 7C5 13 3 16 3 20" strokeLinecap="round" />
      <path d="M19 7C19 13 21 16 21 20" strokeLinecap="round" />
      <path d="M5 7C7 9 12 7 12 7C12 7 17 9 19 7" strokeLinecap="round" />
      <path d="M11 15l1-1.5 1 1.5M11 17l1 1.5 1-1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (n.includes("telephone") || n.includes("rj11")) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (n.includes("ethernet") || n.includes("rj45")) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <rect x="5" y="8" width="14" height="10" rx="1.5" />
      <path d="M8 8V5M12 8V5M16 8V5" strokeLinecap="round" />
      <path d="M8 14v2M12 14v2M16 14v2" strokeLinecap="round" />
    </svg>
  );
  if (n.includes("tv")) return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M8 8L12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14.5" r="2.5" />
      <path d="M12 12v-1M12 18v-1M9.5 14.5h-1M15.5 14.5h-1" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Map Icon Database for Empty Slots - Updated to accept dynamic sizes
const ICON_DATABASE = [
  { id: "icn-1sw", name: "1 Switch", render: (c: string, s = 24) => getModuleIcon("1 Switch", c, s) },
  { id: "icn-2sw", name: "2 Switch", render: (c: string, s = 24) => getModuleIcon("2 Switch", c, s) },
  { id: "icn-4sw", name: "4 Switch", render: (c: string, s = 24) => getModuleIcon("4 Switch", c, s) },
  { id: "icn-6sw", name: "6 Switch", render: (c: string, s = 24) => getModuleIcon("6 Switch", c, s) },
  { id: "icn-8sw", name: "8 Switch", render: (c: string, s = 24) => getModuleIcon("8 Switch", c, s) },
  { id: "icn-fan", name: "Ceiling Fan", render: (c: string, s = 24) => getModuleIcon("Fan", c, s) },
  { id: "icn-curtain", name: "Curtains", render: (c: string, s = 24) => getModuleIcon("Curtain", c, s) },
  { id: "icn-usb", name: "USB Type-C", render: (c: string, s = 24) => getModuleIcon("USB", c, s) },
  { id: "icn-16a", name: "16A Socket", render: (c: string, s = 24) => getModuleIcon("16a", c, s) },
  { id: "icn-2hv", name: "2 HV Socket", render: (c: string, s = 24) => getModuleIcon("2 HV", c, s) },
  { id: "icn-tv", name: "TV Socket", render: (c: string, s = 24) => getModuleIcon("TV", c, s) },
  { id: "icn-eth", name: "Ethernet", render: (c: string, s = 24) => getModuleIcon("Ethernet", c, s) },
  { id: "icn-tel", name: "Telephone", render: (c: string, s = 24) => getModuleIcon("Telephone", c, s) },
];

// ======================================================
// TYPES
// ======================================================

type ConfigModule = {
  instanceId: string;
  id: string;
  name: string;
  size: number;
};

type ParsedConfig = {
  model: string;
  panelSize: number;
  material: string;
  materialColor: string;
  frameColor: string;
  modules: ConfigModule[];
  iconMapping: Record<number, string>;
};

// ======================================================
// PANEL PREVIEW
// ======================================================

const DynamicPanelPreview = ({
  config,
  isPdf = false,
}: {
  config: ParsedConfig;
  isPdf?: boolean;
}) => {
  const { panelSize, materialColor, frameColor, modules, iconMapping } = config;
  const frameTheme  = FRAME_COLOR_MAP[frameColor]   || FRAME_COLOR_MAP["frm-black"];
  const matTheme    = MATERIAL_COLOR_MAP[materialColor] || MATERIAL_COLOR_MAP["mat-black"];
  const iconColor   = materialColor === "mat-white" ? "#111" : "#00E5FF";

  const columns = Math.max(1, Math.ceil(panelSize / 2));
  const totalGridSlots = columns * 2;

  // Build grid slots for accessories
  const gridSlots: (ConfigModule | null)[] = Array(totalGridSlots).fill(null);
  let idx = 0;
  modules.forEach((mod) => {
    while (idx < totalGridSlots && gridSlots[idx] !== null) idx++;
    if (idx < totalGridSlots) {
      for (let i = 0; i < mod.size; i++) {
        if (idx + i < totalGridSlots) gridSlots[idx + i] = mod;
      }
      idx += mod.size;
    }
  });

  return (
    <div
      style={{
        width: "100%",
        padding: "4px",
        background: frameTheme.background,
        border: `1px solid ${frameTheme.border}`,
        borderRadius: "18px",
        boxShadow: isPdf
          ? "none"
          : "0 30px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.12), transparent 30%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "100%",
          borderRadius: "14px",
          background: matTheme.background,
          border: `1px solid ${matTheme.border}`,
          padding: "18px",
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "10px",
          position: "relative",
          overflow: "hidden",
          aspectRatio: panelSize >= 12 ? "1.9" : "2.2",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%)",
            pointerEvents: "none",
          }}
        />

        {gridSlots.map((mod, index) => {
          const firstIndex = mod ? gridSlots.findIndex((s) => s?.instanceId === mod.instanceId) : -1;
          const isFirstSlot = firstIndex === index;

          if (mod && !isFirstSlot) return null;

          const mappedIconId = !mod ? iconMapping[index] : null;
          const mappedIconDef = mappedIconId ? ICON_DATABASE.find(i => i.id === mappedIconId) : null;
          const isPopulated = mod || mappedIconDef;

          return (
            <div
              key={index}
              style={{
                borderRadius: "7px",
                background: isPopulated
                  ? matTheme.module
                  : materialColor === "mat-white"
                    ? "rgba(0,0,0,0.03)"
                    : "rgba(255,255,255,0.03)",
                border:
                  materialColor === "mat-white"
                    ? "1px solid rgba(0,0,0,0.05)"
                    : "1px solid rgba(255,255,255,0.05)",
                boxShadow: isPopulated
                  ? "inset 0 2px 8px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)"
                  : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                gridColumn: mod ? `span ${mod.size}` : "span 1",
              }}
            >
              {/* Accessory Icon Render */}
              {mod && (
                <>
                  <div style={{ opacity: 0.9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {getModuleIcon(mod.name, iconColor, 24)}
                  </div>
                  <div style={{ fontSize: "8px", color: iconColor, opacity: 0.45, marginTop: "4px", textAlign: "center", letterSpacing: "0.3px", lineHeight: 1.3, maxWidth: "90%" }}>
                    {mod.name}
                  </div>
                </>
              )}

              {/* Mapped Icon Render */}
              {mappedIconDef && (
                <>
                  <div style={{ opacity: 0.9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {mappedIconDef.render(iconColor, 24)}
                  </div>
                  <div style={{ fontSize: "8px", color: iconColor, opacity: 0.45, marginTop: "4px", textAlign: "center", letterSpacing: "0.3px", lineHeight: 1.3, maxWidth: "90%" }}>
                    {mappedIconDef.name}
                  </div>
                </>
              )}

              {/* Empty state placeholder */}
              {!isPopulated && (
                <div style={{
                  width: "20px", height: "20px",
                  border: materialColor === "mat-white" ? "1px solid rgba(0,0,0,0.18)" : "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "4px", opacity: 0.6,
                }} />
              )}
              
              {/* LED */}
              <div style={{
                width: "4px", height: "4px", borderRadius: "50%",
                background: materialColor === "mat-white" ? "#111" : "#00E5FF",
                position: "absolute", bottom: "7px", left: "50%",
                transform: "translateX(-50%)",
                opacity: isPopulated ? 1 : 0.2,
                boxShadow: materialColor === "mat-white" ? "none" : "0 0 8px rgba(0,229,255,0.6)",
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ======================================================
// MAIN PAGE
// ======================================================

function OrderSummaryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }));
  }, []);

  // Parse all settings from the URL parameters with LocalStorage fallbacks
  const config: ParsedConfig = useMemo(() => {
    const model         = searchParams.get("model")         || "6-gang";
    const material      = searchParams.get("material")      || "glass";
    const materialColor = searchParams.get("materialColor") || "mat-black";
    const frameColor    = searchParams.get("frameColor")    || "frm-black";
    const panelSizeRaw  = parseInt(model.split("-")[0]);
    const panelSize     = isNaN(panelSizeRaw) ? 6 : panelSizeRaw;

    // Parse hardware accessories
    let modules: ConfigModule[] = [];
    try {
      const rawConfig = searchParams.get("config");
      if (rawConfig) {
        modules = JSON.parse(rawConfig);
      }
    } catch {
      modules = [];
    }

    // Parse icon mapping (safely handles URL encoding and falls back to local storage if refreshed)
    let iconMapping: Record<number, string> = {};
    try {
      const rawIcons = searchParams.get("icons");
      if (rawIcons && rawIcons !== "{}") {
        iconMapping = JSON.parse(rawIcons);
      } else if (typeof window !== "undefined") {
        const localIcons = localStorage.getItem("xerovolt_empty_slot_icons");
        if (localIcons) {
          iconMapping = JSON.parse(localIcons);
        }
      }
    } catch {
      iconMapping = {};
    }

    return { model, panelSize, material, materialColor, frameColor, modules, iconMapping };
  }, [searchParams]);

  const frameLabel    = FRAME_COLOR_MAP[config.frameColor]?.label        || config.frameColor;
  const matColorLabel = MATERIAL_COLOR_MAP[config.materialColor]?.label  || config.materialColor;
  const matLabel      = MATERIAL_LABEL_MAP[config.material]              || config.material;
  const gangLabel     = `${config.panelSize} Gang`;

  // Calculate Used Slots (Accessories + Selected Icons)
  const slotsUsedByAccessories = config.modules.reduce((a, m) => a + m.size, 0);
  const slotsUsedByIcons = Object.keys(config.iconMapping).length;
  const totalSlotsUsed = slotsUsedByAccessories + slotsUsedByIcons;

  // Combine hardware modules and custom icon mappings into a single list for the summary UI
  const allPopulatedSlots = useMemo(() => {
    const combined = config.modules.map(mod => ({
      id: mod.instanceId,
      size: mod.size,
      name: mod.name,
      render: (c: string) => getModuleIcon(mod.name, c, 18),
      isCustom: false
    }));

    Object.entries(config.iconMapping).forEach(([idx, iconId]) => {
      const def = ICON_DATABASE.find(i => i.id === iconId);
      if (def) {
        combined.push({
          id: `custom-${idx}`,
          size: 1,
          name: def.name,
          render: (c: string) => def.render(c, 18), // Scaled down for list view
          isCustom: true
        });
      }
    });

    return combined;
  }, [config.modules, config.iconMapping]);

  const specs = [
    { label: "Model",          value: gangLabel                    },
    { label: "Material",       value: matLabel                     },
    { label: "Material Color", value: matColorLabel                },
    { label: "Frame Finish",   value: frameLabel                   },
    { label: "Capacity",       value: `${totalSlotsUsed} / ${config.panelSize} slots configured` },
  ];

  // PDF Download Logic
  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF }   = await import("jspdf");

      const el = pdfRef.current;
      el.style.display = "block";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#050505",
      });
      el.style.display = "none";

      const imgData   = canvas.toDataURL("image/png");
      const pdf       = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth  = pdf.internal.pageSize.getWidth();
      const pageH     = pdf.internal.pageSize.getHeight();
      const imgH      = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft  = imgH;
      let position    = 0;

      const paintBg = () => {
        pdf.setFillColor(5, 5, 5);
        pdf.rect(0, 0, pdfWidth, pageH, "F");
      };

      paintBg();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgH);
      heightLeft -= pageH;

      while (heightLeft > 0) {
        position -= pageH;
        pdf.addPage();
        paintBg();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgH);
        heightLeft -= pageH;
      }

      pdf.save("Xerovolt_Order_Summary.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Make sure html2canvas and jspdf are installed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #050505; }
        .summary-card {
          background: linear-gradient(145deg, #111111 0%, #0a0a0a 100%);
          border: 1px solid #1f1f1f;
          border-radius: 16px;
        }
        .action-btn { transition: all 0.3s ease; }
        .action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212,175,55,0.2);
        }
        .module-chip { transition: border-color 0.2s ease; }
        .module-chip:hover { border-color: #D4AF37 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      <div style={{
        display: "flex", flexDirection: "column", minHeight: "100vh",
        backgroundColor: "#050505",
        backgroundImage: "radial-gradient(circle at 50% 0%, #151515 0%, #030303 80%)",
        color: "#e0e0e0",
        fontFamily: "'Inter', sans-serif",
      }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#080808",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "2px", color: "#fff" }}>
            XERO<span style={{ color: "#D4AF37" }}>VOLT</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            fontSize: "11px", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "1px",
          }}>
            {["Panel", "Material", "Accessories", "Engravings", "Summary"].map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 && <span style={{ color: "#333" }}>—</span>}
                <span style={{ color: i === 4 ? "#D4AF37" : "#555" }}>{step}</span>
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* ── MAIN ── */}
        <main style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "60px 24px" }}>

          <div style={{ textAlign: "center", marginBottom: "50px" }} className="fade-in">
            <h1 style={{ fontSize: "36px", fontWeight: 300, color: "#fff", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
              Finalize <strong>Configuration</strong>
            </h1>
            <p style={{ color: "#777", fontSize: "15px", margin: 0 }}>
              Review your {gangLabel} {matLabel} panel before generating your order summary.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>

            {/* ── LEFT: PANEL PREVIEW ── */}
            <div className="summary-card fade-in" style={{ padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{
                fontSize: "11px", color: "#555", textTransform: "uppercase",
                letterSpacing: "2px", marginBottom: "32px",
              }}>
                Live Panel Render
              </div>

              <div style={{ width: "100%", maxWidth: `${Math.ceil(config.panelSize / 2) * 120 + 36}px`, position: "relative" }}>
                <div style={{
                  position: "absolute", inset: "-40px",
                  background: FRAME_COLOR_MAP[config.frameColor]?.border
                    ? `radial-gradient(ellipse at center, ${FRAME_COLOR_MAP[config.frameColor].border}22 0%, transparent 70%)`
                    : "none",
                  pointerEvents: "none",
                }} />
                <DynamicPanelPreview config={config} />
              </div>

              {/* Slot fill indicator */}
              <div style={{ marginTop: "28px", width: "100%", maxWidth: "320px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#555", marginBottom: "8px" }}>
                  <span>Slot utilisation</span>
                  <span style={{ color: totalSlotsUsed === config.panelSize ? "#22c55e" : "#D4AF37" }}>
                    {totalSlotsUsed} / {config.panelSize}
                  </span>
                </div>
                <div style={{ height: "3px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "2px",
                    width: `${(totalSlotsUsed / config.panelSize) * 100}%`,
                    background: totalSlotsUsed === config.panelSize
                      ? "linear-gradient(90deg,#22c55e,#16a34a)"
                      : "linear-gradient(90deg,#D4AF37,#aa8c2c)",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            </div>

            {/* ── RIGHT: SPECS + MODULES ── */}
            <div className="summary-card fade-in" style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "0" }}>

              <h2 style={{
                fontSize: "13px", color: "#D4AF37", fontWeight: 600, letterSpacing: "1px",
                textTransform: "uppercase", borderBottom: "1px solid #222",
                paddingBottom: "14px", marginBottom: "20px",
              }}>
                System Specifications
              </h2>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
                {specs.map((spec, i) => (
                  <li key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#666" }}>{spec.label}</span>
                    <span style={{ color: "#fff", fontWeight: 500 }}>{spec.value}</span>
                  </li>
                ))}
              </ul>

              <h2 style={{
                fontSize: "13px", color: "#D4AF37", fontWeight: 600, letterSpacing: "1px",
                textTransform: "uppercase", borderBottom: "1px solid #222",
                paddingBottom: "14px", marginBottom: "20px",
              }}>
                Configured Slots ({allPopulatedSlots.length})
              </h2>

              {allPopulatedSlots.length === 0 ? (
                <div style={{ color: "#444", fontSize: "14px", fontStyle: "italic" }}>
                  No slots configured.
                </div>
              ) : (
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: "10px", marginBottom: "auto", overflowY: "auto", maxHeight: "260px",
                  paddingRight: "4px",
                }}>
                  {allPopulatedSlots.map((mod) => (
                    <div
                      key={mod.id}
                      className="module-chip"
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        background: mod.isCustom ? "rgba(212, 175, 55, 0.05)" : "#0d0d0d", 
                        padding: "10px 14px",
                        borderRadius: "8px", 
                        border: mod.isCustom ? "1px solid rgba(212, 175, 55, 0.2)" : "1px solid #222",
                      }}
                    >
                      <div style={{ flexShrink: 0 }}>
                        {mod.render(config.materialColor === "mat-white" ? "#333" : (mod.isCustom ? "#D4AF37" : "#00E5FF"))}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "10px", color: "#555", marginBottom: "2px" }}>
                          {mod.size}M {mod.isCustom ? "(Icon)" : ""}
                        </div>
                        <div style={{
                          fontSize: "12px", color: "#ccc",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                          {mod.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: "14px", marginTop: "32px" }}>
                <button
                  onClick={() => router.back()}
                  style={{
                    flex: 1, background: "transparent", color: "#aaa",
                    border: "1px solid #2a2a2a", borderRadius: "8px",
                    padding: "14px", fontSize: "13px", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#aaa"; }}
                >
                  ← Edit
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className="action-btn"
                  style={{
                    flex: 2,
                    background: "linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%)",
                    color: "#000", border: "1px solid #ffdb6b",
                    borderRadius: "8px", padding: "14px",
                    fontSize: "13px", fontWeight: 700,
                    cursor: isGenerating ? "not-allowed" : "pointer",
                    display: "flex", justifyContent: "center", alignItems: "center", gap: "8px",
                    opacity: isGenerating ? 0.7 : 1,
                  }}
                >
                  {isGenerating ? (
                    <span style={{ animation: "pulse 1.5s infinite" }}>Generating PDF…</span>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Download PDF Summary
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════
          HIDDEN PDF TEMPLATE 
      ══════════════════════════════════════════ */}
      <div
        ref={pdfRef}
        style={{
          display: "none", width: "800px",
          background: "#050505", color: "#fff",
          padding: "60px", fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
          borderBottom: "1px solid #222", paddingBottom: "30px", marginBottom: "40px",
        }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "3px", color: "#fff", marginBottom: "6px" }}>
              XERO<span style={{ color: "#D4AF37" }}>VOLT</span>
            </div>
            <div style={{ fontSize: "12px", color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>
              Smart Home Architecture
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "22px", color: "#D4AF37", fontWeight: 600, marginBottom: "6px" }}>
              Order Preview
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>{currentDate}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
          <div style={{ width: "60%", maxWidth: "500px" }}>
            <DynamicPanelPreview config={config} isPdf />
          </div>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <div style={{
            fontSize: "13px", color: "#D4AF37", textTransform: "uppercase",
            letterSpacing: "1px", fontWeight: 600, marginBottom: "16px",
          }}>
            System Specifications
          </div>
          <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
            {specs.map((spec, i) => (
              <div key={i} style={{
                display: "flex", padding: "14px 24px",
                borderBottom: i === specs.length - 1 ? "none" : "1px solid #1a1a1a",
              }}>
                <div style={{ width: "200px", color: "#666", fontSize: "13px" }}>{spec.label}</div>
                <div style={{ color: "#e0e0e0", fontSize: "13px" }}>{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {allPopulatedSlots.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              fontSize: "13px", color: "#D4AF37", textTransform: "uppercase",
              letterSpacing: "1px", fontWeight: 600, marginBottom: "16px",
            }}>
              Configured Slots
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {allPopulatedSlots.map((mod) => (
                <div key={mod.id} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  background: "#0a0a0a", padding: "10px 14px",
                  borderRadius: "6px", border: "1px solid #1a1a1a",
                }}>
                  <div>{mod.render("#D4AF37")}</div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#555" }}>{mod.size}M {mod.isCustom ? "(Icon)" : ""}</div>
                    <div style={{ fontSize: "12px", color: "#ccc" }}>{mod.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          fontSize: "11px", color: "#444", textAlign: "center",
          marginTop: "60px", paddingTop: "20px", borderTop: "1px solid #1a1a1a",
        }}>
          Generated by Xerovolt Studio Configurator · {currentDate}
        </div>
      </div>
    </>
  );
}
function OrderSummaryPageInner() {
  return (
    <Suspense fallback={<div style={{ background: "#050505", minHeight: "100vh" }} />}>
      <OrderSummaryInner />
    </Suspense>
  );
}
export default function OrderSummaryPage() {
  return (
    <Suspense fallback={<div style={{ background: "#050505", height: "100vh" }} />}>
      <OrderSummaryPageInner />
    </Suspense>
  );
}
