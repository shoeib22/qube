import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQAxC7sTetgJAvzcBV2wnPPqV22aqT7S4",
  authDomain: "cube-8c773.firebaseapp.com",
  projectId: "cube-8c773",
  storageBucket: "cube-8c773.appspot.com",
  messagingSenderId: "916919033310",
  appId: "1:916919033310:web:f106dc940a54ad6480514f",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// ✅ Proper Firestore init
let db;

if (typeof window !== "undefined") {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });

  enableIndexedDbPersistence(db).catch(() => {
    console.warn("Firestore persistence failed (likely multiple tabs open)");
  });
} else {
  db = getFirestore(app);
}

export { db };
