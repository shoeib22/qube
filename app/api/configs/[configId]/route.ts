import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { db } from "@/lib/firebaseAdmin";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { configId: string } }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { configId } = params;
  if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });

  const snap = await db.collection("panelConfigs").doc(configId).get();
  if (!snap.exists) return Response.json({ error: "Config not found" }, { status: 404 });

  const config = snap.data()!;

  // Only the owner or admin can fetch a config
  const isOwner = config.userId === authResult.uid;
  const isAdmin = authResult.role === "admin";
  if (!isOwner && !isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // If linked to a device, fetch current state from Supabase
  let currentState = null;
  if (config.deviceId) {
    const { data } = await getSupabase()
      .from("device_states")
      .select("*")
      .eq("device_id", config.deviceId)
      .single();
    currentState = data;
  }

  return Response.json({ config, deviceId: config.deviceId ?? null, currentState });
}
