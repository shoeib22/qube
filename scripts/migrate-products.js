const admin = require('../lib/firebaseAdmin');

// Import products from data file - we'll need to read and parse manually
const fs = require('fs');
const path = require('path');

// Since we can't require TS files, let's read the file and extract product data
function extractProductsFromTS() {
    const filePath = path.join(__dirname, '..', 'data', 'products.ts');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Extract the rawProducts array
    const match = fileContent.match(/const rawProducts: Product\[\] = (\[[\s\S]*?\]);/);
    if (!match) {
        throw new Error('Could not extract products from products.ts');
    }

    // Clean up the extracted array to valid JSON
    let productsString = match[1]
        .replace(/id: id\("([^"]+)"\),/g, (_, name) => {
            const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return `"id": "${id}",`;
        })
        .replace(/name: "([^"]+)"/g, '"name": "$1"')
        .replace(/category: "([^"]+)"/g, '"category": "$1"')
        .replace(/,(\s*[\}\]])/g, '$1'); // Remove trailing commas

    try {
        return JSON.parse(productsString);
    } catch (e) {
        console.error('Failed to parse products, creating minimal fallback set');
        // If parsing fails, return a minimal set
        return [];
    }
}

/**
 * Migration script to upload products from data/products.ts to Firestore
 * This will create a 'products' collection with all product data
 */

async function migrateProducts() {
    try {
        console.log(`🚀 Starting product migration...`);

        const rawProducts = extractProductsFromTS();
        console.log(`📦 Found ${rawProducts.length} products to migrate`);

        if (rawProducts.length === 0) {
            console.error('❌ No products found! Check if products.ts file exists and has correct format.');
            console.log('   First, let me try a simpler approach...');
            process.exit(1);
        }

        console.log(`   First product: ${JSON.stringify(rawProducts[0], null, 2)}\n`);

        const db = admin.firestore();
        let totalMigrated = 0;

        // Process in batches of 500 (Firestore limit)
        for (let i = 0; i < rawProducts.length; i += 500) {
            const batch = db.batch();
            const batchProducts = rawProducts.slice(i, i + 500);

            for (const product of batchProducts) {
                const productRef = db.collection('products').doc(product.id);

                // Clean product name for image path
                const cleanName = product.name
                    .split("(")[0]
                    .replace(/-/g, " ")
                    .replace("Acryllic", "Acrylic")
                    .replace(/\//g, " ")
                    .replace(/\s+/g, " ")
                    .trim();

                // Prepare product data with defaults
                const productData = {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price || 0, // Default to 0 if no price
                    image: `/images/products/${cleanName}.png`,
                    isActive: true,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                };

                batch.set(productRef, productData);
                totalMigrated++;
            }

            await batch.commit();
            console.log(`✅ Committed batch ${Math.floor(i / 500) + 1} (${batchProducts.length} products)`);
        }

        console.log(`\n🎉 Migration complete!`);
        console.log(`📊 Total products migrated: ${totalMigrated}`);
        console.log(`✨ Products are now available in Firestore 'products' collection\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

migrateProducts();
