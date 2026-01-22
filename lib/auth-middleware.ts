import { NextRequest } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export interface AuthUser {
    uid: string;
    email: string;
    role: string;
}

/**
 * Verifies the authentication token from the request
 * Returns user data if authenticated, null otherwise
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify the token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Get role from custom claims or Firestore
        let role = decodedToken.role as string;

        // Fallback to Firestore if no custom claim
        if (!role) {
            const userDoc = await admin.firestore()
                .collection('users')
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
 * Returns 401 if not authenticated
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
 * Returns 401 if not authenticated, 403 if not admin
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | Response> {
    const userOrResponse = await requireAuth(request);

    // If it's a Response, auth failed
    if (userOrResponse instanceof Response) {
        return userOrResponse;
    }

    const user = userOrResponse as AuthUser;

    if (user.role !== 'admin') {
        return new Response(
            JSON.stringify({ error: 'Forbidden: Admin access required' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return user;
}
