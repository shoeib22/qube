"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ======================================================
// MATERIAL COLORS
// ======================================================

const MATERIAL_COLORS = [
  {
    id: "mat-black",
    name: "Obsidian Black",
    hex: "#111111",
    border: "#222222",
  },
  {
    id: "mat-white",
    name: "Alabaster White",
    hex: "#F8F8F8",
    border: "#E5E5E5",
  },
  {
    id: "mat-grey",
    name: "Slate Grey",
    hex: "#4B5563",
    border: "#374151",
  },
  {
    id: "mat-blue",
    name: "Sapphire Blue",
    hex: "#1D4ED8",
    border: "#1E3A8A",
  },
  {
    id: "mat-gold",
    name: "Brushed Gold",
    hex: "#D4AF37",
    border: "#B4952F",
  },
  {
    id: "mat-lightgray",
    name: "Platinum Gray",
    hex: "#D1D5DB",
    border: "#9CA3AF",
  },
];

// ======================================================
// FRAME COLORS
// ======================================================

const FRAME_COLORS = [
  {
    id: "frm-black",
    name: "Matte Black",
    hex: "#0A0A0A",
    border: "#1A1A1A",
  },
  {
    id: "frm-gold",
    name: "Champagne Gold",
    hex: "linear-gradient(135deg, #E6C27A 0%, #D4AF37 50%, #997A15 100%)",
    border: "#D4AF37",
  },
  {
    id: "frm-silver",
    name: "Brushed Silver",
    hex: "linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)",
    border: "#9CA3AF",
  },
  {
    id: "frm-bronze",
    name: "Dark Bronze",
    hex: "#4A3B32",
    border: "#3A2A22",
  },
];

