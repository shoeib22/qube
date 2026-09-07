import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Photo for a single ad-hoc line item (not the floor plan itself — see
// [id]/plan/route.ts for that). Stored in the same public quotation-plans
// bucket under an items/ subfolder; the URL just goes straight onto the
// item in the quotation's items[] jsonb, no separate DB column needed.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get('image');
  if (!(file instanceof File)) return Response.json({ error: 'image file required' }, { status: 400 });

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const storagePath = `${id}/items/${Date.now()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabaseAdmin.storage
    .from('quotation-plans')
    .upload(storagePath, buffer, { contentType: file.type || 'image/jpeg' });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from('quotation-plans').getPublicUrl(storagePath);
  return Response.json({ url: data.publicUrl });
}
