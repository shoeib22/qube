"use client";
// app/configurator/icons/page.tsx

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "../../../context/ConfiguratorContext";
import ConfiguratorLayout from "../../../components/configurator/ConfiguratorLayout";
import PanelPreview from "../../../components/configurator/PanelPreview";
import {
  ICONS, ICON_CATEGORIES, SIZES, getAccessoryById
} from "../../../lib/configuratorData";
import type { IconItem } from "../../../types/configurator";

export default function IconsPage() {
  const { state, assignIcon, clearSlot } = useConfigurator();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Accessories");
  const [search, setSearch] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [draggingIcon, setDraggingIcon] = useState<IconItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const size = SIZES.find(s => s.id === state.size);
  const totalSlots = size ? size.totalModules : 0;
  const acc = getAccessoryById(state.accessory || "");
  const activeSlots = acc?.slots ?? totalSlots;

  const filteredIcons = ICONS.filter(ic =>
    ic.category === activeCategory &&
    (search === "" || ic.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleIconClick = (icon: IconItem) => {
    if (selectedSlot !== null && selectedSlot < activeSlots) {
      assignIcon(selectedSlot, icon.id, icon.name);
      // Move to next empty slot
      const nextEmpty = Array.from({ length: activeSlots }, (_, i) => i)
        .find(i => i > selectedSlot && !state.slots.find(s => s.slotIndex === i && s.iconId));
      setSelectedSlot(nextEmpty !== undefined ? nextEmpty : null);
    }
  };

  const handleSlotClick = (index: number) => {
    if (index >= activeSlots) return;
    setSelectedSlot(index === selectedSlot ? null : index);
  };

  const handleSlotDoubleClick = (index: number) => {
    clearSlot(index);
    setSelectedSlot(index);
  };

  const handleDragStart = (icon: IconItem, e: React.DragEvent) => {
    e.dataTransfer.setData("iconId", icon.id);
    e.dataTransfer.setData("iconName", icon.name);
    setDraggingIcon(icon);
  };

  const assignedCount = state.slots.filter(s => s.iconId).length;

  return (
    <ConfiguratorLayout
      currentStep="icons"
      canNext={true} // icons optional
      onNext={() => router.push("/configurator/color")}
      nextLabel="Next →"
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 24, background: "#D4AF37", borderRadius: 2 }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>Icons</h2>
          <span style={{ fontSize: 11, color: "#aaa", fontWeight: 500 }}>
            {assignedCount} / {activeSlots} assigned
          </span>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 14px", background: "#f0f0f0",
          border: "1px solid #e0e0e0", borderRadius: 6,
          fontSize: 12, fontWeight: 600, color: "#555", cursor: "pointer",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Icons List
        </button>
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* ── Left: Icon library ──────────────────────────────── */}
        <div style={{ width: 460, flexShrink: 0 }}>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#bbb" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search icons by name or number"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 34px",
                border: "1px solid #e0e0e0",
                borderRadius: 7,
                fontSize: 13,
                color: "#1a1a1a",
                background: "#fff",
                outline: "none",
              }}
            />
          </div>

          {/* Category tabs */}
          <div style={{
            display: "flex",
            gap: 0,
            flexWrap: "nowrap",
            overflowX: "auto",
            borderBottom: "2px solid #e8e8e8",
            marginBottom: 14,
            scrollbarWidth: "none",
          }}>
            {ICON_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 12px",
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${activeCategory === cat ? "#D4AF37" : "transparent"}`,
                  marginBottom: -2,
                  fontSize: 12,
                  fontWeight: activeCategory === cat ? 700 : 500,
                  color: activeCategory === cat ? "#D4AF37" : "#888",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.12s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Icons grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 6,
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 8,
            padding: 12,
            minHeight: 120,
          }}>
            {/* Upload custom icon tile for My Icons */}
            {activeCategory === "My Icons" && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%", aspectRatio: "1",
                  border: "1px dashed #ccc", borderRadius: 6,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer", background: "#fafafa",
                  gap: 3,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span style={{ fontSize: 7, color: "#bbb" }}>Upload</span>
              </div>
            )}

            {filteredIcons.map(icon => (
              <IconTile
                key={icon.id}
                icon={icon}
                isSelected={selectedSlot !== null && state.slots.find(s => s.slotIndex === selectedSlot)?.iconId === icon.id}
                onDragStart={handleDragStart}
                onDragEnd={() => setDraggingIcon(null)}
                onClick={() => handleIconClick(icon)}
              />
            ))}

            {filteredIcons.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#bbb", fontSize: 12, padding: 20 }}>
                No icons found
              </div>
            )}
          </div>

          {/* Instruction */}
          <div style={{ marginTop: 10, fontSize: 10, color: "#bbb", lineHeight: 1.5 }}>
            {selectedSlot !== null
              ? `Click an icon to assign it to Slot ${selectedSlot + 1}`
              : "Click a slot on the panel, then click an icon to assign it"}
          </div>

          <input ref={fileInputRef} type="file" accept=".svg,.png,.jpg" style={{ display: "none" }} />
        </div>

        {/* ── Right: Live panel ───────────────────────────────── */}
        <div style={{ flex: 1 }}>
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor}
            slots={state.slots}
            selectedSlot={selectedSlot}
            onSlotClick={handleSlotClick}
            width={560}
            height={360}
            showLabels={true}
            clickable={true}
          />

          <div style={{
            marginTop: 10, fontSize: 11, color: "#aaa",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Click a slot to select it, then pick an icon. Double-click a slot to clear it.
          </div>
        </div>
      </div>
    </ConfiguratorLayout>
  );
}

function IconTile({
  icon, isSelected, onDragStart, onDragEnd, onClick
}: {
  icon: IconItem;
  isSelected: boolean;
  onDragStart: (icon: IconItem, e: React.DragEvent) => void;
  onDragEnd: () => void;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      draggable
      onDragStart={e => onDragStart(icon, e)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={icon.name}
      style={{
        aspectRatio: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        border: `1px solid ${isSelected ? "#D4AF37" : hov ? "#ccc" : "#f0f0f0"}`,
        borderRadius: 6,
        background: isSelected ? "#fffbeb" : hov ? "#fafafa" : "#fff",
        cursor: "pointer",
        transition: "all 0.12s",
        padding: 4,
        userSelect: "none",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isSelected ? "#D4AF37" : hov ? "#4a6cf7" : "#4a90d9"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />
      <span style={{
        fontSize: 7,
        color: isSelected ? "#D4AF37" : "#aaa",
        textAlign: "center",
        lineHeight: 1.2,
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {icon.name}
      </span>
    </div>
  );
}