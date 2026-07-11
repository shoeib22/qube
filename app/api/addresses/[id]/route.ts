import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function mapAddress(a: Record<string, unknown>) {
  return {
    id: a.id,
    label: a.label,
    addressLine1: a.address_line1,
    addressLine2: a.address_line2 || '',
    city: a.city,
    state: a.state,
    postalCode: a.postal_code,
    country: a.country,
    phone: a.phone,
    isDefault: a.is_default,
  };
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const body = await request.json();
  const { label, addressLine1, addressLine2, city, state, postalCode, country, phone, isDefault } = body;

  if (!label || !addressLine1 || !city || !state || !postalCode || !phone) {
    return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
  }

  if (isDefault) {
    await supabaseAdmin.from('addresses').update({ is_default: false }).eq('user_id', authResult.uid);
  }

  const { data, error } = await supabaseAdmin
    .from('addresses')
    .update({
      label,
      address_line1: addressLine1,
      address_line2: addressLine2 || null,
      city,
      state,
      postal_code: postalCode,
      country: country || 'India',
      phone,
      is_default: !!isDefault,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', authResult.uid)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, address: mapAddress(data) });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', authResult.uid);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
