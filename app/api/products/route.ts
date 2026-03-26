import { NextRequest, NextResponse } from 'next/server';
import adminApp from '@/lib/firebaseAdmin'; 
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export async function GET(request: NextRequest) {
    try {
        // 1. Safety check for the initialized admin app
        if (!adminApp) {
            throw new Error("Firebase Admin failed to initialize. Check environment variables.");
        }

        // 2. Use the default database (unless you specifically created 'qube-tech' in Console)
        // If 'qube-tech' is definitely the name in your console, you can keep it, 
        // but 99% of projects use the default instance.
        const db = getFirestore(adminApp); 
        
        const snapshot = await db.collection('products')
            .where('isActive', '==', true)
            .get();

        const products = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = data.imageUrl || null;

            // 3. Generate Signed URL if 'image' field exists (path in storage)
            if (data.image && !imageUrl) {
                try {
                    const bucket = getStorage(adminApp).bucket('cube-8c773.firebasestorage.app');
                    const file = bucket.file(data.image);
                    const [url] = await file.getSignedUrl({
                        version: 'v4',
                        action: 'read',
                        expires: Date.now() + 60 * 60 * 1000, // 1 hour
                    });
                    imageUrl = url;
                } catch (err) {
                    console.error(`Signed URL failed for ${data.name}:`, err);
                }
            }

            return {
                id: doc.id,
                name: data.name || "Unnamed Product",
                category: data.category || "General",
                price: data.price || 0,
                isActive: data.isActive ?? true,
                image: data.image || "",
                imageUrl: imageUrl || `/products/${doc.id}.jpg`, // Fallback
            };
        }));

        return NextResponse.json({ success: true, products });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { success: false, error: error.message }, 
            { status: 500 }
        );
    }
}