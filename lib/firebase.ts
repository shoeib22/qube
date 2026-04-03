import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// ✅ FIX: Import from 'firebase/auth', NOT 'firebase-admin/auth'
import { getAuth } from 'firebase/auth';

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

export default app;