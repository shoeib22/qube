import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// API body uses the same camelCase field names the old Firestore contract
// used; translate to the Postgres column names here.
const FIELD_TO_COLUMN: Record<string, string> = {
    name: 'name',
    category: 'category',
    price: 'price',
    isActive: 'is_active',
    image: 'image_path',
    serialPrefix: 'serial_prefix',
};

function mapBodyToColumns(body: Record<string, unknown>) {
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
        const column = FIELD_TO_COLUMN[key];
        if (column) mapped[column] = value;
    }
    return mapped;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { data: product, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const imageUrl = product.image_path
            ? supabaseAdmin.storage.from('product-images').getPublicUrl(product.image_path).data.publicUrl
            : null;

        return NextResponse.json({
            success: true,
            product: { id: product.id, ...product, imageUrl },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        const { id } = await params;
        const body = await request.json();

        const { error } = await supabaseAdmin
            .from('products')
            .update({ ...mapBodyToColumns(body), updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Updated' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        const { id } = await params;
        const { error } = await supabaseAdmin
            .from('products')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true, message: 'Deleted' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
