import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { products } from '../../../../data/products';

/**
 * Migration endpoint using Firebase Client SDK
 * POST /api/admin/migrate-products-client
 */

export async function POST(request: NextRequest) {
    try {
        console.log('🚀 Starting product migration via Client SDK...');
        console.log(`📦 Loaded ${products.length} products`);

        let totalMigrated = 0;
        const errors = [];

        // Process products one by one (client SDK doesn't support batching like Admin SDK)
        for (const product of products) {
            try {
                const productId = product.id.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                const productData = {
                    id: productId,
                    name: product.name,
                    category: product.category,
                    description: `High-quality ${product.name} for smart home automation. Perfect for modern homes.`,
                    price: product.price || 2999,
                    images: product.image ? [product.image] : [`/images/products/${product.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`],
                    primaryImage: product.image || `/images/products/${product.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`,
                    specifications: {
                        'Connectivity': 'WiFi/Bluetooth',
                        'Power': '5V DC',
                        'Warranty': '1 Year'
                    },
                    isActive: true,
                    stock: 100,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };

                const productRef = doc(db, 'products', productId);
                await setDoc(productRef, productData);

                totalMigrated++;

                // Log progress every 50 products
                if (totalMigrated % 50 === 0) {
                    console.log(`   ✅ Migrated ${totalMigrated}/${products.length} products...`);
                }
            } catch (error: any) {
                console.error(`   ❌ Failed to migrate product ${product.name}:`, error.message);
                errors.push({ product: product.name, error: error.message });
            }
        }

        const categories = [...new Set(products.map(p => p.category))];

        console.log('🎉 Migration complete!');

        return NextResponse.json({
            success: true,
            message: 'Products migrated successfully using Client SDK',
            stats: {
                totalProducts: totalMigrated,
                failed: errors.length,
                categories: categories.length,
                categoriesList: categories
            },
            errors: errors.length > 0 ? errors.slice(0, 10) : undefined // Show first 10 errors if any
        });

    } catch (error: any) {
        console.error('❌ Migration failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                details: error.stack
            },
            { status: 500 }
        );
    }
}
