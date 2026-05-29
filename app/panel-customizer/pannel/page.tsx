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

          {/* Grid Selection */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
              marginBottom: "60px",
            }}
          >
            {PANEL_MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`xerovolt-card ${isSelected ? "selected" : ""}`}
                  style={{
                    background: "linear-gradient(145deg, #111111 0%, #0a0a0a 100%)",
                    border: "1px solid #1f1f1f",
                    borderRadius: "16px",
                    padding: "40px 24px",
                    cursor: "pointer",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden"
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

                  {/* Visual Representation of the Panel */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: model.slots > 4 ? "1fr 1fr" : "1fr",
                      gap: "6px",
                      width: "fit-content",
                      margin: "0 auto 32px",
                      background: "linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)",
                      padding: "16px",
                      borderRadius: "6px",
                      border: "1px solid #222",
                      boxShadow: "inset 0 2px 10px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    {Array.from({ length: model.slots }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: "36px",
                          height: "18px",
                          background: isSelected 
                            ? "linear-gradient(180deg, #D4AF37 0%, #aa8c2c 100%)" 
                            : "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
                          borderRadius: "3px",
                          border: isSelected ? "1px solid #ffdb6b" : "1px solid #333",
                          boxShadow: isSelected 
                            ? "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.5)" 
                            : "inset 0 1px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.5)",
                          transition: "all 0.3s ease"
                        }}
                      />
                    ))}
                  </div>

                  <h3 style={{ fontSize: "18px", color: isSelected ? "#D4AF37" : "#fff", marginBottom: "12px", fontWeight: 500, letterSpacing: "0.5px" }}>
                    {model.name}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.5, margin: 0 }}>
                    {model.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "40px" }}>
            <button
              onClick={() =>  router.push(`/panel-customizer/material?model=${selectedModel}`)}
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