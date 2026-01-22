const admin = require('./lib/firebaseAdmin');
const { getFirestore } = require('firebase-admin/firestore');

async function testConnection() {
    try {
        console.log('Testing Firestore connection to "qube-tech"...');
        // Access the specific database
        const db = getFirestore(admin.app(), 'qube-tech');
        const collections = await db.listCollections();
        console.log('Collections:', collections.map(c => c.id));
        console.log('✅ Connection successful');
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testConnection();
