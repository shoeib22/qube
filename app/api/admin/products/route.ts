import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { data: products, error } = await supabaseAdmin.from('products').select('*').order('name');

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const mapped = (products ?? []).map((p) => ({
    id: p.id,
    name: p.name || 'Unnamed Product',
    category: p.category || 'General',
    price: Number(p.price) || 0,
    isActive: p.is_active ?? true,
    image: p.image_path || '',
    imageUrl: p.image_path
      ? supabaseAdmin.storage.from('product-images').getPublicUrl(p.image_path).data.publicUrl
      : '',
    serialPrefix: p.serial_prefix || '',
  }));

  return NextResponse.json({ success: true, products: mapped });
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'product'
  );
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const formData = await request.formData();
  const name = formData.get('name');
  const category = formData.get('category');
  const serialPrefix = formData.get('serialPrefix');
  const imageFile = formData.get('image');

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const price = Number(formData.get('price')) || 0;

  // Slugs mirror the migrated Firestore product IDs — generate one from the
  // name and disambiguate on collision.
  const baseSlug = slugify(name);
  let id = baseSlug;
  let suffix = 2;
  for (;;) {
    const { data: existing } = await supabaseAdmin.from('products').select('id').eq('id', id).maybeSingle();
    if (!existing) break;
    id = `${baseSlug}-${suffix++}`;
  }

  let imagePath: string | null = null;
  if (imageFile instanceof File && imageFile.size > 0) {
    const ext = (imageFile.name.split('.').pop() || 'png').toLowerCase();
    imagePath = `products/${id}.${ext}`;
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const { error: uploadError } = await supabaseAdmin.storage
      .from('product-images')
      .upload(imagePath, buffer, { contentType: imageFile.type || 'image/png', upsert: true });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: created, error } = await supabaseAdmin
    .from('products')
    .insert({
      id,
      name: name.trim(),
      category: typeof category === 'string' && category ? category : null,
      price,
      is_active: true,
      image_path: imagePath,
      serial_prefix: typeof serialPrefix === 'string' && serialPrefix ? serialPrefix : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      success: true,
      product: {
        id: created.id,
        name: created.name,
        category: created.category || '',
        price: Number(created.price) || 0,
        isActive: created.is_active,
        image: created.image_path || '',
        imageUrl: created.image_path
          ? supabaseAdmin.storage.from('product-images').getPublicUrl(created.image_path).data.publicUrl
          : '',
        serialPrefix: created.serial_prefix || '',
      },
    },
    { status: 201 }
  );
}
