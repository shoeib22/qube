import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import { getPublicUrl } from '@/lib/supabase/storage';

/**
 * GET /api/products/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await prisma.xerovoltProduct.findUnique({ where: { id } });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            product: { ...product, imageUrl: product.image ? getPublicUrl(product.image) : null },
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
    { params }: { params: Promise<{ id: string }> }
) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        const { id } = await params;
        const body = await request.json();
        const { name, category, price, image, isActive } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;
        if (price !== undefined) updateData.price = price;
        if (image !== undefined) updateData.image = image;
        if (isActive !== undefined) updateData.isActive = isActive;

        await prisma.xerovoltProduct.update({ where: { id }, data: updateData });
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
    { params }: { params: Promise<{ id: string }> }
) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        const { id } = await params;
        await prisma.xerovoltProduct.update({ where: { id }, data: { isActive: false } });

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
