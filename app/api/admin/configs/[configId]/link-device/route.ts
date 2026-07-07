import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ configId: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { configId } = await params;
  const body = await request.json();
  const { deviceId } = body; // null to unlink

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("panel_configs")
    .select("id")
    .eq("id", configId)
    .single();

  if (fetchError || !existing) return Response.json({ error: "Config not found" }, { status: 404 });

  // device_registry has a hard FK from panel_configs.device_id — ensure a row
  // exists even for devices only seen so far via live device_states reports.
  if (deviceId) {
    await supabaseAdmin
      .from("device_registry")
      .upsert({ id: deviceId }, { onConflict: "id", ignoreDuplicates: true });
  }

  const { error } = await supabaseAdmin
    .from("panel_configs")
    .update({ device_id: deviceId ?? null, updated_at: new Date().toISOString() })
    .eq("id", configId);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true, configId, deviceId: deviceId ?? null });
}
