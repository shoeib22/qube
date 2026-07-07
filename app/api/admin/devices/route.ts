import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  // Fetch live device states from Supabase
  const { data: states, error } = await supabaseAdmin
    .from("device_states")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Friendly names/rooms live alongside device_states in the same DB now
  const registry: Record<string, { friendly_name?: string; room?: string }> = {};
  if (states && states.length > 0) {
    const { data: regRows } = await supabaseAdmin.from("device_registry").select("*");
    (regRows ?? []).forEach((r) => { registry[r.id] = r; });
  }

  const devices = (states ?? []).map(s => ({
    deviceId: s.device_id,
    friendlyName: registry[s.device_id]?.friendly_name ?? s.device_id,
    room: registry[s.device_id]?.room ?? "—",
    state: s.state,
    lastUpdated: s.updated_at,
  }));

  return Response.json({ devices });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const body = await request.json();
  const { deviceId, friendlyName, room } = body;
  if (!deviceId) return Response.json({ error: "deviceId required" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("device_registry")
    .upsert({ id: deviceId, friendly_name: friendlyName ?? deviceId, room: room ?? "" }, { onConflict: "id" });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
