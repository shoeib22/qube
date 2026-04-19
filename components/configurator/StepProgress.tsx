"use client";
// components/configurator/StepProgress.tsx

import React from "react";
import { useRouter } from "next/navigation";
import { STEPS } from "../../lib/configuratorData";
import type { StepId } from "../../types/configurator";

interface StepProgressProps {
  currentStep: StepId;
  completedChoices: Record<string, string>; // stepId -> chosen label
}

export default function StepProgress({ currentStep, completedChoices }: StepProgressProps) {
  const router = useRouter();
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  const handleStepClick = (step: typeof STEPS[0], idx: number) => {
    if (idx < currentIndex) {
      router.push(step.path);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "0 0 0 0",
        userSelect: "none",
      }}
    >
      {/* Choices row (labels above dots) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        {/* Choice labels */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {STEPS.map((step, idx) => {
            const choice = completedChoices[step.id] || "";
            return (
              <div
                key={step.id}
                style={{
                  minWidth: 70,
                  textAlign: "center",
                  fontSize: 10,
                  color: idx <= currentIndex ? "#D4AF37" : "#444",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  padding: "0 2px",
                }}
                title={choice}
              >
                {choice}
              </div>
            );
          })}
        </div>

        {/* Dots + connectors */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isFuture = idx > currentIndex;
            const isClickable = idx < currentIndex;

            return (
              <React.Fragment key={step.id}>
                {/* Connector line */}
                {idx > 0 && (
                  <div
                    style={{
                      height: 2,
                      width: 40,
                      background: isCompleted
                        ? "linear-gradient(90deg, #D4AF37, #D4AF37)"
                        : isCurrent
                        ? "linear-gradient(90deg, #D4AF37, #333)"
                        : "#2a2a2a",
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Step dot */}
                <div
                  onClick={() => isClickable && handleStepClick(step, idx)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: isClickable ? "pointer" : "default",
                    background: isCompleted
                      ? "#D4AF37"
                      : isCurrent
                      ? "#D4AF37"
                      : "#1a1a1a",
                    border: `2px solid ${isCompleted || isCurrent ? "#D4AF37" : "#333"}`,
                    transition: "all 0.2s",
                    boxShadow: isCurrent ? "0 0 0 3px rgba(212,175,55,0.25)" : "none",
                  }}
                >
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: isCurrent ? "#0a0a0a" : "#555",
                        lineHeight: 1,
                      }}
                    >
                      {step.index}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Step labels below */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={step.id}
                style={{
                  minWidth: 70,
                  textAlign: "center",
                  fontSize: 9,
                  color: isCompleted ? "#888" : isCurrent ? "#D4AF37" : "#333",
                  fontWeight: isCurrent ? 700 : 400,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {step.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
