import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin'; 
// 1. Import getFirestore and getStorage specifically
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export async function GET(request: NextRequest) {
    try {
        // 2. Initialize Firestore using the getFirestore function
        // Pass 'admin' (your initialized App) and the specific database ID
        const db = getFirestore(admin, 'qube-tech');
        
        const snapshot = await db.collection('products').where('isActive', '==', true).get();

        const products = await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = null;

            if (data.image) {
                try {
                    // 3. Use getStorage for Signed URLs
                    const bucket = getStorage(admin).bucket('cube-8c773.firebasestorage.app');
                    const file = bucket.file(data.image);
                    const [url] = await file.getSignedUrl({
                        version: 'v4',
                        action: 'read',
                        expires: Date.now() + 60 * 60 * 1000, 
                    });
                    imageUrl = url;
                } catch (err) {
                    console.error("Signed URL failed for:", data.name);
                }
            }

            return {
                id: doc.id,
                ...data,
                imageUrl
            };
        }));

        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}