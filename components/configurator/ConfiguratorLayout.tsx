"use client";

import React, { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { STEPS } from "@/lib/configuratorData";
import { useConfigurator } from "@/context/ConfiguratorContext";
import StepProgress from "./StepProgress";

interface ConfiguratorLayoutProps {
  currentStep: string;
  children: ReactNode;
  canProceed?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

export default function ConfiguratorLayout({
  currentStep,
  children,
  canProceed = true,
  onNext,
  onBack,
}: ConfiguratorLayoutProps) {
  const router = useRouter();
  const { clearAll } = useConfigurator();
  const [autoNext, setAutoNext] = useState(false);

  const stepIndex = STEPS.find(s => s.id === currentStep)?.index ?? 1;
  const prevStep  = STEPS.find(s => s.index === stepIndex - 1);
  const nextStep  = STEPS.find(s => s.index === stepIndex + 1);

  const handleBack = () => {
    if (onBack) { onBack(); return; }
    if (prevStep) router.push(prevStep.path);
  };

  const handleNext = () => {
    if (!canProceed) return;
    if (onNext) { onNext(); return; }
    if (nextStep) router.push(nextStep.path);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Top announcement strip */}
      <div className="bg-gray-100 border-b border-gray-200 text-center py-2 px-4 text-xs text-gray-500 font-medium">
        ✨ We proudly manufacture and sell Make in India products
      </div>

      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tight text-gray-900">Xerovolt</span>
          <span className="text-xs text-gray-400 font-medium">Smart Panel Studio</span>
        </a>

        <div className="flex items-center gap-4">
          {/* Auto-select Next toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setAutoNext(v => !v)}
              className={`w-9 h-5 rounded-full transition-colors relative ${autoNext ? "bg-[#f2994a]" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoNext ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs font-medium text-gray-600">Auto-select Next</span>
          </label>
        </div>
      </div>

      {/* Step progress */}
      <div className="border-b border-gray-100 py-4 px-6 bg-white overflow-x-auto">
        <StepProgress currentStep={currentStep} />
      </div>

      {/* Page heading */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#f2994a] rounded-full" />
          <h2 className="text-lg font-bold text-gray-900 capitalize">
            {currentStep === "cart" ? "Your Cart" : currentStep === "icons" ? "Icons" : currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
          </h2>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between sticky bottom-0 z-10">
        <button
          onClick={() => clearAll()}
          className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors border border-red-200 hover:border-red-400 rounded-lg px-3 py-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
          Clear Selection
        </button>

        <div className="flex items-center gap-3">
          {prevStep && (
            <button
              onClick={handleBack}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          )}
          {nextStep && (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all
                ${canProceed
                  ? "bg-[#155cfc] text-white hover:bg-[#1249d4] shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
