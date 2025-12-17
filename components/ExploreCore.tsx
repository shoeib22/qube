"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

const parts = [
  {
    id: "front-panel",
    name: "Front Panel",
    description:
      "Sleek, minimalist design that blends seamlessly with any interior. Tool-free removal for easy maintenance.",
    position: { top: "10%", left: "50%" },
    color: "electric-cyan",
  },
  {
    id: "f7-filter",
    name: "F7 Filter",
    description:
      "Medical-grade F7 filtration removes 97% of particles, pollen, and allergens for clean, healthy air.",
    position: { top: "35%", left: "20%" },
    color: "voltage-blue",
  },
  {
    id: "ceramic-core",
    name: "Ceramic Core",
    description:
      "High-efficiency ceramic heat exchanger with 97% energy recovery. Reverses airflow every 75 seconds.",
    position: { top: "60%", left: "50%" },
    color: "electric-cyan",
  },
  {
    id: "reversible-fan",
    name: "Reversible Fan",
    description:
      "Ultra-quiet EC motor with automatic direction reversal. Whisper-quiet operation at just 19dB(A).",
    position: { top: "85%", left: "80%" },
    color: "voltage-blue",
  },
];

export default function ExploreCore() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isExploded, setIsExploded] = useState(false);

  const selected = parts.find((p) => p.id === selectedPart);

  const getColorVar = (color: string) =>
    color === "electric-cyan"
      ? "var(--safety-yellow)"
      : "var(--insulator-orange)";

  return (
    <div className="w-full py-20">
      {/* Toggle Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setIsExploded((v) => !v)}
          className="px-6 py-3 rounded-full font-semibold hover:opacity-80 transition"
          style={{
            backgroundColor: "var(--safety-yellow)",
            color: "var(--graphite)",
          }}
        >
          {isExploded ? "Collapse View" : "Explode View"}
        </button>
      </div>

      {/* Main Layout */}
      <div
        className="relative w-full max-w-4xl mx-auto aspect-square rounded-3xl overflow-hidden shadow-xl"
        style={{
          background: "linear-gradient(135deg, var(--graphite), #1a252f)",
        }}
      >
        {/* Center Unit */}
        <motion.div
          animate={{ scale: isExploded ? 0.6 : 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-64 h-80 rounded-3xl shadow-xl border-4 flex items-center justify-center"
            style={{
              backgroundColor: "var(--graphite)",
              borderColor: "var(--insulator-orange)",
            }}
          >
            <div
              className="text-center opacity-70"
              style={{ color: "var(--clean-white)" }}
            >
              <p className="text-sm">ECO Pair Plus</p>
              <p className="text-xs">ERV Unit</p>
            </div>
          </div>
        </motion.div>

        {/* Exploded Parts */}
        {parts.map((part, index) => (
          <motion.div
            key={part.id}
            initial={false}
            animate={{
              top: isExploded ? part.position.top : "50%",
              left: isExploded ? part.position.left : "50%",
              scale: isExploded ? 1 : 0,
              opacity: isExploded ? 1 : 0,
            }}
            transition={{
              delay: isExploded ? index * 0.1 : 0,
              duration: 0.6,
              type: "spring",
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setSelectedPart(part.id)}
          >
            <div className="group relative">
              <div
                className="w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-all"
                style={{ backgroundColor: getColorVar(part.color) }}
              >
                <div className="w-3 h-3 rounded-full bg-white absolute animate-ping opacity-70"></div>
              </div>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition">
                <p
                  className="px-3 py-1 text-xs rounded-full"
                  style={{
                    backgroundColor: "var(--graphite)",
                    color: "var(--clean-white)",
                  }}
                >
                  {part.name}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Info Panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md border-t"
            style={{
              backgroundColor: "rgba(30, 40, 50, 0.9)",
              borderColor: "var(--insulator-orange)",
            }}
          >
            <button
              onClick={() => setSelectedPart(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/30 transition"
            >
              <X className="w-5 h-5" style={{ color: "var(--clean-white)" }} />
            </button>

            <div
              className="w-12 h-12 rounded-xl mb-4"
              style={{ backgroundColor: getColorVar(selected.color) }}
            ></div>

            <h3 className="text-lg font-semibold" style={{ color: "var(--clean-white)" }}>
              {selected.name}
            </h3>

            <p
              className="text-sm opacity-75"
              style={{ color: "var(--clean-white)" }}
            >
              {selected.description}
            </p>
          </motion.div>
        )}

        {/* Instructions */}
        {!isExploded && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-70">
            <p className="text-sm" style={{ color: "var(--clean-white)" }}>
              Click “Explode View” to explore components
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
