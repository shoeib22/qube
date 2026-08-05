import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/register
 * PUBLIC: Creates a new user record and profile.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    const supabase = createAdminClient();

    // 1. Create user in Supabase Auth, with role in app_metadata (Supabase's
    //    equivalent of Firebase custom claims) and full name in user_metadata
    //    (equivalent of Firebase's displayName).
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { firstName, lastName, full_name: `${firstName} ${lastName}` },
      app_metadata: { role: 'customer' },
    });

    if (error || !data.user) {
      const status = error?.status === 422 ? 400 : 500;
      return NextResponse.json({ error: error?.message || 'Registration failed' }, { status });
    }

    // 2. Create the profile row
    await prisma.xerovoltProfile.create({
      data: {
        id: data.user.id,
        firstName,
        lastName,
        email,
        role: 'customer',
      },
    });

    console.log(`Successfully created Xerovolt account: ${data.user.id}`);

    return NextResponse.json({
      success: true,
      uid: data.user.id
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error.message);
    return NextResponse.json({
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
