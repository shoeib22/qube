import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// ✅ FIX: Import from 'firebase/auth', NOT 'firebase-admin/auth'
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQAxC7sTetgJAvzcBV2wnPPqV22aqT7S4",
  authDomain: "cube-8c773.firebaseapp.com",
  databaseURL: "https://cube-8c773-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cube-8c773",
  storageBucket: "cube-8c773.firebasestorage.app",
  messagingSenderId: "916919033310",
  appId: "1:916919033310:web:920fd4fa0d65402c80514f",
  measurementId: "G-CT3T4W3CF5"
};

// Initialize Firebase (ensuring single instance for Next.js hydration)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ✅ This will now work in the browser
export const auth = getAuth(app);

// Initialize Firestore with the named database 'qube-tech'
export const db = getFirestore(app, 'qube-tech');

// Initialize Storage
export const storage = getStorage(app);

// Instead of creating new storage each time, reuse existing
export const getFirebaseStorage = () => storage;

// App ID (used in your storage path)
export const XEROVOLT_APP_ID = "xerovolt";

// Dynamic path generator
export const ICONS_STORAGE_PATH = (appId: string) =>
  `apps/${appId}/icons`;
// ✅ Firestore helper (same pattern as storage)
export const getFirebaseDb = () => db;

// ✅ Collection path builder
export const PANEL_CONFIGS_PATH = (userId: string) =>
  `users/${userId}/panelConfigs`;
// Default export (optional)
// ✅ Wait for Firebase auth to initialize properly
export const authenticateUser = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      if (user) {
        resolve(user);
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
};
export default app;