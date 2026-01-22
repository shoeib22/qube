const admin = require('../lib/firebaseAdmin');

/**
 * Simple single-product test migration
 * This will help us verify the Firestore connection works
 */

async function migrateSingleProduct() {
    try {
        console.log('🚀 Testing single product migration...\n');

        const db = admin.firestore();

        // Create a single test product
        const testProduct = {
            id: 'test-product-001',
            name: 'Test Smart Remote',
            category: 'Test Category',
            description: 'This is a test product to verify Firestore connection',
            price: 2999,
            images: ['/images/products/test.png'],
            primaryImage: '/images/products/test.png',
            specifications: {
                'Connectivity': 'WiFi',
                'Power': '5V'
            },
            isActive: true,
            stock: 100,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        console.log('📝 Creating test product...');
        console.log(`   ID: ${testProduct.id}`);
        console.log(`   Name: ${testProduct.name}`);

        const productRef = db.collection('products').doc(testProduct.id);
        await productRef.set(testProduct);

        console.log('\n✅ Test product created successfully!');

        // Try to read it back
        console.log('\n📖 Reading back the product...');
        const doc = await productRef.get();

        if (doc.exists) {
            console.log('✅ Product retrieved successfully!');
            console.log(`   Data: ${JSON.stringify(doc.data(), null, 2)}`);
        } else {
            console.log('❌ Product not found after creation');
        }

        console.log('\n🎉 Single product migration test successful!\n');
        console.log('Now you can run the full migration with:');
        console.log('   node scripts/migrate-products-enhanced.js\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error.details);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

migrateSingleProduct();
