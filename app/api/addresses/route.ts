import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { requireAuth } from '../../../lib/auth-middleware';

// GET /api/addresses - Get all addresses for logged-in user
export async function GET(request: NextRequest) {
    const userOrResponse = await requireAuth(request);

    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    const user = userOrResponse;

    try {
        const db = admin.firestore();
        const snapshot = await db
            .collection('addresses')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const addresses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({
            success: true,
            addresses
        });
    } catch (error: any) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch addresses' },
            { status: 500 }
        );
    }
}

// POST /api/addresses - Create new address
export async function POST(request: NextRequest) {
    const userOrResponse = await requireAuth(request);

    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    const user = userOrResponse;

    try {
        const body = await request.json();
        const { label, addressLine1, addressLine2, city, state, postalCode, country, phone, isDefault } = body;

        // Validation
        if (!label || !addressLine1 || !city || !state || !postalCode || !country || !phone) {
            return NextResponse.json(
                { error: 'Required fields: label, addressLine1, city, state, postalCode, country, phone' },
                { status: 400 }
            );
        }

        const db = admin.firestore();

        // If this is set as default, unset other defaults first
        if (isDefault) {
            const batch = db.batch();
            const existingAddresses = await db
                .collection('addresses')
                .where('userId', '==', user.uid)
                .where('isDefault', '==', true)
                .get();

            existingAddresses.docs.forEach(doc => {
                batch.update(doc.ref, { isDefault: false });
            });

            await batch.commit();
        }

        const addressData = {
            userId: user.uid,
            label,
            addressLine1,
            addressLine2: addressLine2 || '',
            city,
            state,
            postalCode,
            country,
            phone,
            isDefault: isDefault || false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('addresses').add(addressData);

        return NextResponse.json({
            success: true,
            address: { id: docRef.id, ...addressData }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating address:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create address' },
            { status: 500 }
        );
    }
}
