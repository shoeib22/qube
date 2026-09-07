import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { computeTotals, QuoteItem } from '@/lib/quotations';
import { withFloorPlanUrls } from '@/lib/quotationsServer';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { data, error } = await supabaseAdmin
    .from('quotations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ quotations: (data ?? []).map(withFloorPlanUrls) });
}

async function nextQuoteNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `XV-Q-${year}-`;
  const { count, error } = await supabaseAdmin
    .from('quotations')
    .select('id', { count: 'exact', head: true })
    .like('quote_number', `${prefix}%`);
  if (error) throw new Error(error.message);
  const seq = (count ?? 0) + 1;
  return `${prefix}${String(seq).padStart(4, '0')}`;
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const body = await request.json();
  const items: QuoteItem[] = body.items || [];
  if (!body.client_name) return Response.json({ error: 'client_name required' }, { status: 400 });

  const totals = computeTotals(items);
  const quote_number = await nextQuoteNumber();

  const { data, error } = await supabaseAdmin
    .from('quotations')
    .insert({
      quote_number,
      status: body.status || 'draft',
      issue_date: body.issue_date || new Date().toISOString().slice(0, 10),
      valid_until: body.valid_until || null,
      client_name: body.client_name,
      client_company: body.client_company || null,
      client_email: body.client_email || null,
      client_phone: body.client_phone || null,
      client_address: body.client_address || null,
      items,
      notes: body.notes || null,
      terms: body.terms || null,
      ...totals,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ quotation: withFloorPlanUrls(data) }, { status: 201 });
}
