"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { useAuth } from "@/context/AuthContext";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";
import PanelPreview from "@/components/configurator/PanelPreview";
import {
  getMaterialById, getSizeById, getAccessoryById,
  getMaterialColorById, getFrameColorById, getTechnologyById,
} from "@/lib/configuratorData";

export default function CartPage() {
  const { state, setQty, setOrderNote, setSavedConfigId } = useConfigurator();
  const { user } = useAuth();
  const router = useRouter();

  const [showNoteInput, setShowNoteInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(state.savedConfigId);

  const material   = state.material   ? getMaterialById(state.material)       : null;
  const size       = state.size       ? getSizeById(state.size)               : null;
  const accessory  = state.accessory  ? getAccessoryById(state.accessory)     : null;
  const matColor   = state.materialColor ? getMaterialColorById(state.materialColor) : null;
  const frameColor = state.frameColor ? getFrameColorById(state.frameColor)   : null;
  const tech       = state.technology ? getTechnologyById(state.technology)   : null;

  const rows = [
    { label: "Panel",       value: "Edge" },
    { label: "Material",    value: material?.label ?? "—" },
    { label: "Size",        value: size?.label ?? "—" },
    { label: "Technology",  value: tech?.name ?? "—" },
    { label: "Accessories", value: accessory ? `${accessory.modularSize} Modular: ${accessory.name}` : "—" },
    { label: "Color",       value: matColor && frameColor ? `${matColor.name} / ${frameColor.name}` : "—" },
  ];

  const handleSaveConfig = async () => {
    if (!user) { router.push("/login"); return; }
    setSaving(true);
    setSaveError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/configurator/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          name: `Edge Panel — ${size?.label ?? "Custom"}`,
          material: state.material,
          size: state.size,
          accessory: state.accessory,
          slots: state.slots,
          materialColor: state.materialColor,
          frameColor: state.frameColor,
          technology: state.technology,
          qty: state.qty,
          orderNote: state.orderNote,
        }),
      });
      const data = await res.json();
      if (data.configId) {
        setSavedId(data.configId);
        setSavedConfigId(data.configId);
      } else {
        setSaveError("Save failed. Try again.");
      }
    } catch {
      setSaveError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = () => {
    // Redirect to checkout; cart integration handled by CartContext
    router.push("/checkout");
  };

  return (
    <ConfiguratorLayout currentStep="cart" canProceed={false}>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-160px)] min-h-[500px]">
        {/* Left — panel preview */}
        <div className="flex-1 bg-[#111] flex items-center justify-center p-8">
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor ?? "mc-black"}
            frameColorId={state.frameColor}
            slots={state.slots}
            slotCount={accessory?.slots}
            className="w-full max-w-[500px]"
          />
        </div>

        {/* Right — Order Summary */}
        <div className="w-full lg:w-[380px] bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900 text-base">Order Summary</h3>
              <span className="text-xs text-gray-400 font-medium">Qty: {state.qty}</span>
            </div>
          </div>

          {/* Selections */}
          <div className="p-6 flex-1 space-y-3">
            {rows.map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-xs text-gray-400 font-medium">{row.label}</span>
                <span className="text-xs font-bold text-gray-900 text-right max-w-[180px]">{row.value}</span>
              </div>
            ))}

            {/* Color swatch row */}
            {(matColor || frameColor) && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Color Preview</span>
                <div className="flex gap-1.5">
                  {matColor && (
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: matColor.hex }} title={`Material: ${matColor.name}`} />
                  )}
                  {frameColor && (
                    <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: frameColor.hex }} title={`Frame: ${frameColor.name}`} />
                  )}
                </div>
              </div>
            )}

            <hr className="border-gray-100" />

            {/* Courier note */}
            <p className="text-[10px] text-orange-600 bg-orange-50 border border-orange-100 rounded-lg p-3 leading-relaxed">
              Note: Courier charges will be considered extra and this price excludes the courier charges.
            </p>

            {/* Order note */}
            {showNoteInput ? (
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Order Note</label>
                <textarea
                  value={state.orderNote}
                  onChange={e => setOrderNote(e.target.value)}
                  rows={3}
                  placeholder="Any special instructions..."
                  className="w-full text-xs p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#155cfc] resize-none"
                />
              </div>
            ) : null}

            {/* Save success */}
            {savedId && (
              <p className="text-[10px] text-green-600 font-bold text-center">
                ✓ Config saved (ID: {savedId.slice(0, 8)}…)
              </p>
            )}
            {saveError && (
              <p className="text-[10px] text-red-500 text-center">{saveError}</p>
            )}
          </div>

          {/* Bottom action buttons */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <div className="flex gap-2">
              {/* QTY stepper */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQty(state.qty - 1)} className="px-3 py-2 text-gray-500 hover:bg-gray-50 text-sm font-bold">−</button>
                <span className="px-3 py-2 text-sm font-bold text-gray-900 min-w-[32px] text-center">{state.qty}</span>
                <button onClick={() => setQty(state.qty + 1)} className="px-3 py-2 text-gray-500 hover:bg-gray-50 text-sm font-bold">+</button>
              </div>

              <button
                onClick={() => setShowNoteInput(v => !v)}
                className="flex-1 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {showNoteInput ? "Hide Note" : "+ Add Order Note"}
              </button>
            </div>

            <button
              onClick={handleSaveConfig}
              disabled={saving || !!savedId}
              className={`w-full py-2.5 text-xs font-bold rounded-lg border transition-all
                ${savedId
                  ? "border-green-300 text-green-600 bg-green-50 cursor-default"
                  : saving
                  ? "border-gray-200 text-gray-400 cursor-wait"
                  : "border-[#155cfc]/40 text-[#155cfc] hover:bg-blue-50"
                }`}
            >
              {savedId ? "✓ Config Saved" : saving ? "Saving…" : "Save Config"}
            </button>

            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 text-xs font-bold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Add to Cart
            </button>

            <button
              onClick={handleAddToCart}
              className="w-full py-3 text-sm font-bold rounded-lg bg-[#155cfc] text-white hover:bg-[#1249d4] transition-colors shadow-md shadow-blue-200"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
