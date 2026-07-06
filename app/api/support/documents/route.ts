import { NextRequest } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import adminApp from '@/lib/firebaseAdmin';
import { getStorage } from 'firebase-admin/storage';

export async function GET(request: NextRequest) {
  if (!db) return Response.json({ error: 'Database unavailable' }, { status: 503 });

  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) return Response.json({ error: 'productId required' }, { status: 400 });

  const snapshot = await db.collection('productDocuments')
    .where('productId', '==', productId)
    .get();

  const bucket = getStorage(adminApp).bucket('cube-8c773.firebasestorage.app');

  const documents = await Promise.all(snapshot.docs.map(async (doc) => {
    const data = doc.data();
    let downloadUrl: string | null = null;
    try {
      const [url] = await bucket.file(data.storagePath).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000,
      });
      downloadUrl = url;
    } catch (err) {
      console.error(`Signed URL failed for document ${doc.id}:`, err);
    }

    return {
      id: doc.id,
      category: data.category,
      title: data.title,
      fileType: data.fileType,
      fileSize: data.fileSize,
      downloadUrl,
    };
  }));

  return Response.json({ documents });
}
