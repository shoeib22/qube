import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) {
    return Response.json({ error: 'Database not available' }, { status: 503 });
  }

  const [ordersSnap, usersSnap, productsSnap] = await Promise.all([
    db.collection('orders').get(),
    db.collection('users').get(),
    db.collection('products').where('isActive', '==', true).get(),
  ]);

  const orders = ordersSnap.docs.map(d => d.data());
  const revenue = orders
    .filter(o => o.status === 'SUCCESS')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const activeOrders = orders.filter(
    o => o.status === 'PENDING' || o.status === 'PROCESSING'
  ).length;

  return Response.json({
    revenue,
    activeOrders,
    totalProducts: productsSnap.size,
    totalCustomers: usersSnap.size,
  });
}
