import { db, storage } from '@/lib/firebaseAdmin';

export async function GET() {
  if (!db) {
    return Response.json({ success: false, error: 'Firebase not initialized.' }, { status: 500 });
  }

  const snapshot = await db.collection('products').where('isActive', '==', true).get();

  const products = await Promise.all(snapshot.docs.map(async (doc) => {
    const data = doc.data();
    let imageUrl: string | null = data.imageUrl || null;

    if (data.image && !imageUrl && storage) {
      try {
        const bucket = storage.bucket();
        const file = bucket.file(data.image);
        const [url] = await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000,
        });
        imageUrl = url;
      } catch {
        imageUrl = null;
      }
    }

    return {
      id: doc.id,
      name: (data.name as string) || 'Unnamed Product',
      category: (data.category as string) || 'General',
      serialPrefix: (data.serialPrefix as string) || null,
      imageUrl,
    };
  }));

  return Response.json({ success: true, products });
}
