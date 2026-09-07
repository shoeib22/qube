import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { computeTotals, QuoteItem } from '@/lib/quotations';
import { withFloorPlanUrls } from '@/lib/quotationsServer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const { data, error } = await supabaseAdmin.from('quotations').select('*').eq('id', id).single();
  if (error) return Response.json({ error: error.message }, { status: 404 });
  return Response.json({ quotation: withFloorPlanUrls(data) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const body = await request.json();
  const patch: Record<string, unknown> = { ...body, updated_at: new Date().toISOString() };

  if (body.items) {
    const items: QuoteItem[] = body.items;
    Object.assign(patch, computeTotals(items));
  }

  // Client round-trips floor_plans (e.g. after removing one) with the
  // image_url we resolved for it — strip that back out, only id/label/
  // image_path are real columns of this jsonb shape.
  if (body.floor_plans) {
    patch.floor_plans = (body.floor_plans as Array<{ id: string; label: string; image_path: string }>).map(
      (f) => ({ id: f.id, label: f.label, image_path: f.image_path })
    );
  }

  const { data, error } = await supabaseAdmin
    .from('quotations')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ quotation: withFloorPlanUrls(data) });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const { data: existing } = await supabaseAdmin
    .from('quotations')
    .select('floor_plans')
    .eq('id', id)
    .single();

  const { error } = await supabaseAdmin.from('quotations').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const paths = ((existing?.floor_plans ?? []) as Array<{ image_path: string }>).map((f) => f.image_path);
  if (paths.length) {
    await supabaseAdmin.storage.from('quotation-plans').remove(paths);
  }

  return Response.json({ ok: true });
}
