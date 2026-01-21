import { NextRequest, NextResponse } from 'next/server';
import admin from '../../../../lib/firebaseAdmin';
import { requireAuth } from '../../../../lib/auth-middleware';

// PUT /api/addresses/[id] - Update address
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const userOrResponse = await requireAuth(request);

    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    const user = userOrResponse;

    try {
        const { id } = params;
        const body = await request.json();

        const db = admin.firestore();
        const addressRef = db.collection('addresses').doc(id);

        // Check if address exists and belongs to user
        const addressDoc = await addressRef.get();
        if (!addressDoc.exists) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        const addressData = addressDoc.data();
        if (addressData?.userId !== user.uid) {
            return NextResponse.json(
                { error: 'Forbidden: This address does not belong to you' },
                { status: 403 }
            );
        }

        // If setting as default, unset others first
        if (body.isDefault === true) {
            const batch = db.batch();
            const existingAddresses = await db
                .collection('addresses')
                .where('userId', '==', user.uid)
                .where('isDefault', '==', true)
                .get();

            existingAddresses.docs.forEach(doc => {
                if (doc.id !== id) {
                    batch.update(doc.ref, { isDefault: false });
                }
            });

            await batch.commit();
        }

        // Prepare update data
        const updateData: any = {
            ...body,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Don't allow changing userId
        delete updateData.userId;
        delete updateData.createdAt;

        await addressRef.update(updateData);

        return NextResponse.json({
            success: true,
            message: 'Address updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating address:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update address' },
            { status: 500 }
        );
    }
}

// DELETE /api/addresses/[id] - Delete address
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const userOrResponse = await requireAuth(request);

    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    const user = userOrResponse;

    try {
        const { id } = params;
        const db = admin.firestore();
        const addressRef = db.collection('addresses').doc(id);

        // Check if address exists and belongs to user
        const addressDoc = await addressRef.get();
        if (!addressDoc.exists) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        const addressData = addressDoc.data();
        if (addressData?.userId !== user.uid) {
            return NextResponse.json(
                { error: 'Forbidden: This address does not belong to you' },
                { status: 403 }
            );
        }

        await addressRef.delete();

        return NextResponse.json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting address:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete address' },
            { status: 500 }
        );
    }
}
