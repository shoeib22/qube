import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ configId: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { configId } = await params;

  const { data: config, error } = await supabaseAdmin
    .from("panel_configs")
    .select("*")
    .eq("id", configId)
    .single();

  if (error || !config) return Response.json({ error: "Config not found" }, { status: 404 });

  // Only the owner or admin can fetch a config
  const isOwner = config.user_id === authResult.uid;
  const isAdmin = authResult.role === "admin";
  if (!isOwner && !isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // If linked to a device, fetch current state (same Supabase DB now)
  let currentState = null;
  if (config.device_id) {
    const { data } = await supabaseAdmin
      .from("device_states")
      .select("*")
      .eq("device_id", config.device_id)
      .single();
    currentState = data;
  }

  const mapped = {
    id: config.id,
    userId: config.user_id,
    name: config.name,
    panel: config.panel,
    material: config.material,
    size: config.size,
    accessory: config.accessory,
    slots: config.slots,
    materialColor: config.material_color,
    frameColor: config.frame_color,
    technology: config.technology,
    qty: config.qty,
    orderNote: config.order_note,
    deviceId: config.device_id,
    orderId: config.order_id,
    savedAt: config.saved_at,
    updatedAt: config.updated_at,
  };

  return Response.json({ config: mapped, deviceId: config.device_id ?? null, currentState });
}
