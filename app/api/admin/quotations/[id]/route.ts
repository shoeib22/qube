import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { computeTotals, QuoteItem } from '@/lib/quotations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const { data, error } = await supabaseAdmin.from('quotations').select('*').eq('id', id).single();
  if (error) return Response.json({ error: error.message }, { status: 404 });
  return Response.json({ quotation: data });
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

  const { data, error } = await supabaseAdmin
    .from('quotations')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ quotation: data });
}
