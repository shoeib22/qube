"use client";

import React, { useState, useCallback } from "react";
import { usePanelConfig } from "@/hooks/usePanelConfig";
import { useIconUpload } from "@/hooks/useIconUpload";
import { generateEngravingSVG, downloadSVG } from "@/lib/svgExport";

import Toolbar from "@/components/Toolbar";
import IconLibrarySidebar from "@/components/IconLibrarySidebar";
import PanelCanvas from "@/components/PanelCanvas";
import LogicMappingSidebar from "@/components/LogicMappingSidebar";
import StatusBar from "@/components/StatusBar";

export default function PanelCustomizerPage() {
  const {
    config,
    userId,
    selectedSlotId,
    isDirty,
    isSaving,
    isLoading,
    savedConfigs,
    setSelectedSlotId,
    assignIconToSlot,
    removeIconFromSlot,
    updateSlotConfig,
    saveConfig,
    loadConfig,
    newConfig,
    renameConfig,
    refreshSavedConfigs,
  } = usePanelConfig();

  const {
    customIcons,
    isProcessing,
    uploadError,
    handleFileUpload,
    removeCustomIcon,
    customIconDataUrls,
  } = useIconUpload();

  const [draggingIconId, setDraggingIconId] = useState<string | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleIconDragStart = useCallback((iconId: string) => {
    setDraggingIconId(iconId);
  }, []);

  const handleIconDragEnd = useCallback(() => {
    setDraggingIconId(null);
  }, []);

  const handleDropOnSlot = useCallback(
    (slotId: number, iconId: string) => {
      assignIconToSlot(slotId, iconId);
      setDraggingIconId(null);
    },
    [assignIconToSlot]
  );

  const handleFileUploadWrapper = useCallback(
    async (file: File) => {
      if (!userId) return;
      await handleFileUpload(file, userId);
    },
    [handleFileUpload, userId]
  );

  const handleExportSVG = useCallback(() => {
    const svg = generateEngravingSVG(config, customIconDataUrls);
    const safeName = config.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    downloadSVG(svg, `xerovolt_${safeName}_engraving.svg`);
  }, [config, customIconDataUrls]);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Clear all icons from the panel?")) {
      config.slots.forEach((s) => {
        if (s.iconId) removeIconFromSlot(s.slotId);
      });
    }
  }, [config.slots, removeIconFromSlot]);

  const selectedSlotConfig = selectedSlotId
    ? config.slots.find((s) => s.slotId === selectedSlotId) ?? null
    : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        background: "#0a0a0a",
        color: "#e0e0e0",
        fontFamily:
          "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Global CSS for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus {
          border-color: #D4AF37 !important;
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.15);
        }
      `}</style>

      {/* Toolbar */}
      <Toolbar
        configName={config.name}
        isDirty={isDirty}
        isSaving={isSaving}
        savedConfigs={savedConfigs}
        onSave={saveConfig}
        onNew={newConfig}
        onLoadConfig={loadConfig}
        onExportSVG={handleExportSVG}
        onDeleteSlots={handleClearAll}
      />

      {/* Main workspace */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Left Sidebar — Icon Library */}
        <IconLibrarySidebar
          customIcons={customIcons}
          customIconDataUrls={customIconDataUrls}
          isProcessing={isProcessing}
          uploadError={uploadError}
          userId={userId}
          onIconDragStart={handleIconDragStart}
          onIconDragEnd={handleIconDragEnd}
          onFileUpload={handleFileUploadWrapper}
          onRemoveCustomIcon={removeCustomIcon}
        />

        {/* Center — Panel Canvas */}
        <PanelCanvas
          slots={config.slots}
          selectedSlotId={selectedSlotId}
          draggingIconId={draggingIconId}
          customIconDataUrls={customIconDataUrls}
          onSlotClick={setSelectedSlotId}
          onDropIcon={handleDropOnSlot}
          onSlotDoubleClick={(id) => {
            setSelectedSlotId(id);
            removeIconFromSlot(id);
          }}
        />

        {/* Right Sidebar — Logic Mapping */}
        <LogicMappingSidebar
          selectedSlotId={selectedSlotId}
          slotConfig={selectedSlotConfig}
          customIconDataUrls={customIconDataUrls}
          onUpdateSlot={updateSlotConfig}
          onRemoveIcon={removeIconFromSlot}
          onSelectSlot={setSelectedSlotId}
          configName={config.name}
          onRenameConfig={renameConfig}
          isSaving={isSaving}
          isDirty={isDirty}
          onSave={saveConfig}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,10,10,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 300,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: "2px solid #D4AF37",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              <div style={{ color: "#D4AF37", fontSize: 12, letterSpacing: 2 }}>
                LOADING…
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar
        config={config}
        userId={userId}
        selectedSlotId={selectedSlotId}
        isDirty={isDirty}
      />
    </div>
  );
}