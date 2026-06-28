import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCQAxC7sTetgJAvzcBV2wnPPqV22aqT7S4",
  authDomain: "cube-8c773.firebaseapp.com",
  databaseURL:
    "https://cube-8c773-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cube-8c773",
  storageBucket: "cube-8c773.firebasestorage.app",
  messagingSenderId: "916919033310",
  appId: "1:916919033310:web:920fd4fa0d65402c80514f",
  measurementId: "G-CT3T4W3CF5",
};

// 🚀 Initialize Firebase (prevents multiple instances in Next.js)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 🗄️ Firestore — targets 'qube-tech' named database (matches admin SDK)
export const db = getFirestore(app, 'qube-tech');

// 📦 Storage
export const storage = getStorage(app);

// 🔁 Helpers
export const getFirebaseDb = () => db;
export const getFirebaseStorage = () => storage;

// 🆔 App ID (for storage paths etc.)
export const XEROVOLT_APP_ID = "xerovolt";

// 📁 Storage path
export const ICONS_STORAGE_PATH = (appId: string) =>
  `apps/${appId}/icons`;

// 📁 Firestore collection (TOP-LEVEL ✅)
export const PANEL_CONFIGS_PATH = () => "panelConfigs";

// 👤 Get current user safely
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

// ⏱️ Export server timestamp helper (use this in your CRUD)
export const now = () => serverTimestamp();

export default app;