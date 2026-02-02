import { initializeApp, getApps, cert, App, getApp } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

let adminApp: App;

// Match these exactly to your apphosting.yaml
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const b64Key = process.env.FIREBASE_PRIVATE_KEY_B64; // Updated variable name

if (getApps().length === 0) {
  if (projectId && clientEmail && b64Key) {
    try {
      // Decode the Base64 private key
      const privateKey = Buffer.from(b64Key.trim(), 'base64').toString('utf8');

      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: 'cube-8c773.firebasestorage.app',
      });
      console.log('✅ [FirebaseAdmin] Initialized successfully with Base64 Key');
    } catch (error: any) {
      console.error('❌ [FirebaseAdmin] Initialization Failed:', error.message);
      throw new Error(`Failed to initialize Firebase Admin: ${error.message}`);
    }
  } else {
    console.error('❌ [FirebaseAdmin] Missing Env Vars. Check apphosting.yaml and Secrets.');
    throw new Error('Firebase environment variables are missing.');
  }
} else {
  adminApp = getApp();
}

export const auth: Auth = getAuth(adminApp);
export const db: Firestore = getFirestore(adminApp, 'qube-tech'); //
export const storage: Storage = getStorage(adminApp);

export default adminApp;