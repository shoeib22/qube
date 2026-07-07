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
        const contentType = request.headers.get('content-type') || '';
        let body: Record<string, unknown> = {};

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            for (const key of ['name', 'category', 'serialPrefix'] as const) {
                const value = formData.get(key);
                if (value !== null) body[key] = value;
            }
            if (formData.has('price')) body.price = Number(formData.get('price'));
            if (formData.has('isActive')) body.isActive = formData.get('isActive') === 'true';

            const imageFile = formData.get('image');
            if (imageFile instanceof File && imageFile.size > 0) {
                const ext = (imageFile.name.split('.').pop() || 'png').toLowerCase();
                const path = `products/${id}.${ext}`;
                const buffer = Buffer.from(await imageFile.arrayBuffer());
                const { error: uploadError } = await supabaseAdmin.storage
                    .from('product-images')
                    .upload(path, buffer, { contentType: imageFile.type || 'image/png', upsert: true });
                if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
                body.image = path;
            }
        } else {
            body = await request.json();
        }

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
