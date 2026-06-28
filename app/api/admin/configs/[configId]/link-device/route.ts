import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function PUT(
  request: NextRequest,
  { params }: { params: { configId: string } }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });

  const { configId } = params;
  const body = await request.json();
  const { deviceId } = body; // null to unlink

  const ref = db.collection("panelConfigs").doc(configId);
  const snap = await ref.get();
  if (!snap.exists) return Response.json({ error: "Config not found" }, { status: 404 });

  await ref.update({ deviceId: deviceId ?? null, updatedAt: FieldValue.serverTimestamp() });

  return Response.json({ ok: true, configId, deviceId: deviceId ?? null });
}
