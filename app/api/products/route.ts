import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
    try {
        const { data: products, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('is_active', true);

        if (error) throw error;

        const mapped = (products ?? []).map((p) => {
            const imageUrl = p.image_path
                ? supabaseAdmin.storage.from('product-images').getPublicUrl(p.image_path).data.publicUrl
                : `/products/${p.id}.jpg`;

            return {
                id: p.id,
                name: p.name || 'Unnamed Product',
                category: p.category || 'General',
                price: Number(p.price) || 0,
                isActive: true,
                image: p.image_path || '',
                imageUrl,
            };
        });

        return NextResponse.json({ success: true, products: mapped });

    } catch (error) {
        console.error('❌ API Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
