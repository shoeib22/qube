const admin = require('../lib/firebaseAdmin');
const fs = require('fs');
const path = require('path');

/**
 * Enhanced Product Migration Script
 * Uploads products with full schema to Firestore
 */

async function migrateProductsEnhanced() {
    try {
        console.log('🚀 Starting enhanced product migration to Firestore...\n');

        // Read the exported JSON
        const productsPath = path.join(__dirname, 'products-export.json');
        if (!fs.existsSync(productsPath)) {
            console.error('❌ products-export.json not found!');
            console.log('   Run: node scripts/export-products.js first');
            process.exit(1);
        }

        const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        console.log(`📦 Loaded ${products.length} products from JSON\n`);

        if (products.length === 0) {
            console.error('❌ No products to migrate!');
            process.exit(1);
        }

        console.log(`   Sample product:`);
        console.log(`   - Name: ${products[0].name}`);
        console.log(`   - Category: ${products[0].category}`);
        console.log(`   - Price: ₹${products[0].price}`);
        console.log(`   - Images: ${products[0].images.length}\n`);

        const db = admin.firestore();
        let totalMigrated = 0;
        let batchNumber = 1;

        // Process in batches of 500 (Firestore limit)
        for (let i = 0; i < products.length; i += 500) {
            const batch = db.batch();
            const batchProducts = products.slice(i, i + 500);

            console.log(`📝 Processing batch ${batchNumber} (${batchProducts.length} products)...`);

            for (const product of batchProducts) {
                const productRef = db.collection('products').doc(product.id);

                // Ensure all required fields are present
                const productData = {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    description: product.description || `High-quality ${product.name} for smart home automation.`,
                    price: product.price || 0,
                    images: product.images || [product.primaryImage || '/images/products/default.png'],
                    primaryImage: product.primaryImage || product.images?.[0] || '/images/products/default.png',
                    specifications: product.specifications || {},
                    isActive: product.isActive !== undefined ? product.isActive : true,
                    stock: product.stock || 100,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                };

                batch.set(productRef, productData);
                totalMigrated++;
            }

            await batch.commit();
            console.log(`   ✅ Batch ${batchNumber} committed successfully`);
            batchNumber++;
        }

        console.log(`\n🎉 Migration complete!`);
        console.log(`📊 Statistics:`);
        console.log(`   - Total products migrated: ${totalMigrated}`);
        console.log(`   - Batches processed: ${batchNumber - 1}`);
        console.log(`   - Categories: ${[...new Set(products.map(p => p.category))].length}`);
        console.log(`\n✨ Products are now in Firestore 'products' collection`);
        console.log(`   View at: https://console.firebase.google.com/project/cube-8c773/firestore\n`);

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

migrateProductsEnhanced();
