import { NextRequest, NextResponse } from 'next/server';
import adminApp from '@/lib/firebaseAdmin'; 
import { requireAdmin } from '@/lib/auth-middleware';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; 
        const db = getFirestore(adminApp, 'qube-tech');
        const doc = await db.collection('products').doc(id).get();

        if (!doc.exists) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const data = doc.data();
        const isImageRequest = request.nextUrl.searchParams.get('image') === 'true';

        if (isImageRequest && data?.image) {
            const bucket = getStorage(adminApp).bucket('cube-8c773.firebasestorage.app');
            const file = bucket.file(data.image);
            const [fileBuffer] = await file.download();
            const [metadata] = await file.getMetadata();

            return new NextResponse(new Uint8Array(fileBuffer), {
                headers: {
                    'Content-Type': metadata.contentType || 'image/jpeg',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        }

        return NextResponse.json({
            success: true,
            product: { id: doc.id, ...data, imageUrl: `/api/products/${doc.id}?image=true` },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        const { id } = await params;
        const body = await request.json();
        const db = getFirestore(adminApp, 'qube-tech');
        
        const updateData: any = {
            ...body,
            updatedAt: FieldValue.serverTimestamp()
        };

        await db.collection('products').doc(id).update(updateData);
        return NextResponse.json({ success: true, message: 'Updated' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        const { id } = await params;
        const db = getFirestore(adminApp, 'qube-tech');
        await db.collection('products').doc(id).update({
            isActive: false,
            updatedAt: FieldValue.serverTimestamp()
        });
        return NextResponse.json({ success: true, message: 'Deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}