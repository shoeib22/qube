import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('id, transaction_id, amount, items, status, fulfillment_status, created_at')
    .eq('user_id', authResult.uid)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const mapped = (orders ?? []).map((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    return {
      id: o.id,
      transactionId: o.transaction_id || '',
      items: items.map((i) => (i as Record<string, unknown>).name || 'Item'),
      amount: Number(o.amount) || 0,
      paymentStatus: o.status,
      fulfillmentStatus: o.fulfillment_status || 'Processing',
      createdAt: o.created_at,
    };
  });

  return NextResponse.json({ success: true, orders: mapped });
}
