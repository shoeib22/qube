import { NextRequest } from 'next/server';
import admin from '@/lib/firebaseAdmin';
// 1. Import modular service getters
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export interface AuthUser {
    uid: string;
    email: string;
    role: string;
}

/**
 * Verifies the authentication token from the request
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.split('Bearer ')[1];

        // 2. Use modular getAuth(admin) instead of admin.auth()
        const auth = getAuth(admin);
        const decodedToken = await auth.verifyIdToken(token);

        let role = decodedToken.role as string;

        // 3. Use modular getFirestore(admin) targeting 'qube-tech'
        if (!role) {
            const db = getFirestore(admin, 'qube-tech');
            const userDoc = await db.collection('users')
                .doc(decodedToken.uid)
                .get();

            role = userDoc.exists ? userDoc.data()?.role : 'customer';
        }

        return {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            role: role || 'customer'
        };
    } catch (error) {
        console.error('Auth verification error:', error);
        return null;
    }
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | Response> {
    const user = await verifyAuth(request);
    if (!user) {
        return new Response(
            JSON.stringify({ error: 'Unauthorized' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }
    return user;
}

/**
 * Middleware to require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | Response> {
    const userOrResponse = await requireAuth(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    const user = userOrResponse as AuthUser;
    if (user.role !== 'admin') {
        return new Response(
            JSON.stringify({ error: 'Forbidden: Admin access required' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }
    return user;
}