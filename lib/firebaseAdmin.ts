import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.SERVICE_ACCOUNT_KEY) {
      // In production - use the secret
      const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✓ Firebase Admin initialized with service account');
    } else {
      // In development - use application default credentials
      admin.initializeApp();
      console.log('✓ Firebase Admin initialized with default credentials');
    }
  } catch (error) {
    console.error('✗ Firebase admin initialization error:', error);
    throw error;
  }
}

export const db = admin.firestore();
export default admin;