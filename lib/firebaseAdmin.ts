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
    // 1. Try to load from serviceAccountKey.json first (Development/Local)
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
      try {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
          projectId: serviceAccount.project_id
        });
        console.log('✅ [FirebaseAdmin] Initialized with serviceAccountKey.json');
        console.log(`   Project: ${serviceAccount.project_id}`);
      } catch (error: any) {
        console.error('❌ [FirebaseAdmin] Failed to load service account file:', error.message);
      }
    }

    // 2. If not initialized yet, try Environment Variables (Production/Vercel)
    if (!admin.apps.length) {
      try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

        console.log('🔧 [FirebaseAdmin] Initializing from Env Vars...');

        if (privateKey && projectId && clientEmail) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: projectId,
              clientEmail: clientEmail,
              // This regex ensures the newlines are correctly parsed
              privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
            projectId: projectId,
            databaseURL: `https://${projectId}.firebaseio.com`
          });
          console.log('✅ [FirebaseAdmin] Initialized from Env Vars');
        } else {
          console.warn('⚠️ [FirebaseAdmin] Env vars incomplete.');
        }
      } catch (error: any) {
        console.error('❌ [FirebaseAdmin] Env var init error:', error.message);
      }
    }
  } catch (error: any) {
    console.error('❌ [FirebaseAdmin] General init error:', error.message);
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