import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { requireAdmin } from '../../../../../lib/auth-middleware';

// PUT /api/admin/products/[id] - Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const userOrResponse = await requireAdmin(request);

    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    try {
        const { id } = params;
        const body = await request.json();
        const { name, category, price, image, isActive } = body;

        const db = admin.firestore();
        const productRef = db.collection('products').doc(id);

        // Check if product exists
        const productDoc = await productRef.get();
        if (!productDoc.exists) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Prepare update data
        const updateData: any = {
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;
        if (price !== undefined) updateData.price = price;
        if (image !== undefined) updateData.image = image;
        if (isActive !== undefined) updateData.isActive = isActive;

        await productRef.update(updateData);

        return NextResponse.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/products/[id] - Soft delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const userOrResponse = await requireAdmin(request);

    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    try {
        const { id } = params;
        const db = admin.firestore();
        const productRef = db.collection('products').doc(id);

        // Check if product exists
        const productDoc = await productRef.get();
        if (!productDoc.exists) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Soft delete by setting isActive to false
        await productRef.update({
            isActive: false,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete product' },
            { status: 500 }
        );
    }
}
