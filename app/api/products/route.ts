import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
    try {
        if (!db || !storage) {
            return NextResponse.json({ success: false, error: "Firebase not initialized." }, { status: 500 });
        }

        const snapshot = await db.collection('products')
            .where('isActive', '==', true)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ success: true, products: [] });
        }

        const products = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = data.imageUrl || null;

            if (data.image && !imageUrl) {
                try {
                    const bucket = storage.bucket(); 
                    const file = bucket.file(data.image);
                    const [url] = await file.getSignedUrl({
                        version: 'v4',
                        action: 'read',
                        expires: Date.now() + 60 * 60 * 1000, 
                    });
                    imageUrl = url;
                } catch (err) {
                    console.error(`⚠️ Signed URL failed for ${doc.id}:`, err);
                }
            }

            return {
                id: doc.id,
                name: data.name || "Unnamed Product",
                category: data.category || "General",
                price: Number(data.price) || 0,
                isActive: true,
                image: data.image || "",
                imageUrl: imageUrl || `/products/${doc.id}.jpg`,
            };
        }));

        return NextResponse.json({ success: true, products });

    } catch (error: any) {
        console.error('❌ API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}