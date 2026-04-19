"use client";
// app/configurator/cart/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../../context/ConfiguratorContext";
import ConfiguratorLayout from "../../../components/configurator/ConfiguratorLayout";
import PanelPreview from "../../../components/configurator/PanelPreview";
import {
  getPanelById, getSizeById, getAccessoryById,
  getMaterialColorById, getTechById, FRAME_COLORS,
  calculatePrice
} from "lib/configuratorData";

export default function CartPage() {
  const { state, setQty, setOrderNote, clearAll } = useConfigurator();
  const router = useRouter();
  const [noteOpen, setNoteOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const panel = getPanelById(state.panel || "");
  const size = getSizeById(state.size || "");
  const acc = getAccessoryById(state.accessory || "");
  const matColor = getMaterialColorById(state.materialColor || "");
  const tech = getTechById(state.technology || "");
  const frameColor = FRAME_COLORS.find(c => c.id === state.frameColor);
  const price = calculatePrice(state);

  const handlePlaceOrder = () => {
    // Integrate with your order system here
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <ConfiguratorLayout currentStep="cart" showBottomBar={false}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: 400, textAlign: "center",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "#D4AF37",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>
            Order Placed!
          </h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
            Your Xerovolt panel is being processed. You'll receive a confirmation shortly.
          </p>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#D4AF37", marginBottom: 24 }}>
            ₹ {price.total.toLocaleString("en-IN")}
          </div>
          <button
            onClick={() => { clearAll(); router.push("/configurator/panel"); }}
            style={{
              padding: "10px 28px", background: "#D4AF37",
              border: "none", borderRadius: 7, color: "#0a0a0a",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >
            Configure Another Panel
          </button>
        </div>
      </ConfiguratorLayout>
    );
  }

  return (
    <ConfiguratorLayout currentStep="cart" showBottomBar={false}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 4, height: 24, background: "#D4AF37", borderRadius: 2 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Your Cart</h2>
      </div>

      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
        {/* Left: Panel preview */}
        <div style={{ flex: 1 }}>
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor}
            slots={state.slots}
            width={560}
            height={360}
            showLabels={true}
          />

          {/* Bottom action bar (fixed-style inside content) */}
          <div style={{
            marginTop: 20,
            display: "flex", alignItems: "center", gap: 12,
            flexWrap: "wrap",
          }}>
            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #e0e0e0", borderRadius: 7, overflow: "hidden" }}>
              <span style={{ fontSize: 12, color: "#888", padding: "7px 10px" }}>QTY</span>
              <button
                onClick={() => setQty(state.qty - 1)}
                disabled={state.qty <= 1}
                style={{ padding: "7px 12px", background: "#f9f9f9", border: "none", borderLeft: "1px solid #e0e0e0", cursor: "pointer", fontSize: 16, color: "#555" }}
              >−</button>
              <span style={{ padding: "7px 16px", fontSize: 14, fontWeight: 700, borderLeft: "1px solid #e0e0e0", borderRight: "1px solid #e0e0e0" }}>
                {state.qty}
              </span>
              <button
                onClick={() => setQty(state.qty + 1)}
                style={{ padding: "7px 12px", background: "#f9f9f9", border: "none", cursor: "pointer", fontSize: 16, color: "#555" }}
              >+</button>
            </div>

            {/* Clear */}
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", background: "transparent",
              border: "1px solid #ff4444", borderRadius: 6,
              color: "#ff4444", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              </svg>
              Clear Selection
            </button>

            {/* Add note */}
            <button
              onClick={() => setNoteOpen(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", background: "transparent",
                border: "1px solid #e0e0e0", borderRadius: 6,
                color: "#555", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Add Order Note
            </button>

            <div style={{ flex: 1 }} />

            <button style={{
              padding: "9px 18px", background: "#fff",
              border: "1px solid #e0e0e0", borderRadius: 6,
              color: "#555", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>
              ⬡ Download Preview
            </button>

            <button style={{
              padding: "9px 18px", background: "#fff",
              border: "1px solid #D4AF37", borderRadius: 6,
              color: "#D4AF37", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              Add to Cart
            </button>

            <button
              onClick={handlePlaceOrder}
              style={{
                padding: "9px 24px", background: "#D4AF37",
                border: "none", borderRadius: 6,
                color: "#0a0a0a", fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              Place Order →
            </button>
          </div>

          {/* Order note input */}
          {noteOpen && (
            <div style={{ marginTop: 12 }}>
              <textarea
                placeholder="Add any special instructions for your order..."
                value={state.orderNote}
                onChange={e => setOrderNote(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px",
                  border: "1px solid #e0e0e0", borderRadius: 8,
                  fontSize: 12, color: "#1a1a1a", resize: "vertical",
                  outline: "none", minHeight: 80, fontFamily: "inherit",
                }}
              />
            </div>
          )}
        </div>

        {/* Right: Order summary card */}
        <div style={{
          width: 300,
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 12,
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Order Summary</span>
            <span style={{ fontSize: 11, color: "#aaa" }}>Qty: {state.qty}</span>
          </div>

          {/* Line items */}
          <div style={{ padding: "14px 20px" }}>
            {[
              { label: "Panel",       value: panel?.name },
              { label: "Material",    value: state.material ? (state.material.charAt(0).toUpperCase() + state.material.slice(1)) : null },
              { label: "Size",        value: size?.label },
              { label: "Technology",  value: tech?.name },
            ].map(item => item.value && (
              <div key={item.label} style={{
                display: "flex", justifyContent: "space-between",
                marginBottom: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 11, color: "#aaa" }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", textAlign: "right", maxWidth: 160 }}>
                  {item.value}
                </span>
              </div>
            ))}

            {/* Accessories */}
            {acc && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#aaa" }}>Accessories</span>
                <div style={{ textAlign: "right", maxWidth: 160 }}>
                  <div style={{ fontSize: 10, color: "#bbb" }}>{acc.modularSize} Modular:</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>{acc.name}</div>
                </div>
              </div>
            )}

            {/* Color */}
            {matColor && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#aaa" }}>Color</span>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: matColor.hex, border: "1px solid rgba(0,0,0,0.1)",
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>
                    Material: {matColor.name}
                  </span>
                </div>
              </div>
            )}

            {/* Icons count */}
            {state.slots.filter(s => s.iconId).length > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#aaa" }}>Icons</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>
                  {state.slots.filter(s => s.iconId).length} custom icons
                </span>
              </div>
            )}
          </div>

          {/* Price breakdown */}
          <div style={{ borderTop: "1px solid #f0f0f0", padding: "14px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", marginBottom: 12 }}>
              Price Breakdown:
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#888" }}>Base Price</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                ₹ {price.base.toLocaleString("en-IN")}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: "#D4AF37" }}>GST (18%)</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#D4AF37" }}>
                ₹ {price.gst.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Grand total */}
            <div style={{
              background: "#f9f6ed",
              border: "1px solid #e8d88a",
              borderRadius: 8,
              padding: "12px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Grand Total</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>(incl. GST)</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#D4AF37" }}>
                ₹ {price.total.toLocaleString("en-IN")}
              </div>
            </div>

            {/* Note */}
            <div style={{
              marginTop: 10, padding: "8px 10px",
              background: "#fff8f8", border: "1px solid #fdd",
              borderRadius: 6, fontSize: 10, color: "#cc6666", lineHeight: 1.4,
            }}>
              Note: Courier charges will be considered extra and this price excludes the courier charges.
            </div>
          </div>
        </div>
      </div>
    </ConfiguratorLayout>
  );
}