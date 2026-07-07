import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
    const authResult = await requireAdmin(request);
    if (authResult instanceof Response) return authResult;

    try {
        const { data, error } = await supabaseAdmin
            .from('customer_profiles')
            .select('id, email, first_name, last_name, role');

        if (error) throw error;

        const users = (data ?? []).map((u) => ({
            id: u.id,
            email: u.email,
            firstName: u.first_name,
            lastName: u.last_name,
            role: u.role,
        }));

        return NextResponse.json({ users });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const authResult = await requireAdmin(request);
    if (authResult instanceof Response) return authResult;

    try {
        const { userId, role } = await request.json();
        if (!userId || !role) {
            return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('customer_profiles')
            .update({ role })
            .eq('id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true, message: `User role updated to ${role}` });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
