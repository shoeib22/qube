import { initializeApp, getApps, cert, App, getApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

let adminApp: App;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const b64Key = process.env.FIREBASE_PRIVATE_KEY_B64;

if (getApps().length === 0) {
  if (projectId && clientEmail && b64Key) {
    try {
      // 1. Decode and fix the formatting of the Private Key
      const privateKey = Buffer.from(b64Key.trim(), 'base64')
        .toString('utf8')
        .replace(/\\n/g, '\n'); // Essential for PEM formatting

      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: 'cube-8c773.firebasestorage.app',
      });
      console.log('✅ [FirebaseAdmin] Initialized successfully');
    } catch (error: any) {
      console.error('❌ [FirebaseAdmin] Initialization Failed:', error.message);
      throw error;
    }
  } else {
    // This will trigger during the Build phase if secrets aren't available yet
    // In Next.js, we sometimes want to skip this error during build
    console.warn('⚠️ [FirebaseAdmin] Env vars missing. This is normal during build if not using secrets.');
  }
} else {
  adminApp = getApp();
}

// 2. Database ID Logic
// If your Firestore is the default one, remove 'qube-tech'. 
// If you actually named your DB 'qube-tech' in the console, keep it.
export const auth: Auth = getAuth(adminApp!);
export const db: Firestore = getFirestore(adminApp!, '(default)'); 
export const storage: Storage = getStorage(adminApp!);

export default adminApp!;