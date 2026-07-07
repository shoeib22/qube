import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * POST /api/register
 * PUBLIC: Creates a new Supabase Auth user. The on_auth_user_created trigger
 * creates the matching `profiles` row (role defaults to 'customer').
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName },
    });

    if (error) throw error;

    console.log(`✅ Successfully created Xerovolt account: ${data.user.id}`);

    return NextResponse.json({
      success: true,
      uid: data.user.id
    }, { status: 201 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error("Registration Error:", message);

    const status = message.toLowerCase().includes('already') ? 400 : 500;
    return NextResponse.json({
      error: message
    }, { status });
  }
}
