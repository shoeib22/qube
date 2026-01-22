import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { getFirestore } from 'firebase-admin/firestore';

// GET /api/products/[id] - Get a single product by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        console.log(`📦 [API /api/products/${id}] Fetching product...`);

        if (!admin.apps.length) {
            return NextResponse.json(
                { error: 'Firebase Admin not initialized' },
                { status: 500 }
            );
        }

        const db = getFirestore(admin.app(), 'xerovolt-tech');
        const docRef = db.collection('products').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            console.log(`❌ [API /api/products/${id}] Product not found`);
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        const product = {
            id: doc.id,
            ...doc.data()
        } as any;

        console.log(`✅ [API /api/products/${id}] found: ${product.name}`);

        return NextResponse.json({
            success: true,
            product
        });
    } catch (error: any) {
        console.error(`❌ [API /api/products/${params.id}] Error:`, error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch product' },
            { status: 500 }
        );
    }
}
