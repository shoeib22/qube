import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { requireAuth } from '../../../../../lib/auth-middleware';

// PUT /api/addresses/[id]/set-default - Set address as default
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
        const db = admin.firestore();

        // Run in transaction to ensure atomicity
        await db.runTransaction(async (transaction) => {
            const addressRef = db.collection('addresses').doc(id);
            const addressDoc = await transaction.get(addressRef);

            // Check if address exists and belongs to user
            if (!addressDoc.exists) {
                throw new Error('Address not found');
            }

            const addressData = addressDoc.data();
            if (addressData?.userId !== user.uid) {
                throw new Error('Forbidden: This address does not belong to you');
            }

            // Get all user's addresses
            const userAddresses = await db
                .collection('addresses')
                .where('userId', '==', user.uid)
                .get();

            // Unset default on all addresses
            userAddresses.docs.forEach(doc => {
                transaction.update(doc.ref, { isDefault: false });
            });

            // Set this address as default
            transaction.update(addressRef, {
                isDefault: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Default address updated successfully'
        });
    } catch (error: any) {
        console.error('Error setting default address:', error);

        if (error.message.includes('not found')) {
            return NextResponse.json(
                { error: 'Address not found' },
                { status: 404 }
            );
        }

        if (error.message.includes('Forbidden')) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to set default address' },
            { status: 500 }
        );
    }
}
