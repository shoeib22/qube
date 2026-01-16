import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Manually load .env.local if environment variables aren't set
// This works around Next.js not loading .env.local for API routes in some cases
if (!process.env.FIREBASE_PROJECT_ID) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf-8');
      envFile.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
          const match = line.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            process.env[key] = value;
          }
        }
      });
      console.log('📁 Manually loaded .env.local file');
    }
  } catch (error) {
    console.warn('⚠️  Could not manually load .env.local:', (error as Error).message);
  }
}

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    console.log('🔧 [FirebaseAdmin] Initializing...');
    console.log(`   FIREBASE_PROJECT_ID: ${projectId || 'MISSING'}`);
    console.log(`   FIREBASE_CLIENT_EMAIL: ${clientEmail || 'MISSING'}`);
    console.log(`   FIREBASE_PRIVATE_KEY: ${privateKey ? `[PRESENT - ${privateKey.length} chars]` : 'MISSING'}`);

    // Only attempt to initialize if we have the key, or if we are not in a build context (hard to detect, but soft check helps)
    if (privateKey && projectId && clientEmail) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          // This regex ensures the newlines are correctly parsed
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        projectId: projectId, // Explicitly set projectId at top level
        databaseURL: `https://${projectId}.firebaseio.com` // Explicitly set databaseURL
      });
      console.log('✅ Firebase Admin successfully initialized');
      console.log(`   Project: ${admin.app().options.projectId}`);
      // Try to initialize firestore with settings to force preferRest if needed, though usually not accessible here directly
    } else {
      console.warn('⚠️ Firebase Admin credentials incomplete.');
      console.warn('   Missing:', {
        projectId: !projectId,
        clientEmail: !clientEmail,
        privateKey: !privateKey
      });
    }
  } catch (error: any) {
    console.error('❌ Firebase Admin init error:', error.message);
    console.error('   Stack:', error.stack);
  }
}

// Export auth safely. If init failed, accessing this might throw, but imports won't crash the build immediately unless accessed.
// However, nextjs build might access it. 
// We'll trust that admin.auth() is lazy or we return a safe fallback if app not initialized.
let auth: admin.auth.Auth;
try {
  auth = admin.auth();
} catch (e) {
  // If app not initialized, create a proxy or null (but types expect Auth)
  // Logic: during build, we might not need actual auth.
  console.warn("Auth not initialized (likely build time).");
  auth = {} as any;
}

export { auth };
export default admin;