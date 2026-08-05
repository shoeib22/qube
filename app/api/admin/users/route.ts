import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { createAdminClient } from '@/lib/supabase/admin';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        const users = await prisma.xerovoltProfile.findMany();
        return NextResponse.json({ users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const userOrResponse = await requireAdmin(request);
    if (userOrResponse instanceof Response) return userOrResponse;

    try {
        const { userId, role } = await request.json();
        if (!userId || !role) {
            return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
        }

        const supabase = createAdminClient();
        await supabase.auth.admin.updateUserById(userId, { app_metadata: { role } });
        await prisma.xerovoltProfile.update({ where: { id: userId }, data: { role } });

        return NextResponse.json({ success: true, message: `User role updated to ${role}` });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