export default function ColourPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ======================================================
  // URL PARAMS
  // ======================================================

  const model = searchParams.get("model") || "6-gang";

  const materialType =
    searchParams.get("material") || "glass";

  // ======================================================
  // AUTO SLOT EXTRACTION
  // ======================================================

  // 16-gang -> 16
  // 12-gang -> 12
  // 2-gang -> 2

  const slots = useMemo(() => {
    const extracted = parseInt(model.split("-")[0]);
    return isNaN(extracted) ? 6 : extracted;
  }, [model]);

  // ======================================================
  // GRID LAYOUT
  // ======================================================

  const gridColumns = useMemo(() => {
    if (slots <= 2) return 2;
    if (slots <= 4) return 2;
    if (slots <= 8) return 4;
    if (slots <= 12) return 4;
    return 4;
  }, [slots]);

  // ======================================================
  // STATE
  // ======================================================

  const [activeTab, setActiveTab] = useState<
    "material" | "frame"
  >("material");

  const [selectedMaterial, setSelectedMaterial] =
    useState(MATERIAL_COLORS[0]);

  const [selectedFrame, setSelectedFrame] =
    useState(FRAME_COLORS[0]);

  const [isNavigating, setIsNavigating] =
    useState(false);

  // ======================================================
  // HANDLERS
  // ======================================================

  const handleClear = () => {
    setSelectedMaterial(MATERIAL_COLORS[0]);
    setSelectedFrame(FRAME_COLORS[0]);
  };

  const handleNext = () => {
    setIsNavigating(true);

    router.push(
      `/panel-customizer/Accessories?model=${model}&material=${materialType}&slots=${slots}&materialColor=${selectedMaterial.id}&frameColor=${selectedFrame.id}`
    );
  };

  // ======================================================
  // MOCK PRICE
  // ======================================================

  const currentPrice = "9,963.80";

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #050505;
        }

        .color-card {
          transition: all 0.25s ease;
        }

        .color-card:hover {
          transform: translateY(-3px);
          border-color: #555 !important;
          background: #151515 !important;
        }

        .color-card.selected {
          border-color: #D4AF37 !important;
          box-shadow:
            0 0 0 1px #D4AF37,
            0 12px 32px rgba(212,175,55,0.15);
        }

        .tab-button {
          position: relative;
          transition: color 0.3s ease;
        }

        .tab-button::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #D4AF37;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .tab-button.active::after {
          transform: scaleX(1);
        }

        .bg-grid {
          background-size: 30px 30px;
          background-image:
            linear-gradient(
              to right,
              rgba(255,255,255,0.02) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.02) 1px,
              transparent 1px
            );
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#050505",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* ====================================================== */}
        {/* NAVBAR */}
        {/* ====================================================== */}

        <nav
          style={{
            height: "80px",
            background: "#080808",
            borderBottom:
              "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "2px",
            }}
          >
            XERO
            <span style={{ color: "#D4AF37" }}>
              VOLT
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <span style={{ color: "#666" }}>
              Material
            </span>

            <span style={{ color: "#444" }}>—</span>

            <span
              style={{
                color: "#fff",
                background:
                  "rgba(212,175,55,0.1)",
                border:
                  "1px solid rgba(212,175,55,0.3)",
                padding: "4px 12px",
                borderRadius: "999px",
              }}
            >
              Colour
            </span>

            <span style={{ color: "#444" }}>—</span>

            <span style={{ color: "#666" }}>
              Studio
            </span>
          </div>
        </nav>

        {/* ====================================================== */}
        {/* MAIN */}
        {/* ====================================================== */}

        <main
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* ====================================================== */}
          {/* SIDEBAR */}
          {/* ====================================================== */}

          <div
            style={{
              width: "460px",
              background: "#0A0A0A",
              borderRight: "1px solid #1A1A1A",
              padding: "40px 32px",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                marginBottom: "40px",
              }}
            >
              <h1
                style={{
                  fontSize: "34px",
                  fontWeight: 300,
                  marginBottom: "12px",
                }}
              >
                Design & <strong>Finish</strong>
              </h1>

              <p
                style={{
                  color: "#777",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                Configure the finish, material tone,
                and premium frame styling for your{" "}
                {model} Xerovolt panel.
              </p>
            </div>

            {/* ====================================================== */}
            {/* PANEL INFO */}
            {/* ====================================================== */}

            <div
              style={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: "14px",
                padding: "18px",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#777",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "10px",
                }}
              >
                Selected Configuration
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#888" }}>
                  Model
                </span>

                <span>{model}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#888" }}>
                  Slots
                </span>

                <span>{slots}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <span style={{ color: "#888" }}>
                  Material
                </span>

                <span>{materialType}</span>
              </div>
            </div>

            {/* ====================================================== */}
            {/* TABS */}
            {/* ====================================================== */}

            <div
              style={{
                display: "flex",
                gap: "24px",
                borderBottom: "1px solid #222",
                marginBottom: "28px",
              }}
            >
              <button
                onClick={() =>
                  setActiveTab("material")
                }
                className={`tab-button ${
                  activeTab === "material"
                    ? "active"
                    : ""
                }`}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 0 14px 0",
                  color:
                    activeTab === "material"
                      ? "#D4AF37"
                      : "#777",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Material Colour
              </button>

              <button
                onClick={() =>
                  setActiveTab("frame")
                }
                className={`tab-button ${
                  activeTab === "frame"
                    ? "active"
                    : ""
                }`}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 0 14px 0",
                  color:
                    activeTab === "frame"
                      ? "#D4AF37"
                      : "#777",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Frame Colour
              </button>
            </div>

            {/* ====================================================== */}
            {/* COLOR GRID */}
            {/* ====================================================== */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2,1fr)",
                gap: "16px",
              }}
            >
              {(activeTab === "material"
                ? MATERIAL_COLORS
                : FRAME_COLORS
              ).map((color) => {
                const isSelected =
                  activeTab === "material"
                    ? selectedMaterial.id ===
                      color.id
                    : selectedFrame.id ===
                      color.id;

                return (
                  <div
                    key={color.id}
                    onClick={() =>
                      activeTab === "material"
                        ? setSelectedMaterial(
                            color
                          )
                        : setSelectedFrame(
                            color
                          )
                    }
                    className={`color-card ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    style={{
                      background: "#111",
                      border:
                        "1px solid #222",
                      borderRadius: "12px",
                      padding: "16px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "54px",
                        borderRadius: "8px",
                        background:
                          color.hex,
                        border: `1px solid ${color.border}`,
                        marginBottom:
                          "14px",
                      }}
                    />

                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        marginBottom:
                          "4px",
                      }}
                    >
                      {color.name}
                    </div>

                    <div
                      style={{
                        color: "#666",
                        fontSize: "11px",
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "1px",
                      }}
                    >
                      {activeTab ===
                      "material"
                        ? "Material"
                        : "Frame"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ====================================================== */}
          {/* LIVE PREVIEW */}
          {/* ====================================================== */}

          <div
            className="bg-grid"
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "40px",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                width: "600px",
                height: "350px",
                background:
                  selectedFrame.border,
                filter: "blur(140px)",
                opacity: 0.12,
              }}
            />

            {/* Panel */}
            <div
              style={{
                width:
                  slots >= 12
                    ? "760px"
                    : slots >= 8
                    ? "680px"
                    : "560px",

                height:
                  slots >= 12
                    ? "460px"
                    : slots >= 8
                    ? "400px"
                    : "340px",

                borderRadius: "28px",
                // REDUCED PADDING TO MAKE FRAME THIN
                padding: "4px",
                background:
                  selectedFrame.hex,
                position: "relative",
                transition:
                  "all 0.4s ease",
                boxShadow:
                  "0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Inner Material */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "24px", // Adjusted to hug the outer radius smoothly
                  background:
                    selectedMaterial.hex,
                  border: `1px solid ${selectedMaterial.border}`,
                  padding: "24px",
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                  gap: "16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Light reflection */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%)",
                  }}
                />

                {/* Dynamic slots */}
                {[...Array(slots)].map(
                  (_, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius:
                          "10px",

                        background:
                          selectedMaterial.hex ===
                          "#F8F8F8"
                            ? "rgba(0,0,0,0.05)"
                            : "rgba(0,0,0,0.25)",

                        border:
                          selectedMaterial.hex ===
                          "#F8F8F8"
                            ? "1px solid rgba(0,0,0,0.08)"
                            : "1px solid rgba(255,255,255,0.05)",

                        boxShadow:
                          "inset 0 4px 12px rgba(0,0,0,0.35)",

                        position:
                          "relative",
                      }}
                    >
                      {/* tiny LED */}
                      <div
                        style={{
                          width: "4px",
                          height: "4px",
                          borderRadius:
                            "50%",
                          background:
                            "rgba(255,255,255,0.15)",
                          position:
                            "absolute",
                          top: "10px",
                          left: "50%",
                          transform:
                            "translateX(-50%)",
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </main>

        {/* ====================================================== */}
        {/* FOOTER */}
        {/* ====================================================== */}

        <footer
          style={{
            height: "80px",
            background: "#080808",
            borderTop:
              "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            padding: "0 40px",
            flexShrink: 0,
          }}
        >
          {/* Price */}
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginBottom: "4px",
              }}
            >
              Total
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#D4AF37",
              }}
            >
              ₹{currentPrice}
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            <button
              onClick={handleClear}
              style={{
                height: "46px",
                padding: "0 24px",
                borderRadius: "8px",
                border:
                  "1px solid rgba(239,68,68,0.3)",
                background:
                  "transparent",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              Clear
            </button>

            <button
              onClick={() =>
                router.back()
              }
              style={{
                height: "46px",
                padding: "0 32px",
                borderRadius: "8px",
                border:
                  "1px solid #333",
                background: "#1A1A1A",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isNavigating}
              style={{
                height: "46px",
                padding: "0 40px",
                borderRadius: "8px",
                border:
                  "1px solid #ffdb6b",
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%)",
                color: "#000",
                fontWeight: 700,
                cursor: "pointer",
                minWidth: "140px",
              }}
            >
              {isNavigating ? (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border:
                      "2px solid #000",
                    borderTopColor:
                      "transparent",
                    borderRadius:
                      "50%",
                    animation:
                      "spin 1s linear infinite",
                    margin: "0 auto",
                  }}
                />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}