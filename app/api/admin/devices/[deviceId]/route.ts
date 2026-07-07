import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { deviceId } = await params;
  const body = await request.json();
  const { friendlyName, room } = body;

  const { error } = await supabaseAdmin
    .from("device_registry")
    .upsert({ id: deviceId, friendly_name: friendlyName, room }, { onConflict: "id" });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
