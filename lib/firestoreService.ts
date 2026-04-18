// lib/firestoreService.ts — Xerovolt Panel Config CRUD

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb, PANEL_CONFIGS_PATH, XEROVOLT_APP_ID } from "./firebase";
import { PanelConfig, SlotConfig } from "../types";

const db = () => getFirebaseDb();
const colRef = () => collection(db(), PANEL_CONFIGS_PATH());

export async function savePanelConfig(
  config: Omit<PanelConfig, "createdAt" | "updatedAt">
): Promise<void> {
  const ref = doc(colRef(), config.id);
  await setDoc(
    ref,
    {
      ...config,
      updatedAt: Date.now(),
      createdAt: config.id ? (await getDoc(ref)).data()?.createdAt ?? Date.now() : Date.now(),
    },
    { merge: true }
  );
}

export async function loadPanelConfig(id: string): Promise<PanelConfig | null> {
  const snap = await getDoc(doc(colRef(), id));
  if (!snap.exists()) return null;
  return snap.data() as PanelConfig;
}

export async function listPanelConfigs(): Promise<PanelConfig[]> {
  const q = query(colRef(), orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PanelConfig);
}

export async function deletePanelConfig(id: string): Promise<void> {
  await deleteDoc(doc(colRef(), id));
}