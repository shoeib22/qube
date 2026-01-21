const admin = require('./lib/firebaseAdmin');

async function testFirestore() {
    try {
        console.log('🔍 Testing Firestore connection...\n');

        const db = admin.firestore();

        // Try to list collections
        console.log('📋 Listing collections...');
        const collections = await db.listCollections();
        console.log(`Found ${collections.length} collections:`);
        collections.forEach(col => {
            console.log(`  - ${col.id}`);
        });

        // Check if products collection exists
        console.log('\n📦 Checking products collection...');
        const productsRef = db.collection('products');
        const snapshot = await productsRef.limit(5).get();
        console.log(`Found ${snapshot.size} products (showing first 5)`);

        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`  - ${doc.id}: ${data.name} (${data.category})`);
        });

        if (snapshot.empty) {
            console.log('⚠️  Products collection is empty!');
            console.log('Try running: npm run migrate:products');
        }

        console.log('\n✅ Firestore connection test complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Firestore test failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

testFirestore();
