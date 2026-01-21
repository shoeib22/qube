const fs = require('fs');
const path = require('path');

// Read the exported products
const productsPath = path.join(__dirname, 'products-export.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

console.log('📦 Converting products to Firestore import format...\n');

// Create Firestore import format
const firestoreData = {
    __collections__: {
        products: {}
    }
};

products.forEach((product, index) => {
    firestoreData.__collections__.products[product.id] = {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        images: product.images,
        primaryImage: product.primaryImage,
        specifications: product.specifications || {},
        isActive: true,
        stock: product.stock || 100,
        createdAt: { __datatype__: "timestamp", value: new Date().toISOString() },
        updatedAt: { __datatype__: "timestamp", value: new Date().toISOString() }
    };

    if ((index + 1) % 50 === 0) {
        console.log(`   Processed ${index + 1}/${products.length} products...`);
    }
});

// Write to file
const outputPath = path.join(__dirname, 'firestore-import.json');
fs.writeFileSync(outputPath, JSON.stringify(firestoreData, null, 2));

console.log(`\n✅ Firestore import file created: ${outputPath}`);
console.log(`📊 Total products: ${products.length}`);
console.log(`\n📝 To import manually in Firebase Console:`);
console.log(`   1. Go to Firestore Database`);
console.log(`   2. Click on the products collection (or create it)`);
console.log(`   3. Use the import feature or add documents manually`);
console.log(`\n   Or use Firebase CLI:`);
console.log(`   firebase firestore:import firestore-import.json\n`);
