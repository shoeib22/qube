// hooks/useIconUpload.ts — Xerovolt Custom Icon Upload Hook

"use client";

import { useState, useCallback } from "react";
import { IconAsset } from "../types";
import { processUploadedFile, uploadCustomIcon } from "@/lib/Storageservice";

interface UseIconUploadReturn {
  customIcons: IconAsset[];
  isProcessing: boolean;
  uploadError: string | null;
  handleFileUpload: (file: File, userId: string) => Promise<IconAsset | null>;
  removeCustomIcon: (iconId: string) => void;
  customIconDataUrls: Record<string, string>;
}

export function useIconUpload(): UseIconUploadReturn {
  const [customIcons, setCustomIcons] = useState<IconAsset[]>([]);
  const [customIconDataUrls, setCustomIconDataUrls] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(
    async (file: File, userId: string): Promise<IconAsset | null> => {
      const allowed = ["image/svg+xml", "image/png", "image/jpeg", "image/jpg"];
      if (!allowed.includes(file.type)) {
        setUploadError("Only SVG, PNG, and JPG files are supported.");
        return null;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be under 5MB.");
        return null;
      }

      setIsProcessing(true);
      setUploadError(null);

      try {
        // Process to B&W
        const processedDataUrl = await processUploadedFile(file);
        const iconId = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        // Store data URL locally for immediate use
        setCustomIconDataUrls((prev) => ({ ...prev, [iconId]: processedDataUrl }));

        // Upload to Firebase Storage (non-blocking)
        let thumbnailUrl = processedDataUrl;
        try {
          thumbnailUrl = await uploadCustomIcon(userId, iconId, file, processedDataUrl);
        } catch {
          // Continue with local data URL if upload fails
          console.warn("[Xerovolt] Storage upload failed, using local URL");
        }

        const asset: IconAsset = {
          id: iconId,
          name: file.name.replace(/\.[^.]+$/, ""),
          category: "Custom",
          svgContent: processedDataUrl,
          thumbnailUrl,
          isCustom: true,
          uploadedAt: Date.now(),
        };

        setCustomIcons((prev) => [asset, ...prev]);
        return asset;
      } catch (err) {
        setUploadError("Failed to process image. Please try a different file.");
        console.error("[Xerovolt] Upload error:", err);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const removeCustomIcon = useCallback((iconId: string) => {
    setCustomIcons((prev) => prev.filter((i) => i.id !== iconId));
    setCustomIconDataUrls((prev) => {
      const next = { ...prev };
      delete next[iconId];
      return next;
    });
  }, []);

  return {
    customIcons,
    isProcessing,
    uploadError,
    handleFileUpload,
    removeCustomIcon,
    customIconDataUrls,
  };
}