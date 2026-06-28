// components/IconLibrarySidebar.tsx — Xerovolt Left Sidebar

"use client";

import React, { useState, useRef, useCallback } from "react";
import { BUILT_IN_ICONS, ICON_CATEGORIES, BuiltInIcon } from "../lib/iconLibrary";
import { IconAsset } from "../types";

interface IconLibrarySidebarProps {
  customIcons: IconAsset[];
  customIconDataUrls: Record<string, string>;
  isProcessing: boolean;
  uploadError: string | null;
  userId: string | null;
  onIconDragStart: (iconId: string) => void;
  onIconDragEnd: () => void;
  onFileUpload: (file: File) => void;
  onRemoveCustomIcon: (iconId: string) => void;
}

export default function IconLibrarySidebar({
  customIcons,
  customIconDataUrls,
  isProcessing,
  uploadError,
  onIconDragStart,
  onIconDragEnd,
  onFileUpload,
  onRemoveCustomIcon,
}: IconLibrarySidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Lighting");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allCategories = ["Custom", ...ICON_CATEGORIES];

  const filteredIcons =
    activeCategory === "Custom"
      ? customIcons
      : BUILT_IN_ICONS.filter(
          (i) =>
            i.category === activeCategory &&
            (searchQuery === "" ||
              i.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );

  const handleDragStart = useCallback(
    (e: React.DragEvent, iconId: string) => {
      e.dataTransfer.setData("text/plain", iconId);
      e.dataTransfer.effectAllowed = "copy";
      onIconDragStart(iconId);
    },
    [onIconDragStart]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        background: "#111111",
        borderRight: "1px solid #2a2a2a",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#D4AF37",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Icon Library
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 13,
              height: 13,
              color: "#555",
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 6,
              color: "#e0e0e0",
              fontSize: 12,
              padding: "6px 8px 6px 28px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          padding: "10px 12px",
          borderBottom: "1px solid #1e1e1e",
        }}
      >
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "3px 8px",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.05em",
              borderRadius: 4,
              border: `1px solid ${activeCategory === cat ? "#D4AF37" : "#2a2a2a"}`,
              background: activeCategory === cat ? "#D4AF37" : "transparent",
              color: activeCategory === cat ? "#0a0a0a" : "#888",
              cursor: "pointer",
              transition: "all 0.12s",
            }}
          >
            {cat === "Custom" ? `Custom (${customIcons.length})` : cat}
          </button>
        ))}
      </div>

      {/* Upload Area (Custom tab or always visible) */}
      {activeCategory === "Custom" && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropZone}
          onClick={() => fileInputRef.current?.click()}
          style={{
            margin: "10px 12px",
            border: `1px dashed ${isProcessing ? "#D4AF37" : "#333"}`,
            borderRadius: 6,
            padding: "14px 10px",
            textAlign: "center",
            cursor: "pointer",
            background: "#0d0d0d",
            transition: "border-color 0.2s",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {isProcessing ? (
            <div style={{ color: "#D4AF37", fontSize: 11 }}>Processing B&W...</div>
          ) : (
            <>
              <svg
                style={{ width: 20, height: 20, color: "#444", margin: "0 auto 6px" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div style={{ fontSize: 10, color: "#555", lineHeight: 1.4 }}>
                Upload SVG / PNG / JPG
                <br />
                <span style={{ color: "#D4AF37" }}>Auto B&W processed</span>
              </div>
            </>
          )}
          {uploadError && (
            <div style={{ color: "#ff4444", fontSize: 10, marginTop: 6 }}>
              {uploadError}
            </div>
          )}
        </div>
      )}

      {/* Icon Grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 12px 16px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          alignContent: "start",
        }}
      >
        {activeCategory === "Custom"
          ? customIcons.map((icon) => (
              <CustomIconTile
                key={icon.id}
                icon={icon}
                dataUrl={customIconDataUrls[icon.id] || icon.thumbnailUrl || ""}
                onDragStart={handleDragStart}
                onDragEnd={onIconDragEnd}
                onRemove={onRemoveCustomIcon}
              />
            ))
          : (filteredIcons as BuiltInIcon[]).map((icon) => (
              <BuiltInIconTile
                key={icon.id}
                icon={icon}
                onDragStart={handleDragStart}
                onDragEnd={onIconDragEnd}
              />
            ))}

        {filteredIcons.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              color: "#444",
              fontSize: 11,
              textAlign: "center",
              paddingTop: 24,
            }}
          >
            {activeCategory === "Custom"
              ? "No custom icons yet"
              : "No icons match search"}
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Built-in Icon Tile ────────────────────────────────────────────────────────
function BuiltInIconTile({
  icon,
  onDragStart,
  onDragEnd,
}: {
  icon: BuiltInIcon;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, icon.id)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={icon.name}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 4px",
        borderRadius: 6,
        border: `1px solid ${hovered ? "#D4AF37" : "#1e1e1e"}`,
        background: hovered ? "#1a1500" : "#0d0d0d",
        cursor: "grab",
        transition: "all 0.12s",
        userSelect: "none",
      }}
    >
      <div
        style={{ color: hovered ? "#D4AF37" : "#aaa", width: 24, height: 24 }}
        dangerouslySetInnerHTML={{ __html: icon.svg }}
      />
      <span
        style={{
          fontSize: 8,
          color: hovered ? "#D4AF37" : "#555",
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {icon.name}
      </span>
    </div>
  );
}

// ── Custom Icon Tile ──────────────────────────────────────────────────────────
function CustomIconTile({
  icon,
  dataUrl,
  onDragStart,
  onDragEnd,
  onRemove,
}: {
  icon: IconAsset;
  dataUrl: string;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onRemove: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, icon.id)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={icon.name}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 4px",
        borderRadius: 6,
        border: `1px solid ${hovered ? "#D4AF37" : "#1e1e1e"}`,
        background: hovered ? "#1a1500" : "#0d0d0d",
        cursor: "grab",
        transition: "all 0.12s",
        userSelect: "none",
      }}
    >
      {/* Remove button */}
      {hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(icon.id);
          }}
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            width: 14,
            height: 14,
            background: "#ff4444",
            border: "none",
            borderRadius: 3,
            color: "white",
            fontSize: 9,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}

      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- data-URL user upload, not optimizable by next/image
        <img
          src={dataUrl}
          alt={icon.name}
          style={{
            width: 24,
            height: 24,
            objectFit: "contain",
            filter: "invert(1)",
          }}
        />
      ) : (
        <div style={{ width: 24, height: 24, background: "#222" }} />
      )}
      <span
        style={{
          fontSize: 8,
          color: hovered ? "#D4AF37" : "#555",
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {icon.name}
      </span>
    </div>
  );
}