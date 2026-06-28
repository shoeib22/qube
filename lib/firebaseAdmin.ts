import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (getApps().length === 0) {
  if (projectId && clientEmail && privateKey) {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        // Ensure this matches your storage bucket name seen in console
        storageBucket: `cube-8c773.firebasestorage.app`, 
      });
      console.log('✅ [FirebaseAdmin] Initialized successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ [FirebaseAdmin] Initialization Failed:', message);
    }
  } else {
    console.warn('⚠️ [FirebaseAdmin] Missing Env Vars. Check your .env.local names.');
  }
}

// Get the initialized app instance
const app = getApps().length > 0 ? getApp() : null;

// CRITICAL: Pass 'qube-tech' as the second argument
export const db = app ? getFirestore(app, 'qube-tech') : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

export default app;