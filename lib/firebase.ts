import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// ✅ FIX: Import from 'firebase/auth', NOT 'firebase-admin/auth'
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDbkdJNP3Pl4HBPqfVl-xqU1i3rrMjZZpA",
  authDomain: "cube-8c773.firebaseapp.com",
  projectId: "cube-8c773",
  storageBucket: "cube-8c773.firebasestorage.app",
  messagingSenderId: "119487702320",
  appId: "1:119487702320:web:b2f8dd2e0e2c78f5ec1f8c"
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