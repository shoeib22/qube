import { NextResponse } from 'next/server';
import admin, { auth } from '@/lib/firebaseAdmin';

// Helper to check if the requester is an admin
async function isAdmin(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return false;

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);

        return decodedToken.role === 'admin';
    } catch (error) {
        return false;
    }
}

export async function GET(request: Request) {
    try {
        // 1. Verify Admin Access
        const isAuthorized = await isAdmin(request);
        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // 2. Fetch all users from Firestore
        // Note: listing all users from Auth is expensive/slow for large sets, 
        // so we rely on the Firestore 'users' collection we sync to.
        const db = admin.firestore();
        const snapshot = await db.collection('users').get();

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ users });
    } catch (error: any) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        // 1. Verify Admin Access
        const isAuthorized = await isAdmin(request);
        if (!isAuthorized) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { userId, role } = await request.json();

        if (!userId || !role) {
            return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
        }

        // 2. Update Role in Firebase Auth (for immediate claims)
        await auth.setCustomUserClaims(userId, { role });

        // 3. Update Role in Firestore (for persistence/querying)
        const db = admin.firestore();
        await db.collection('users').doc(userId).update({ role });

        return NextResponse.json({ success: true, message: `User role updated to ${role}` });

    } catch (error: any) {
        console.error("Update Role Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
