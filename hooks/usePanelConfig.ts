"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PanelConfig, SlotConfig } from "../types";
import {
  createDefaultConfig,
  createDefaultSlotConfig,
} from "../lib/panelLayout";
import {
  savePanelConfig,
  loadPanelConfig,
  listPanelConfigs,
} from "../lib/firestoreService";
import { waitForAuth } from "../lib/firebase";

interface UsePanelConfigReturn {
  config: PanelConfig;
  userId: string | null;
  selectedSlotId: number | null;
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  savedConfigs: PanelConfig[];
  setSelectedSlotId: (id: number | null) => void;
  assignIconToSlot: (slotId: number, iconId: string) => void;
  removeIconFromSlot: (slotId: number) => void;
  updateSlotConfig: (slotId: number, updates: Partial<SlotConfig>) => void;
  saveConfig: () => Promise<void>;
  loadConfig: (id: string) => Promise<void>;
  newConfig: () => void;
  renameConfig: (name: string) => void;
  refreshSavedConfigs: () => Promise<void>;
}

export function usePanelConfig(): UsePanelConfigReturn {
  const [userId, setUserId] = useState<string | null>(null);

  const [config, setConfig] = useState<PanelConfig>(() =>
    createDefaultConfig("anonymous")
  );

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<PanelConfig[]>([]);

  const isFirstMount = useRef(true);

  // ✅ FIXED: Authentication
  useEffect(() => {
    waitForAuth()
      .then((user) => {
        const uid = user.uid;

        setUserId(uid);

        // Inject userId into config
        setConfig((prev) => ({
          ...prev,
          userId: uid,
        }));

        // Load saved configs
        listPanelConfigs()
          .then(setSavedConfigs)
          .catch(console.warn);
      })
      .catch(console.error);
  }, []);

  // Track dirty state
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setIsDirty(true);
  }, [config.slots, config.name]);

  const assignIconToSlot = useCallback((slotId: number, iconId: string) => {
    setConfig((prev) => ({
      ...prev,
      slots: prev.slots.map((s) =>
        s.slotId === slotId ? { ...s, iconId } : s
      ),
    }));
    setSelectedSlotId(slotId);
  }, []);

  const removeIconFromSlot = useCallback(
    (slotId: number) => {
      setConfig((prev) => ({
        ...prev,
        slots: prev.slots.map((s) =>
          s.slotId === slotId ? createDefaultSlotConfig(slotId) : s
        ),
      }));

      if (selectedSlotId === slotId) {
        setSelectedSlotId(null);
      }
    },
    [selectedSlotId]
  );

  const updateSlotConfig = useCallback(
    (slotId: number, updates: Partial<SlotConfig>) => {
      setConfig((prev) => ({
        ...prev,
        slots: prev.slots.map((s) =>
          s.slotId === slotId ? { ...s, ...updates } : s
        ),
      }));
    },
    []
  );

  const saveConfig = useCallback(async () => {
    if (!userId) return;

    setIsSaving(true);

    try {
      const updated = {
        ...config,
        userId,
        updatedAt: Date.now(),
      };

      await savePanelConfig(updated);

      setConfig(updated);
      setIsDirty(false);

      const refreshed = await listPanelConfigs();
      setSavedConfigs(refreshed);
    } catch (err) {
      console.error("[Xerovolt] Save error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [config, userId]);

  const loadConfig = useCallback(async (id: string) => {
    setIsLoading(true);

    try {
      const loaded = await loadPanelConfig(id);

      if (loaded) {
        setConfig(loaded);
        setIsDirty(false);
        setSelectedSlotId(null);
      }
    } catch (err) {
      console.error("[Xerovolt] Load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const newConfig = useCallback(() => {
    setConfig(createDefaultConfig(userId || "anonymous"));
    setSelectedSlotId(null);
    setIsDirty(false);
  }, [userId]);

  const renameConfig = useCallback((name: string) => {
    setConfig((prev) => ({ ...prev, name }));
  }, []);

  const refreshSavedConfigs = useCallback(async () => {
    const configs = await listPanelConfigs();
    setSavedConfigs(configs);
  }, []);

  return {
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
  };
}