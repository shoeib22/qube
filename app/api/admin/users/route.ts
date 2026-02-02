import { NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

async function isAdmin(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return false;
        const token = authHeader.split('Bearer ')[1];
        
        // Use modular getAuth
        const decodedToken = await getAuth(admin).verifyIdToken(token);
        return decodedToken.role === 'admin';
    } catch (error) {
        return false;
    }
}

export async function GET(request: NextRequest) {
    try {
        if (!await isAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Target 'qube-tech' specifically
        const db = getFirestore(admin, 'qube-tech');
        const snapshot = await db.collection('users').get();

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!await isAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { userId, role } = await request.json();
        if (!userId || !role) {
            return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
        }

        const auth = getAuth(admin);
        const db = getFirestore(admin, 'qube-tech');

        await auth.setCustomUserClaims(userId, { role });
        await db.collection('users').doc(userId).update({ role });

        return NextResponse.json({ success: true, message: `User role updated to ${role}` });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}