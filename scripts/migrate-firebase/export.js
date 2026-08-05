// One-off migration script: exports everything needed from the Firebase project
// (Firestore data, Auth users incl. password hashes, Storage objects) to local files
// under scripts/migrate-firebase/export/, for scripts/migrate-firebase/import.js to load
// into the self-hosted Supabase instance. Safe to re-run — it only reads from Firebase.
//
// Kept for historical reference after the migration — `firebase-admin` is intentionally
// not a project dependency anymore (the app itself never used it), so re-running this
// requires `npm install firebase-admin` first.
//
// Requires (in .env.local or the environment):
//   FIREBASE_PROJECT_ID=cube-8c773
//   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@cube-8c773.iam.gserviceaccount.com
//   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
//
// Usage: npm run migrate:export-firebase
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const OUT_DIR = path.join(__dirname, 'export');
const STORAGE_OUT_DIR = path.join(OUT_DIR, 'storage', 'products');

function requiredEnv(name) {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: requiredEnv('FIREBASE_PROJECT_ID'),
        clientEmail: requiredEnv('FIREBASE_CLIENT_EMAIL'),
        privateKey: requiredEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    }),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

const db = admin.firestore();
db.settings({ databaseId: 'qube-tech' });

function writeJson(name, data) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data, null, 2));
    console.log(`Wrote ${name}: ${Array.isArray(data) ? data.length : Object.keys(data).length} record(s)`);
}

async function exportCollection(name) {
    const snapshot = await db.collection(name).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function exportAuthUsers() {
    const users = [];
    let pageToken;
    do {
        const result = await admin.auth().listUsers(1000, pageToken);
        for (const u of result.users) {
            users.push({
                uid: u.uid,
                email: u.email,
                displayName: u.displayName,
                role: u.customClaims?.role,
                createdAt: u.metadata.creationTime,
                // passwordHash/passwordSalt are only populated for email/password users and
                // only when the Admin SDK credential has permission to read them — this is
                // exactly the mechanism `firebase auth:export` uses. If these come back
                // undefined for a user, scripts/migrate-firebase/import.js falls back to
                // creating them with a random password and sending a reset email instead of
                // failing the whole import.
                passwordHash: u.passwordHash,
                passwordSalt: u.passwordSalt,
            });
        }
        pageToken = result.pageToken;
    } while (pageToken);
    return users;
}

async function exportStorage() {
    fs.mkdirSync(STORAGE_OUT_DIR, { recursive: true });
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({ prefix: 'products/' });

    let count = 0;
    for (const file of files) {
        if (file.name.endsWith('/')) continue; // skip "directory" placeholder objects
        const relativePath = file.name.slice('products/'.length);
        if (!relativePath) continue;
        const destPath = path.join(STORAGE_OUT_DIR, relativePath);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        await file.download({ destination: destPath });
        count++;
    }
    console.log(`Downloaded ${count} storage object(s) to ${STORAGE_OUT_DIR}`);
}

async function main() {
    console.log('Exporting Firestore collections...');
    writeJson('users.json', await exportCollection('users'));
    writeJson('products.json', await exportCollection('products'));
    writeJson('orders.json', await exportCollection('orders'));
    writeJson('erv_download_leads.json', await exportCollection('erv_download_leads'));

    console.log('\nExporting Auth users...');
    writeJson('auth-users.json', await exportAuthUsers());

    console.log('\nExporting Storage objects (products/*)...');
    await exportStorage();

    console.log('\nDone. Review scripts/migrate-firebase/export/ before running migrate:import-supabase.');
    process.exit(0);
}

main().catch((err) => {
    console.error('Export failed:', err);
    process.exit(1);
});
