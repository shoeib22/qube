import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withPlanUrl } from '@/lib/quotationsServer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get('plan');
  if (!(file instanceof File)) return Response.json({ error: 'plan file required' }, { status: 400 });

  const { data: existing } = await supabaseAdmin
    .from('quotations')
    .select('plan_image_path')
    .eq('id', id)
    .single();

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const storagePath = `${id}/${Date.now()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabaseAdmin.storage
    .from('quotation-plans')
    .upload(storagePath, buffer, { contentType: file.type || 'image/jpeg' });
  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

  const { data, error } = await supabaseAdmin
    .from('quotations')
    .update({ plan_image_path: storagePath, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  if (existing?.plan_image_path && existing.plan_image_path !== storagePath) {
    await supabaseAdmin.storage.from('quotation-plans').remove([existing.plan_image_path]);
  }

  return Response.json({ quotation: withPlanUrl(data) });
}
