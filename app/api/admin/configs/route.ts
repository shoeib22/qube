import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { data: configs, error } = await supabaseAdmin
    .from("panel_configs")
    .select("*")
    .order("saved_at", { ascending: false })
    .limit(100);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Batch-resolve user emails
  const userIds = [...new Set((configs ?? []).map((c) => c.user_id).filter(Boolean))];
  const emailMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from("customer_profiles")
      .select("id, email")
      .in("id", userIds);
    (profiles ?? []).forEach((p) => { emailMap[p.id] = p.email ?? p.id; });
  }

  const enriched = (configs ?? []).map((c) => ({
    id: c.id,
    userId: c.user_id,
    userEmail: emailMap[c.user_id] ?? c.user_id,
    name: c.name,
    panel: c.panel,
    material: c.material,
    size: c.size,
    accessory: c.accessory,
    slots: c.slots,
    materialColor: c.material_color,
    frameColor: c.frame_color,
    technology: c.technology,
    qty: c.qty,
    deviceId: c.device_id,
    savedAt: c.saved_at,
  }));

  return Response.json({ configs: enriched });
}
