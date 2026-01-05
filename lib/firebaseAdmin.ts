import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!privateKey) {
      throw new Error("FIREBASE_PRIVATE_KEY is missing from environment variables.");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // This regex ensures the newlines are correctly parsed
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin successfully initialized');
  } catch (error: any) {
    console.error('❌ Firebase Admin init error:', error.message);
  }
}

export const auth = admin.auth();
export default admin;