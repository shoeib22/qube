"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useConfigurator } from "@/context/ConfiguratorContext";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";
import PanelPreview from "@/components/configurator/PanelPreview";
import { BUILT_IN_ICONS } from "@/lib/iconLibrary";
import { ICON_CATEGORIES, getAccessoryById } from "@/lib/configuratorData";
import { useAuth } from "@/context/AuthContext";
import { processUploadedFile, uploadCustomIcon } from "@/lib/Storageservice";

interface CustomIcon {
  id: string;
  name: string;
  dataUrl: string;
}

export default function IconsPage() {
  const { state, assignIcon, clearSlot } = useConfigurator();
  const { user } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ICON_CATEGORIES[0]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [customIcons, setCustomIcons] = useState<CustomIcon[]>([]);
  const [customIconDataUrls, setCustomIconDataUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accessory = state.accessory ? getAccessoryById(state.accessory) : null;
  const slotCount = accessory?.slots ?? 2;

  const builtInFiltered = BUILT_IN_ICONS.filter(icon => {
    const matchesCategory = icon.category === activeCategory;
    const matchesSearch = !search || icon.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, iconId: string) => {
    e.dataTransfer.setData("text/plain", iconId);
  };

  const handleSlotDrop = (slotIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    const iconId = e.dataTransfer.getData("text/plain");
    if (!iconId) return;
    const icon = BUILT_IN_ICONS.find(i => i.id === iconId) ?? customIcons.find(i => i.id === iconId);
    if (icon) assignIcon(slotIndex, icon.id, icon.name);
  };

  const handleIconClick = (iconId: string, iconName: string) => {
    if (selectedSlot !== null) {
      assignIcon(selectedSlot, iconId, iconName);
      setSelectedSlot(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const dataUrl = await processUploadedFile(file);
      const iconId = `custom-${Date.now()}`;
      setCustomIconDataUrls(prev => ({ ...prev, [iconId]: dataUrl }));
      setCustomIcons(prev => [...prev, { id: iconId, name: file.name.replace(/\.[^/.]+$/, ""), dataUrl }]);
      uploadCustomIcon(user.uid, iconId, file, dataUrl).catch(console.error);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const allCategories = [...ICON_CATEGORIES, "My Icons"];
  const iconsToShow = search
    ? BUILT_IN_ICONS.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : activeCategory === "My Icons" ? [] : builtInFiltered;

  return (
    <ConfiguratorLayout
      currentStep="icons"
      canProceed={true}
      onNext={() => router.push("/configurator/color")}
    >
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-220px)]">

        {/* Left — icon library */}
        <div className="w-full md:w-[320px] md:flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col bg-white">
          {/* Search + upload */}
          <div className="p-2.5 border-b border-gray-100 flex gap-2">
            <div className="flex-1 relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search icons…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#155cfc]"
              />
            </div>
            <input ref={fileInputRef} type="file" accept=".svg,.png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-2.5 py-2 text-[10px] font-bold text-[#155cfc] border border-[#155cfc]/30 rounded-lg hover:bg-blue-50 whitespace-nowrap"
            >
              + Upload
            </button>
          </div>

          {/* Category tabs — horizontally scrollable */}
          <div className="overflow-x-auto border-b border-gray-100 flex-shrink-0">
            <div className="flex min-w-max px-2 py-1 gap-1">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearch(""); }}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md whitespace-nowrap transition-colors
                    ${activeCategory === cat ? "bg-[#155cfc] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Icons grid — capped height on mobile */}
          <div className="overflow-y-auto p-2.5 max-h-[38vh] md:max-h-none md:flex-1">
            {activeCategory === "My Icons" && !search ? (
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 text-center pt-2">Uploaded icons appear here</p>
                <div className="grid grid-cols-4 gap-2">
                  {customIcons.map(icon => (
                    <button key={icon.id} draggable onDragStart={e => handleDragStart(e, icon.id)}
                      onClick={() => handleIconClick(icon.id, icon.name)} title={icon.name}
                      className="aspect-square p-2 border border-gray-200 rounded-lg hover:border-[#155cfc] transition-colors">
                      <img src={icon.dataUrl} alt={icon.name} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {iconsToShow.map(icon => (
                  <button
                    key={icon.id}
                    draggable
                    onDragStart={e => handleDragStart(e, icon.id)}
                    onClick={() => handleIconClick(icon.id, icon.name)}
                    title={icon.name}
                    className="aspect-square p-2 border border-gray-200 rounded-lg hover:border-[#155cfc] hover:bg-blue-50 transition-colors text-[#155cfc]"
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile: toggle preview */}
          <button
            onClick={() => setShowPreview(v => !v)}
            className="md:hidden py-2.5 text-xs font-bold text-[#155cfc] border-t border-gray-200 bg-white"
          >
            {showPreview ? "Hide Panel Preview ▲" : "Show Panel Preview ▼"}
          </button>
        </div>

        {/* Right — live panel preview */}
        <div className={`flex-1 bg-[#111] flex-col items-center justify-center p-6 gap-3
          ${showPreview ? "flex" : "hidden"} md:flex`}
        >
          <PanelPreview
            sizeId={state.size}
            materialColorId={state.materialColor ?? "mc-black"}
            frameColorId={state.frameColor}
            slots={state.slots}
            slotCount={slotCount}
            selectedSlot={selectedSlot}
            onSlotClick={idx => setSelectedSlot(prev => prev === idx ? null : idx)}
            customIconDataUrls={customIconDataUrls}
            className="w-full max-w-[400px] mx-auto"
          />
          <p className="text-gray-500 text-xs text-center px-4">
            {selectedSlot !== null
              ? `Slot ${selectedSlot + 1} selected — tap an icon from the library`
              : "Tap a slot then pick an icon, or drag icons onto the panel"}
          </p>
          {selectedSlot !== null && state.slots.find(s => s.slotIndex === selectedSlot) && (
            <button onClick={() => { clearSlot(selectedSlot); setSelectedSlot(null); }}
              className="text-xs text-red-400">
              Remove icon from slot {selectedSlot + 1}
            </button>
          )}
        </div>
      </div>
    </ConfiguratorLayout>
  );
}
