import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { requireAdmin } from '../../../../lib/auth-middleware';

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
    const userOrResponse = await requireAdmin(request);

    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    try {
        const db = admin.firestore();

        // Get query parameters for pagination and filtering
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const isActive = searchParams.get('isActive');
        const limit = parseInt(searchParams.get('limit') || '100');

        let query = db.collection('products').orderBy('name');

        // Apply filters
        if (category) {
            query = query.where('category', '==', category) as any;
        }

        if (isActive !== null) {
            query = query.where('isActive', '==', isActive === 'true') as any;
        }

        // Apply limit
        query = query.limit(limit) as any;

        const snapshot = await query.get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            success: true,
            products,
            count: products.length
        });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
    const userOrResponse = await requireAdmin(request);

    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    try {
        const body = await request.json();
        const { name, category, price, image } = body;

        // Validation
        if (!name || !category) {
            return NextResponse.json(
                { error: 'Name and category are required' },
                { status: 400 }
            );
        }

        const db = admin.firestore();

        // Generate ID from name
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const productData = {
            id,
            name,
            category,
            price: price || 0,
            image: image || `/images/products/${name}.png`,
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('products').doc(id).set(productData);

        return NextResponse.json({
            success: true,
            product: { id, ...productData }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
