const admin = require('../lib/firebaseAdmin');

/**
 * Test Firestore connection and database access
 */

async function testFirestore() {
    try {
        console.log('🔍 Testing Firestore connection...\n');

        const db = admin.firestore();

        console.log('📊 Firestore instance created');
        console.log(`   Project: ${admin.app().options.projectId}`);

        // Try to list collections
        console.log('\n📁 Attempting to list collections...');
        try {
            const collections = await db.listCollections();
            console.log(`   Found ${collections.length} collections:`);
            collections.forEach(col => console.log(`   - ${col.id}`));
        } catch (error) {
            console.log(`   ❌ Error listing collections: ${error.message}`);
        }

        // Try to write a test document
        console.log('\n✍️  Attempting to write a test document...');
        try {
            const testRef = db.collection('_test').doc('test-doc');
            await testRef.set({
                test: true,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('   ✅ Test document written successfully');

            // Clean up
            await testRef.delete();
            console.log('   🗑️  Test document deleted');
        } catch (error) {
            console.log(`   ❌ Error writing test document: ${error.message}`);
            console.log(`   Error code: ${error.code}`);
            console.log(`   Error details: ${error.details}`);
        }

        console.log('\n✅ Firestore test complete\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Firestore test failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

testFirestore();
