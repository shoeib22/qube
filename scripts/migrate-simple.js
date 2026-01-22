const admin = require('../lib/firebaseAdmin');

// Instead of parsing TS, let's use the actual products array
// We'll create a simple product list directly
const sampleProducts = [
    { id: "red-smart-remote", name: "RED-Smart Remote", category: "Plugs & IR" },
    { id: "hd-plug-16a-v2", name: "HD Plug 16A V2", category: "Plugs & IR" },
    { id: "lpf-1-switch", name: "LPF 1 Switch (16A - Relay)", category: "Plugs & IR" },
    { id: "lpf-2-switch", name: "LPF 2 Switch (16A - Relay)", category: "Plugs & IR" },
    { id: "lpf-3-switch", name: "LPF 3 Switch (16A - Relay)", category: "Plugs & IR" },
    { id: "lpf-4-switch", name: "LPF 4 Switch (16A - Relay)", category: "Plugs & IR" },
    { id: "lpf-5a-fan-regulator", name: "LPF 5A Fan Regulator", category: "Plugs & IR" },
    { id: "lpf-6-switch", name: "LPF 6 Switch (16A - Relay)", category: "Plugs & IR" },
    { id: "lpf-8-switch", name: "LPF 8 Switch (16A - Relay)", category: "Plugs & IR" },
    { id: "lpf-curtain-motor", name: "LPF Curtain Motor", category: "Plugs & IR" },
];

async function migrateProducts() {
    try {
        console.log('🚀 Starting quick product migration with sample data...\n');

        const db = admin.firestore();
        const batch = db.batch();

        for (const product of sampleProducts) {
            const productRef = db.collection('products').doc(product.id);
            const productData = {
                id: product.id,
                name: product.name,
                category: product.category,
                price: 2999, // Sample price
                image: `/images/products/${product.name}.png`,
                isActive: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            batch.set(productRef, productData);
            console.log(`  ✓ Added: ${product.name}`);
        }

        await batch.commit();

        console.log(`\n✅ Migration complete!`);
        console.log(`📊 Total products migrated: ${sampleProducts.length}`);
        console.log(`✨ Products are now in Firestore 'products' collection\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

migrateProducts();
