import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('id, transaction_id, amount, items, customer_info, status, fulfillment_status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const mapped = (orders ?? []).map((o) => {
    const customerInfo = (o.customer_info || {}) as Record<string, unknown>;
    const items = Array.isArray(o.items) ? o.items : [];
    return {
      id: o.id,
      transactionId: o.transaction_id || '',
      customer: (customerInfo.name as string) || (customerInfo.email as string) || 'Guest',
      product: items.length ? items.map((i) => (i as Record<string, unknown>).name || 'Item').join(', ') : 'N/A',
      amount: Number(o.amount) || 0,
      paymentStatus: o.status,
      fulfillmentStatus: o.fulfillment_status || 'Processing',
      createdAt: o.created_at,
    };
  });

  return NextResponse.json({ success: true, orders: mapped });
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { orderId, fulfillmentStatus } = await request.json();
  const allowed = ['Processing', 'Shipped', 'Delivered'];

  if (!orderId || !allowed.includes(fulfillmentStatus)) {
    return NextResponse.json({ error: 'Invalid orderId or fulfillmentStatus' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ fulfillment_status: fulfillmentStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
