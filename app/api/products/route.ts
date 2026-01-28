export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import admin, { db } from '../../../lib/firebaseAdmin';
import { Query, CollectionReference, DocumentData } from 'firebase-admin/firestore';

interface Product {
    id: string;
    name: string;
    isActive: boolean;
    category?: string;
    [key: string]: any;
}

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

        // Get query parameters for filtering
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        // Simplified query to avoid requiring composite index
        // We'll filter isActive and sort in memory
        let query: Query<DocumentData> | CollectionReference<DocumentData> = db.collection('products');

        // Apply category filter if provided
        if (category) {
            query = query.where('category', '==', category);
        }

        console.log(`🔍 [API /api/products] Querying Firestore${category ? ` (category: ${category})` : ''}...`);
        const snapshot = await query.get();
        console.log(`📊 [API /api/products] Found ${snapshot.size} documents`);

        // Filter active products and sort in memory
        const products: Product[] = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Product))
            .filter((p) => p.isActive === true)
            .sort((a, b) => a.name.localeCompare(b.name));

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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
        const errorStack = error instanceof Error ? error.stack : '';
        
        console.error('❌ [API /api/products] Error:', errorMessage);
        console.error('Stack:', errorStack);
        
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}