"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Define your pre-set hardware models
const PANEL_MODELS = [
  {
    id: "2-gang",
    name: "2-Button Panel",
    slots: 2,
    description: "Compact design for minimal, targeted control.",
  },
  {
    id: "4-gang",
    name: "4-Button Panel",
    slots: 4,
    description: "Standard configuration for single rooms or zones.",
  },
  {
    id: "6-gang",
    name: "6-Button Panel",
    slots: 6,
    description: "Extended control for larger living spaces.",
  },
  {
    id: "8-gang",
    name: "8-Button Panel",
    slots: 8,
    description: "Maximum control for master setups and scenes.",
  },
  {
    id: "10-gang",
    name: "10-Button Panel",
    slots: 10,
    description: "Maximum control for master setups and scenes.",
  },
  {
    id: "12-gang",
    name: "12-Button Panel",
    slots: 12,
    description: "Maximum control for master setups and scenes.",
  },
  {
    id: "16-gang",
    name: "16-Button Panel",
    slots: 16,
    description: "Maximum control for master setups and scenes.",
  },
];

export default function PanelSelectorPage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleContinue = () => {
    if (!selectedModel) return;
    setIsNavigating(true);
    
    const modelData = PANEL_MODELS.find((m) => m.id === selectedModel);
    
    router.push(`/customizer?model=${selectedModel}&slots=${modelData?.slots}`);
  };

  return (
    <>
      {/* Scoped CSS for hover effects and animations */}
      <style>{`
        .xerovolt-card {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .xerovolt-card:hover {
          transform: translateY(-4px);
          border-color: #444 !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
        }
        .xerovolt-card.selected {
          border-color: #D4AF37 !important;
          box-shadow: 0 0 0 1px #D4AF37, 0 12px 40px rgba(212, 175, 55, 0.15) !important;
          transform: translateY(-4px);
        }
        .xerovolt-button {
          transition: all 0.3s ease;
        }
        .xerovolt-button:hover:not(:disabled) {
          filter: brightness(1.1);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        }
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
      `}</style>

      <div
        className="bg-grid"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#050505", // Deep obsidian
          backgroundImage: "radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 70%)",
          color: "#e0e0e0",
          fontFamily: "'Inter', 'Roboto', sans-serif",
        }}
      >
        {/* Mock Top Navigation */}
        <nav style={{
          padding: "24px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "2px", color: "#fff" }}>
            XERO<span style={{ color: "#D4AF37" }}>VOLT</span>
          </div>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#888" }}>
            Step 1 <span style={{ margin: "0 8px", color: "#333" }}>/</span> Configuration
          </div>
        </nav>

        <main style={{ maxWidth: "1100px", margin: "0 auto", width: "100%", padding: "60px 20px" }}>
          
          {/* Header Section */}
          <div style={{ textAlign: "center", marginBottom: "70px" }}>
            <div style={{
              display: "inline-block",
              padding: "6px 12px",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "20px",
              color: "#D4AF37",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "24px"
            }}>
              Hardware Selection
            </div>
            <h1 style={{ fontSize: "42px", fontWeight: 300, color: "#fff", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
              Select Your <span style={{ fontWeight: 600 }}>Panel</span>
            </h1>
            <p style={{ color: "#888", fontSize: "16px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
              Choose a base hardware configuration to begin designing your bespoke Xerovolt interface.
            </p>
          </div>

          {/* Centered Grid Selection Matching Image Layout */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "24px",
              marginBottom: "60px",
              maxWidth: "1000px",
              margin: "0 auto 60px auto"
            }}
          >
            {PANEL_MODELS.map((model, index) => {
              const isSelected = selectedModel === model.id;
              
              // Calculate graphic layout based on image logic (1 square graphic per 2 modules)
              const numModules = Math.max(1, Math.floor(model.slots / 2));
              let cols = numModules;
              
              // Wrap to 2 rows for 12 and 16 module sizes to match image graphics
              if (model.slots === 12) {
                cols = 3;
              } else if (model.slots === 16) {
                cols = 4;
              } else if (model.slots === 10) {
                cols = 5;
              }

              const iconColor = isSelected ? "#D4AF37" : "#555";

              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`xerovolt-card ${isSelected ? "selected" : ""}`}
                  style={{
                    background: "linear-gradient(145deg, #111111 0%, #0a0a0a 100%)",
                    border: "1px solid #1f1f1f",
                    borderRadius: "8px",
                    padding: "24px 32px",
                    cursor: "pointer",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                    width: "310px", // Fixed width to force the exact 3-top, 2-bottom flex wrap layout
                  }}
                >
                  {/* Subtle highlight glow inside the card if selected */}
                  {isSelected && (
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80%",
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
                      opacity: 0.5
                    }} />
                  )}

                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#777", marginBottom: "8px" }}>
                    Size {index + 1}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <h3 style={{
                      fontSize: "28px",
                      color: isSelected ? "#D4AF37" : "#fff",
                      margin: 0,
                      fontWeight: 700,
                    }}>
                      {model.slots} Module
                    </h3>

                    {/* Graphic Representation (Nested bordered rectangles matching image style) */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${cols}, 1fr)`,
                      gap: "2px",
                      padding: "3px",
                      border: `1.5px solid ${iconColor}`,
                      borderRadius: "3px",
                      backgroundColor: "transparent",
                      transition: "border-color 0.3s ease"
                    }}>
                      {Array.from({ length: numModules }).map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "14px",
                            height: "22px",
                            border: `1.5px solid ${iconColor}`,
                            borderRadius: "2px",
                            backgroundColor: isSelected ? "rgba(212, 175, 55, 0.15)" : "transparent",
                            transition: "all 0.3s ease"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "40px" }}>
            <button
              onClick={() => router.push(`/panel-customizer/material?model=${selectedModel}`)}
              disabled={!selectedModel || isNavigating}
              className="xerovolt-button"
              style={{
                background: selectedModel ? "linear-gradient(135deg, #D4AF37 0%, #aa8c2c 100%)" : "#1a1a1a",
                color: selectedModel ? "#000" : "#555",
                border: selectedModel ? "1px solid #ffdb6b" : "1px solid #222",
                borderRadius: "8px",
                padding: "16px 56px",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: selectedModel ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: selectedModel ? "0 4px 15px rgba(212, 175, 55, 0.2)" : "none",
              }}
            >
              {isNavigating ? (
                <>
                  <span style={{ 
                    display: "inline-block", 
                    width: "14px", 
                    height: "14px", 
                    border: "2px solid #000", 
                    borderTopColor: "transparent", 
                    borderRadius: "50%", 
                    animation: "spin 1s linear infinite" 
                  }} />
                  Initializing...
                </>
              ) : (
                "Launch Studio"
              )}
            </button>
          </div>
        </main>
      </div>

      {/* Spinner animation keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}