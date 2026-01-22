const fs = require('fs');
const path = require('path');

// Read the products.ts file
const productsFile = fs.readFileSync(path.join(__dirname, '..', 'data', 'products.ts'), 'utf-8');

// Extract the products array using a more reliable method
// We'll look for the exported products array
const match = productsFile.match(/export const products[^=]*=([^;]+);/s);

if (!match) {
    console.error('Could not find products export');
    process.exit(1);
}

// Extract just the product names and categories manually
// This is a simpler approach - we'll create a basic structure
const lines = productsFile.split('\n');
const products = [];

let currentCategory = '';
lines.forEach(line => {
    // Check for category comments
    const categoryMatch = line.match(/\/\/ -+\s*\n?\s*\/\/ (.+)/);
    if (categoryMatch) {
        currentCategory = categoryMatch[1].trim();
    }

    // Check for product entries
    const productMatch = line.match(/{\s*id:\s*id\("([^"]+)"\),\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)"/);
    if (productMatch) {
        const [, idName, name, category] = productMatch;
        const id = idName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        products.push({
            id,
            name,
            category: category || currentCategory,
            description: `High-quality ${name} for smart home automation. Perfect for modern homes.`,
            price: 2999, // Default price
            images: [`/images/products/${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`],
            primaryImage: `/images/products/${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`,
            specifications: {},
            isActive: true,
            stock: 100
        });
    }
});

console.log(`Extracted ${products.length} products`);

// Write to JSON file
fs.writeFileSync(
    path.join(__dirname, 'products-export.json'),
    JSON.stringify(products, null, 2)
);

console.log('✅ Products exported to scripts/products-export.json');
console.log(`   Total products: ${products.length}`);
