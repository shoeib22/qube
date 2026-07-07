import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const [ordersRes, usersRes, productsRes] = await Promise.all([
    supabaseAdmin.from('orders').select('amount, status'),
    supabaseAdmin.from('customer_profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  if (ordersRes.error) {
    return Response.json({ error: ordersRes.error.message }, { status: 500 });
  }

  const orders = ordersRes.data ?? [];
  const revenue = orders
    .filter((o) => o.status === 'SUCCESS')
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  const activeOrders = orders.filter((o) => o.status === 'PENDING').length;

  return Response.json({
    revenue,
    activeOrders,
    totalProducts: productsRes.count ?? 0,
    totalCustomers: usersRes.count ?? 0,
  });
}
