// Diagnostic script to compare Firebase configurations
const path = require('path');
const fs = require('fs');

console.log('🔍 Firebase Configuration Diagnostic\n');
console.log('='.repeat(60));

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
    console.log('\n✅ Found .env.local file');
    const envFile = fs.readFileSync(envPath, 'utf-8');

    // Parse env variables
    const envVars = {};
    envFile.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                envVars[match[1].trim()] = match[2].trim();
            }
        }
    });

    // Check Firebase variables
    const requiredVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];

    console.log('\n📋 Firebase Environment Variables:');
    requiredVars.forEach(varName => {
        if (envVars[varName]) {
            if (varName === 'FIREBASE_PRIVATE_KEY') {
                console.log(`  ✅ ${varName}: [PRESENT - ${envVars[varName].length} chars]`);
            } else {
                console.log(`  ✅ ${varName}: ${envVars[varName]}`);
            }
        } else {
            console.log(`  ❌ ${varName}: MISSING`);
        }
    });

    // Check process.env
    console.log('\n📋 Runtime Environment  (process.env):');
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            if (varName === 'FIREBASE_PRIVATE_KEY') {
                console.log(`  ✅ ${varName}: [PRESENT - ${process.env[varName].length} chars]`);
            } else {
                console.log(`  ✅ ${varName}: ${process.env[varName]}`);
            }
        } else {
            console.log(`  ❌ ${varName}: NOT LOADED`);
        }
    });

} else {
    console.log('\n❌ .env.local file not found!');
}

console.log('\n' + '='.repeat(60));

// Now try to initialize Firebase Admin
console.log('\n🔥 Testing Firebase Admin Initialization...\n');

// Load firebaseAdmin.js which should load env
const admin = require('../lib/firebaseAdmin');

if (admin.apps.length > 0) {
    console.log('✅ Firebase Admin initialized successfully');
    console.log(`   Project: ${admin.app().options.projectId}`);

    // Test Firestore
    console.log('\n📦 Testing Firestore Connection...\n');

    const db = admin.firestore();
    db.collection('products').limit(1).get()
        .then(snapshot => {
            console.log(`✅ Firestore connection successful!`);
            console.log(`   Found ${snapshot.size} document(s) in products collection`);

            if (snapshot.size > 0) {
                const doc = snapshot.docs[0];
                console.log(`   Sample product: ${doc.id} - ${doc.data().name}`);
            }

            process.exit(0);
        })
        .catch(error => {
            console.log(`❌ Firestore connection failed!`);
            console.log(`   Error: ${error.message}`);
            console.log(`   Code: ${error.code}`);
            process.exit(1);
        });

} else {
    console.log('❌ Firebase Admin failed to initialize');
    process.exit(1);
}
