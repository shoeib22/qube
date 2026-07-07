import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true);

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }

  const mapped = (products ?? []).map((p) => ({
    id: p.id,
    name: p.name || 'Unnamed Product',
    category: p.category || 'General',
    serialPrefix: p.serial_prefix || null,
    imageUrl: p.image_path
      ? supabaseAdmin.storage.from('product-images').getPublicUrl(p.image_path).data.publicUrl
      : null,
  }));

  return Response.json({ success: true, products: mapped });
}
