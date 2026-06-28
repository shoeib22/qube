import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { db, storage } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db || !storage) {
    return NextResponse.json({ success: false, error: 'Firebase not initialized' }, { status: 503 });
  }

  const snapshot = await db.collection('products').get();

  const products = await Promise.all(snapshot.docs.map(async (doc) => {
    const data = doc.data();
    let imageUrl = data.imageUrl || null;

    if (data.image && !imageUrl) {
      try {
        const file = storage.bucket().file(data.image);
        const [url] = await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000,
        });
        imageUrl = url;
      } catch {
        // fall through — imageUrl stays null
      }
    }

    return {
      id: doc.id,
      name: data.name || 'Unnamed Product',
      category: data.category || 'General',
      price: Number(data.price) || 0,
      isActive: data.isActive ?? true,
      image: data.image || '',
      imageUrl: imageUrl || '',
    };
  }));

  return NextResponse.json({ success: true, products });
}
