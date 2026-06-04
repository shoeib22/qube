// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// -----------------------------------------------------------------
// 🔐 Firebase Config
// Uses environment variables for security, with your original keys as fallbacks
// -----------------------------------------------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCQAxC7sTetgJAvzcBV2wnPPqV22aqT7S4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cube-8c773.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://cube-8c773-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cube-8c773",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cube-8c773.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "916919033310",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:916919033310:web:920fd4fa0d65402c80514f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CT3T4W3CF5",
};

// 🚀 Initialize Firebase (prevents multiple instances in Next.js)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// -----------------------------------------------------------------
// 📦 Core Services
// -----------------------------------------------------------------
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🔁 Service Helpers
export const getFirebaseDb = () => db;
export const getFirebaseStorage = () => storage;

// -----------------------------------------------------------------
// 📂 App Constants & Paths
// -----------------------------------------------------------------
export const XEROVOLT_APP_ID = "xerovolt";
export const ICONS_STORAGE_PATH = (appId: string) => `apps/${appId}/icons`;
export const PANEL_CONFIGS_PATH = () => "panelConfigs"; // TOP-LEVEL ✅

// -----------------------------------------------------------------
// 👤 Auth Helpers
// -----------------------------------------------------------------
export const getCurrentUser = (): User | null => auth.currentUser;

// ⏳ Wait for auth to initialize (no crashes)
export const waitForAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user); // null if not logged in
    });
  });
};

// ⏱️ Export server timestamp helper
export const now = () => serverTimestamp();

// -----------------------------------------------------------------
// 🧩 TYPES
// -----------------------------------------------------------------
export type PanelModule = {
  instanceId: string;
  id: string;
  name: string;
  size: number;
};

export type PanelConfig = {
  model: string;         // e.g. "6-gang"
  panelSize: number;     // 6
  material: string;      // "glass"
  materialColor: string; // "mat-black"
  frameColor: string;    // "frm-gold"
  modules: PanelModule[];
  iconMapping: Record<string, string>; // slotIndex → iconId
  updatedAt?: unknown;   // serverTimestamp
};

// -----------------------------------------------------------------
// 🔑 SESSION KEY (Cart ID)
// Stored in sessionStorage so it survives tab reloads but resets 
// when the browser is fully closed.
// -----------------------------------------------------------------
export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem("xerovolt_session");
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("xerovolt_session", id);
  }
  return id;
}

// -----------------------------------------------------------------
// 💾 SAVE — upsert the whole panel config under sessions/{sessionId}
// -----------------------------------------------------------------
export async function savePanelConfig(config: Omit<PanelConfig, "updatedAt">): Promise<void> {
  const sessionId = getSessionId();
  await setDoc(
    doc(db, "sessions", sessionId),
    { ...config, updatedAt: serverTimestamp() },
    { merge: true }
  );
  // Mirror to localStorage as a fast offline fallback
  localStorage.setItem("xerovolt_panel_config", JSON.stringify(config));
}

// -----------------------------------------------------------------
// 📥 LOAD — returns Firestore data, falls back to localStorage
// -----------------------------------------------------------------
export async function loadPanelConfig(): Promise<PanelConfig | null> {
  try {
    const sessionId = getSessionId();
    const snap = await getDoc(doc(db, "sessions", sessionId));
    if (snap.exists()) return snap.data() as PanelConfig;
  } catch {
    // offline — fall through to localStorage
  }
  const local = localStorage.getItem("xerovolt_panel_config");
  return local ? (JSON.parse(local) as PanelConfig) : null;
}

// -----------------------------------------------------------------
// 🛒 SUBMIT ORDER — copy the current session doc into /orders
// -----------------------------------------------------------------
export async function submitOrder(
  extra: { customerName?: string; email?: string; phone?: string } = {}
): Promise<string> {
  const config = await loadPanelConfig();
  const ref = await addDoc(collection(db, "orders"), {
    ...config,
    ...extra,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export default app;