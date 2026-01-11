// Simple dotenv alternative - load from .env.local
const fs = require('fs');
const path = require('path');

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
    } catch (error) {
        console.warn('Warning: Could not load .env.local file');
    }
}

loadEnv();

const admin = require('firebase-admin');

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey.replace(/\\n/g, '\n'),
                }),
            });
            console.log('✅ Firebase Admin successfully initialized');
        } else {
            console.warn('⚠️ FIREBASE_PRIVATE_KEY missing. Skipping Admin init.');
        }
    } catch (error) {
        console.error('❌ Firebase Admin init error:', error.message);
    }
}

module.exports = admin;
