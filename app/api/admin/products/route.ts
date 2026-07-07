import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { data: products, error } = await supabaseAdmin.from('products').select('*');

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
  }));

  return NextResponse.json({ success: true, products: mapped });
}
