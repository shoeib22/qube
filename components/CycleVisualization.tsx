"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Snowflake, Sun } from "lucide-react";

interface CycleVisualizationProps {
  showControls?: boolean;
}

export function CycleVisualization({ showControls = true }: CycleVisualizationProps) {
  const [mode, setMode] = useState<"winter" | "summer">("winter");
  const [cycle, setCycle] = useState<1 | 2>(1);

  // Auto-cycle between cycle 1 and 2 every 3 seconds (correct useEffect)
  useEffect(() => {
    const interval = setInterval(() => {
      setCycle((prev) => (prev === 1 ? 2 : 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isWinter = mode === "winter";
  const outsideTemp = isWinter ? "0°C" : "35°C";
  const insideTemp = isWinter ? "21°C" : "22°C";
  const outsideColor = isWinter ? "bg-cyan-400" : "bg-orange-500";
  const insideColor = isWinter ? "bg-orange-500" : "bg-cyan-400";

  return (
    <div className="w-full">
      {/* Mode Toggle */}
      {showControls && (
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("winter")}
            className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
              isWinter ? "shadow-lg" : "hover:opacity-80"
            }`}
            style={{
              backgroundColor: isWinter ? "var(--safety-yellow)" : "var(--graphite)",
              color: isWinter ? "var(--graphite)" : "var(--clean-white)",
            }}
          >
            <Snowflake className="w-5 h-5" />
            Winter Mode
          </button>

          <button
            onClick={() => setMode("summer")}
            className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
              !isWinter ? "shadow-lg" : "hover:opacity-80"
            }`}
            style={{
              backgroundColor: !isWinter ? "var(--insulator-orange)" : "var(--graphite)",
              color: !isWinter ? "white" : "var(--clean-white)",
            }}
          >
            <Sun className="w-5 h-5" />
            Summer Mode
          </button>
        </div>
      )}

      {/* Visualization Block */}
      <div
        className="rounded-3xl p-8 lg:p-12 shadow-xl"
        style={{ backgroundColor: "var(--graphite)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Outside Bubble */}
          <div className="text-center">
            <div
              className={`w-32 h-32 mx-auto ${outsideColor} rounded-full flex items-center justify-center mb-4 shadow-lg`}
            >
              <div>
                <p className="text-white text-sm">Outside</p>
                <p className="text-white">{outsideTemp}</p>
              </div>
            </div>
            <p className="text-sm opacity-70" style={{ color: "var(--clean-white)" }}>
              {isWinter ? "Cold Fresh Air" : "Hot Fresh Air"}
            </p>
          </div>

          {/* Ceramic Core Section */}
          <div className="relative">
            {/* Cycle Labels */}
            <div className="text-center mb-4">
              <p style={{ color: "var(--clean-white)" }}>{cycle === 1 ? "CYCLE I" : "CYCLE II"}</p>
              <p className="text-sm opacity-70" style={{ color: "var(--clean-white)" }}>
                {cycle === 1
                  ? isWinter
                    ? "Extracting Warmth (75s)"
                    : "Extracting Coolness (75s)"
                  : isWinter
                  ? "Supplying Warmth (75s)"
                  : "Supplying Coolness (75s)"}
              </p>
            </div>

            {/* Core Box */}
            <div
              className="relative w-full max-w-xs mx-auto h-48 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1a252f, var(--graphite))",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}-${cycle}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-sm mb-2" style={{ color: "var(--clean-white)" }}>
                      Ceramic Core
                    </p>
                    <div
                      className={`w-16 h-16 mx-auto rounded-lg ${
                        cycle === 1
                          ? isWinter
                            ? "bg-orange-500"
                            : "bg-cyan-400"
                          : isWinter
                          ? "bg-orange-500"
                          : "bg-cyan-400"
                      } shadow-lg`}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Airflow Arrows */}
              {cycle === 1 ? (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8"
                >
                  <div className={`w-8 h-1 ${isWinter ? "bg-orange-500" : "bg-cyan-400"}`} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8"
                >
                  <div className={`w-8 h-1 ${isWinter ? "bg-cyan-400" : "bg-orange-500"}`} />
                </motion.div>
              )}
            </div>

            {/* Progress Dots */}
            <div className="mt-4 flex justify-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    cycle === 1 ? "var(--safety-yellow)" : "var(--insulator-orange)",
                }}
              />
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    cycle === 2 ? "var(--safety-yellow)" : "var(--insulator-orange)",
                }}
              />
            </div>
          </div>

          {/* Inside Bubble */}
          <div className="text-center">
            <div
              className={`w-32 h-32 mx-auto ${insideColor} rounded-full flex items-center justify-center mb-4 shadow-lg`}
            >
              <div>
                <p className="text-white text-sm">Inside</p>
                <p className="text-white">{insideTemp}</p>
              </div>
            </div>
            <p className="text-sm opacity-70" style={{ color: "var(--clean-white)" }}>
              {isWinter ? "Warm Indoor Air" : "Cool Indoor Air"}
            </p>
          </div>
        </div>

        {/* Cycle Description */}
        <div className="mt-8 text-center max-w-2xl mx-auto">
          <p className="opacity-70" style={{ color: "var(--clean-white)" }}>
            {isWinter
              ? cycle === 1
                ? "Warm stale air flows out, heating the ceramic core to capture precious warmth."
                : "Cold fresh air flows in through the heated core, warming to room temperature."
              : cycle === 1
              ? "Cool indoor air flows out, cooling the ceramic core to capture precious coolness."
              : "Hot fresh air flows in through the cooled core, cooling to room temperature."}
          </p>
        </div>
      </div>
    </div>
  );
}
