import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db } from '@/lib/firebaseAdmin';
import adminApp from '@/lib/firebaseAdmin';
import { getStorage } from 'firebase-admin/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const { docId } = await params;
  const docRef = db.collection('productDocuments').doc(docId);
  const doc = await docRef.get();

  if (!doc.exists) return Response.json({ error: 'Document not found' }, { status: 404 });

  const { storagePath } = doc.data() as { storagePath: string };
  const bucket = getStorage(adminApp).bucket('cube-8c773.firebasestorage.app');

  try {
    await bucket.file(storagePath).delete();
  } catch (err) {
    console.error('Failed to delete storage file, continuing to remove Firestore doc:', err);
  }

  await docRef.delete();

  return Response.json({ ok: true });
}
