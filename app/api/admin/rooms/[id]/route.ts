import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const { error } = await supabaseAdmin.from("rooms").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
