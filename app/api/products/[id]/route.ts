import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { requireAdmin } from '@/lib/auth-middleware';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

/**
 * GET /api/products/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
    try {
        // 1. Await params before destructuring
        const { id } = await params; 
        
        const db = getFirestore(admin, 'qube-tech');
        const doc = await db.collection('products').doc(id).get();

        if (!doc.exists) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const data = doc.data();
        let imageUrl = null;

        if (data?.image) {
            try {
                const bucket = getStorage(admin).bucket('cube-8c773.firebasestorage.app');
                const [url] = await bucket.file(data.image).getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + 60 * 60 * 1000, 
                });
                imageUrl = url;
            } catch (imgErr) {
                console.error('Image Signing failed:', imgErr);
            }
        }

        return NextResponse.json({
            success: true,
            product: { id: doc.id, ...data, imageUrl },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

/**
 * PUT /api/products/[id]
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        // 2. Await params here as well
        const { id } = await params;
        const body = await request.json();
        const { name, category, price, image, isActive } = body;

        const db = getFirestore(admin, 'qube-tech');
        const productRef = db.collection('products').doc(id);

        const updateData: any = {
            updatedAt: FieldValue.serverTimestamp()
        };

        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;
        if (price !== undefined) updateData.price = price;
        if (image !== undefined) updateData.image = image;
        if (isActive !== undefined) updateData.isActive = isActive;

        await productRef.update(updateData);
        return NextResponse.json({ success: true, message: 'Product updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/products/[id]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        // 3. Await params here too
        const { id } = await params;
        const db = getFirestore(admin, 'qube-tech');
        await db.collection('products').doc(id).update({
            isActive: false,
            updatedAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}