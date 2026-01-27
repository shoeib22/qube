export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import admin from '../../../lib/firebaseAdmin';

// GET /api/products - Get all active products (public endpoint)
export async function GET(request: NextRequest) {
    try {
        console.log('📦 [API /api/products] Starting request...');

        // Check if admin is initialized
        if (!admin.apps.length) {
            console.error('❌ [API /api/products] Firebase Admin not initialized!');
            return NextResponse.json(
                { error: 'Firebase Admin not initialized' },
                { status: 500 }
            );
        }

        console.log('✅ [API /api/products] Firebase Admin initialized');
        // Use the specific database "qube-tech" as confirmed by debugging
        const { getFirestore } = require('firebase-admin/firestore');
        const db = getFirestore(admin.app(), 'qube-tech');
        console.log('✅ [API /api/products] Firestore instance obtained (qube-tech)');

        // Get query parameters for filtering
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        // Simplified query to avoid requiring composite index
        // We'll filter isActive and sort in memory
        let query = db.collection('products');

        // Apply category filter if provided
        if (category) {
            query = query.where('category', '==', category) as any;
        }

        console.log(`🔍 [API /api/products] Querying Firestore${category ? ` (category: ${category})` : ''}...`);
        const snapshot = await query.get();
        console.log(`📊 [API /api/products] Found ${snapshot.size} documents`);

        // Filter active products and sort in memory
        const products = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter((p: any) => p.isActive === true)
            .sort((a: any, b: any) => a.name.localeCompare(b.name));

        console.log(`✨ [API /api/products] Returning ${products.length} active products`);

        return NextResponse.json({
            success: true,
            products,
            count: products.length
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
        });
    } catch (error: any) {
        console.error('❌ [API /api/products] Error:', error);
        console.error('Stack:', error.stack);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
