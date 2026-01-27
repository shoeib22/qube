// Simple dotenv alternative - load from .env.local
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
    try {
        const envPath = path.join(__dirname, '..', '.env.local');
        const envFile = fs.readFileSync(envPath, 'utf-8');

        envFile.split('\n').forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim();
                    process.env[key] = value;
                }
            }
        });
    } catch {
        console.warn('Warning: Could not load .env.local file');
    }
}

loadEnv();

if (!admin.apps.length) {
    try {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

        if (privateKey && projectId && clientEmail) {
            // Remove surrounding quotes if present
            if ((privateKey.startsWith('"') && privateKey.endsWith('"')) ||
                (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
                privateKey = privateKey.slice(1, -1);
            }

            // Replace escaped newlines with actual newlines
            privateKey = privateKey.replace(/\\n/g, '\n');

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: projectId,
                    clientEmail: clientEmail,
                    privateKey: privateKey,
                }),
                databaseURL: `https://${projectId}.firebaseio.com`,
                projectId: projectId
            });
            console.log('✅ Firebase Admin successfully initialized');
            console.log(`   Project: ${projectId}`);
            console.log(`   Database URL: https://${projectId}.firebaseio.com`);
        } else {
            console.warn('⚠️ Firebase Admin credentials incomplete.');
            console.warn('   Missing:', {
                projectId: !projectId,
                clientEmail: !clientEmail,
                privateKey: !privateKey
            });
        }
    } catch (error) {
        console.error('❌ Firebase Admin init error:', error.message);
        console.error('   Stack:', error.stack);
    }
}

export default admin;