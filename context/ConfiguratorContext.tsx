"use client";
// context/ConfiguratorContext.tsx

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { ConfiguratorState, SlotAssignment } from "../types/configurator";

const DEFAULT_STATE: ConfiguratorState = {
  panel: null,
  material: null,
  size: null,
  accessory: null,
  slots: [],
  materialColor: null,
  frameColor: null,
  technology: null,
  qty: 1,
  orderNote: "",
};

interface ConfiguratorContextValue {
  state: ConfiguratorState;
  setPanel: (id: string) => void;
  setMaterial: (id: string) => void;
  setSize: (id: string) => void;
  setAccessory: (id: string) => void;
  setSlots: (slots: SlotAssignment[]) => void;
  assignIcon: (slotIndex: number, iconId: string, iconName: string) => void;
  clearSlot: (slotIndex: number) => void;
  setMaterialColor: (id: string) => void;
  setFrameColor: (id: string) => void;
  setTechnology: (id: string) => void;
  setQty: (qty: number) => void;
  setOrderNote: (note: string) => void;
  clearAll: () => void;
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfiguratorState>(DEFAULT_STATE);

  const setPanel = useCallback((id: string) => setState(s => ({ ...s, panel: id })), []);
  const setMaterial = useCallback((id: string) => setState(s => ({ ...s, material: id })), []);
  const setSize = useCallback((id: string) => setState(s => ({ ...s, size: id, slots: [], accessory: null })), []);
  const setAccessory = useCallback((id: string) => setState(s => ({ ...s, accessory: id, slots: [] })), []);
  const setSlots = useCallback((slots: SlotAssignment[]) => setState(s => ({ ...s, slots })), []);
  const assignIcon = useCallback((slotIndex: number, iconId: string, iconName: string) => {
    setState(s => {
      const existing = s.slots.filter(sl => sl.slotIndex !== slotIndex);
      return { ...s, slots: [...existing, { slotIndex, iconId, iconName }] };
    });
  }, []);
  const clearSlot = useCallback((slotIndex: number) => {
    setState(s => ({ ...s, slots: s.slots.filter(sl => sl.slotIndex !== slotIndex) }));
  }, []);
  const setMaterialColor = useCallback((id: string) => setState(s => ({ ...s, materialColor: id })), []);
  const setFrameColor = useCallback((id: string) => setState(s => ({ ...s, frameColor: id })), []);
  const setTechnology = useCallback((id: string) => setState(s => ({ ...s, technology: id })), []);
  const setQty = useCallback((qty: number) => setState(s => ({ ...s, qty: Math.max(1, qty) })), []);
  const setOrderNote = useCallback((note: string) => setState(s => ({ ...s, orderNote: note })), []);
  const clearAll = useCallback(() => setState(DEFAULT_STATE), []);

  return (
    <ConfiguratorContext.Provider value={{
      state, setPanel, setMaterial, setSize, setAccessory, setSlots,
      assignIcon, clearSlot, setMaterialColor, setFrameColor, setTechnology,
      setQty, setOrderNote, clearAll
    }}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) throw new Error("useConfigurator must be used inside ConfiguratorProvider");
  return ctx;
}
