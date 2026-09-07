import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withFloorPlanUrls } from '@/lib/quotationsServer';

// Appends a new labeled floor plan (e.g. "Ground Floor") to the quotation's
// floor_plans[] — a quotation can have several, one per floor. Removing a
// floor happens through the general PATCH route instead (client sends back
// the filtered array), since that's a plain state edit with no file to
// upload.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const formData = await request.formData();
  const file = formData.get('plan');
  const label = (formData.get('label') as string | null)?.trim() || 'Floor';
  if (!(file instanceof File)) return Response.json({ error: 'plan file required' }, { status: 400 });

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('quotations')
    .select('floor_plans')
    .eq('id', id)
    .single();
  if (fetchError) return Response.json({ error: fetchError.message }, { status: 404 });

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const storagePath = `${id}/floors/${Date.now()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabaseAdmin.storage
    .from('quotation-plans')
    .upload(storagePath, buffer, { contentType: file.type || 'image/jpeg' });
  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

  const currentFloors = (existing?.floor_plans ?? []) as Array<{ id: string; label: string; image_path: string }>;
  const newFloor = { id: crypto.randomUUID(), label, image_path: storagePath };

  const { data, error } = await supabaseAdmin
    .from('quotations')
    .update({ floor_plans: [...currentFloors, newFloor], updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ quotation: withFloorPlanUrls(data) });
}
