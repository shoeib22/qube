import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserRole } from '@/lib/getUserRole';

export interface AuthUser {
    uid: string;
    email: string;
    role: string;
}

/**
 * Verifies the Supabase access token from the request and resolves the
 * caller's role from `profiles` — the single source of truth for role.
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.split('Bearer ')[1];

        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !user) return null;

        const role = await getUserRole(supabaseAdmin, user.id);

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
