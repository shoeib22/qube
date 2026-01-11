import admin from '../lib/firebaseAdmin';
import { products } from '../data/products';

/**
 * Migration script to upload products from data/products.ts to Firestore
 * This will create a 'products' collection with all product data
 */

async function migrateProducts() {
    try {
        console.log(`🚀 Starting product migration...`);
        console.log(`📦 Found ${products.length} products to migrate\n`);

        const db = admin.firestore();
        const batch = db.batch();
        let batchCount = 0;
        let totalMigrated = 0;

        for (const product of products) {
            const productRef = db.collection('products').doc(product.id);

            // Prepare product data with defaults
            const productData = {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price || 0, // Default to 0 if no price
                image: product.image || `/images/products/${product.name}.png`,
                isActive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            batch.set(productRef, productData);
            batchCount++;
            totalMigrated++;

            // Firestore batch has a limit of 500 operations
            if (batchCount >= 500) {
                await batch.commit();
                console.log(`✅ Committed batch of ${batchCount} products`);
                batchCount = 0;
            }
        }

        // Commit any remaining products
        if (batchCount > 0) {
            await batch.commit();
            console.log(`✅ Committed final batch of ${batchCount} products`);
        }

        console.log(`\n🎉 Migration complete!`);
        console.log(`📊 Total products migrated: ${totalMigrated}`);
        console.log(`✨ Products are now available in Firestore 'products' collection\n`);

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

migrateProducts();
