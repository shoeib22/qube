import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/firebaseAdmin';
import adminApp from '@/lib/firebaseAdmin';
import { getStorage } from 'firebase-admin/storage';
import { FieldValue } from 'firebase-admin/firestore';

const ALLOWED_CATEGORIES = ['manual', 'installGuide', 'specSheet', 'software'] as const;
type DocCategory = typeof ALLOWED_CATEGORIES[number];

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  const snapshot = await db.collection('productDocuments')
    .where('productId', '==', productId)
    .get();

  const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return Response.json({ documents });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const formData = await request.formData();
  const file = formData.get('file');
  const productId = formData.get('productId');
  const productName = formData.get('productName');
  const category = formData.get('category');
  const title = formData.get('title');

  if (!(file instanceof File)) return Response.json({ error: 'file required' }, { status: 400 });
  if (typeof productId !== 'string' || !productId) return Response.json({ error: 'productId required' }, { status: 400 });
  if (typeof productName !== 'string' || !productName) return Response.json({ error: 'productName required' }, { status: 400 });
  if (typeof category !== 'string' || !ALLOWED_CATEGORIES.includes(category as DocCategory)) {
    return Response.json({ error: `category must be one of ${ALLOWED_CATEGORIES.join(', ')}` }, { status: 400 });
  }
  if (typeof title !== 'string' || !title) return Response.json({ error: 'title required' }, { status: 400 });

  const fileType = (file.name.split('.').pop() || 'bin').toLowerCase();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `support-docs/${productId}/${Date.now()}_${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const bucket = getStorage(adminApp).bucket('cube-8c773.firebasestorage.app');
  await bucket.file(storagePath).save(buffer, {
    contentType: file.type || 'application/octet-stream',
  });

  const ref = db.collection('productDocuments').doc();
  const docData = {
    id: ref.id,
    productId,
    productName,
    category,
    title,
    storagePath,
    fileType,
    fileSize: buffer.length,
    uploadedAt: FieldValue.serverTimestamp(),
  };
  await ref.set(docData);

  return Response.json({ document: docData }, { status: 201 });
}
