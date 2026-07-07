import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  // If this query succeeds at all, Supabase is reachable — the auth check
  // above already round-tripped through it too.
  const { error: supabaseError } = await supabaseAdmin.from("rooms").select("id", { count: "exact", head: true });

  const { data: lastEvent } = await supabaseAdmin
    .from("device_events")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const mqttConfigured = Boolean(process.env.MQTT_BROKER);
  const lastEventAt = lastEvent?.created_at ?? null;
  const recentlyActive = lastEventAt
    ? Date.now() - new Date(lastEventAt).getTime() < 24 * 60 * 60 * 1000
    : false;

  return NextResponse.json({
    supabase: { connected: !supabaseError },
    mqtt: {
      configured: mqttConfigured,
      lastEventAt,
      recentlyActive,
    },
  });
}
