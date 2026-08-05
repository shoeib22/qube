import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPublicUrl } from '@/lib/supabase/storage';

export async function GET(request: NextRequest) {
    try {
        const products = await prisma.xerovoltProduct.findMany({
            where: { isActive: true },
        });

        const withImageUrls = products.map((product) => ({
            id: product.id,
            ...product,
            imageUrl: product.image ? getPublicUrl(product.image) : null,
        }));

        return NextResponse.json({ success: true, products: withImageUrls });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
