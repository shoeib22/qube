import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

/* ✅ SIMPLE, SAFE FIRESTORE INIT */
export const db = getFirestore(app);
