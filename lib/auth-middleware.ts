import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { prisma } from '@/lib/prisma';

export interface AuthUser {
    uid: string;
    email: string;
    role: string;
}

/**
 * Verifies the bearer token from the request against Supabase Auth.
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.split('Bearer ')[1];

        const supabase = createAdminClient();
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return null;
        }

        // 1. Role from app_metadata (Supabase's equivalent of Firebase custom claims —
        //    included in the JWT, no DB round trip) first, for performance.
        let role = user.app_metadata?.role as string | undefined;

        // 2. Fall back to the profile table if app_metadata hasn't been set.
        if (!role) {
            const profile = await prisma.xerovoltProfile.findUnique({ where: { id: user.id } });
            role = profile?.role ?? 'customer';
        }

        return {
            uid: user.id,
            email: user.email || '',
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
