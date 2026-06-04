"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const MATERIALS = [
  {
    id: "glass",
    name: "Glass",
    subtitle: "Premium & Scratch Resistant",
    description: "An edge-to-edge glass finish offering a weighty, ultra-premium feel. Highly resistant to scratches and optimized for capacitive touch precision.",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #404040 100%)", // Simulating a sharp reflection
  },
  {
    id: "acrylic",
    name: "Acrylic",
    subtitle: "Durable & Lightweight",
    description: "A refined, shatter-resistant acrylic. Provides a sleek, modern profile with excellent light diffusion for backlit engraving.",
    gradient: "linear-gradient(135deg, #111 0%, #1a1a1a 100%)", // Simulating a matte/softer finish
  },
];

function MaterialsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Grab the previous selections
  const model = searchParams.get("model");
  const slots = searchParams.get("slots");

  const handleContinue = () => {
    if (!selectedMaterial) return;
    setIsNavigating(true);
    
    // Pass everything to the customizer
    router.push(`/customizer?model=${model}&slots=${slots}&material=${selectedMaterial}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>
          Select Surface Material
        </h1>
        <p style={{ color: "#888", fontSize: "18px", maxWidth: "500px", margin: "0 auto" }}>
          Choose the finish for your Xerovolt panel. Both materials support custom laser engraving and backlight mapping.
        </p>
      </div>

      {/* Material Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          marginBottom: "60px",
        }}
      >
        {MATERIALS.map((material) => {
          const isSelected = selectedMaterial === material.id;
          return (
            <div
              key={material.id}
              onClick={() => setSelectedMaterial(material.id)}
              style={{
                background: isSelected ? "#1a1a1a" : "#111",
                border: `2px solid ${isSelected ? "#D4AF37" : "#2a2a2a"}`,
                borderRadius: "12px",
                padding: "40px 32px",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: isSelected ? "0 8px 24px rgba(212, 175, 55, 0.1)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Visual Material Swatch */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  background: material.gradient,
                  borderRadius: "50%",
                  marginBottom: "24px",
                  border: isSelected ? "2px solid #D4AF37" : "1px solid #333",
                  boxShadow: "inset 0 4px 10px rgba(255,255,255,0.05)",
                  transition: "all 0.2s",
                }}
              />
              
              <h3 style={{ fontSize: "24px", color: "#fff", marginBottom: "8px", fontWeight: 600 }}>
                {material.name}
              </h3>
              <span style={{ fontSize: "12px", color: "#D4AF37", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
                {material.subtitle}
              </span>
              <p style={{ fontSize: "14px", color: "#888", lineHeight: 1.6 }}>
                {material.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={handleBack}
          style={{
            background: "transparent",
            color: "#888",
            border: "1px solid #333",
            borderRadius: "6px",
            padding: "16px 32px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
        >
          Back
        </button>

        <button
      onClick={() =>  router.push(`/panel-customizer/colour?model=${model}&material=${selectedMaterial}}` )}
          disabled={!selectedMaterial || isNavigating}
          style={{
            background: selectedMaterial ? "#D4AF37" : "#2a2a2a",
            color: selectedMaterial ? "#000" : "#666",
            border: "none",
            borderRadius: "6px",
            padding: "16px 48px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: selectedMaterial ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          {isNavigating ? "Loading Studio..." : "Continue to Studio"}
        </button>
      </div>
    </div>
  );
}

function MaterialsPageInner() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e0e0e0",
        fontFamily: "'Inter', 'Roboto', sans-serif",
        padding: "40px 20px",
      }}
    >
      {/* Suspense is required by Next.js when using useSearchParams */}
      <Suspense fallback={<div style={{ color: "#D4AF37", textAlign: "center", marginTop: "100px" }}>Loading options...</div>}>
        <MaterialsContent />
      </Suspense>
    </div>
  );
}
export default function MaterialsPage() {
  return (
    <Suspense fallback={<div style={{ background: "#050505", height: "100vh" }} />}>
      <MaterialsPageInner />
    </Suspense>
  );
}
