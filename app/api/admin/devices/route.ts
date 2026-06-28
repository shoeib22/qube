import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { db } from "@/lib/firebaseAdmin";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const supabase = getSupabase();
  // Fetch live device states from Supabase
  const { data: states, error } = await supabase
    .from("device_states")
    .select("*")
    .order("last_updated", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Fetch friendly names/rooms from Firestore deviceRegistry
  const registry: Record<string, { friendlyName?: string; room?: string }> = {};
  if (db && states && states.length > 0) {
    const regSnap = await db.collection("deviceRegistry").get();
    regSnap.docs.forEach(doc => { registry[doc.id] = doc.data() as { friendlyName?: string; room?: string }; });
  }

  const devices = (states ?? []).map(s => ({
    deviceId: s.device_id,
    friendlyName: registry[s.device_id]?.friendlyName ?? s.device_id,
    room: registry[s.device_id]?.room ?? "—",
    state: s.state,
    lastUpdated: s.last_updated,
  }));

  return Response.json({ devices });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });

  const body = await request.json();
  const { deviceId, friendlyName, room } = body;
  if (!deviceId) return Response.json({ error: "deviceId required" }, { status: 400 });

  await db.collection("deviceRegistry").doc(deviceId).set(
    { friendlyName: friendlyName ?? deviceId, room: room ?? "" },
    { merge: true }
  );

  return Response.json({ ok: true });
}
