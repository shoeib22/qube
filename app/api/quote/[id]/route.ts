import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withPlanUrl } from '@/lib/quotationsServer';

// Intentionally public — no requireAdmin. This is the customer-facing link
// (/quote/[id]) admins share directly; the id itself (a uuid) is the only
// credential, same trust model as any "anyone with the link" share link.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin.from('quotations').select('*').eq('id', id).single();
  if (error) return Response.json({ error: 'Quotation not found' }, { status: 404 });
  return Response.json({ quotation: withPlanUrl(data) });
}
