import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { db } from "@/lib/firebaseAdmin";

export async function PUT(
  request: NextRequest,
  { params }: { params: { deviceId: string } }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });

  const { deviceId } = params;
  const body = await request.json();
  const { friendlyName, room } = body;

  await db.collection("deviceRegistry").doc(deviceId).set(
    { friendlyName, room },
    { merge: true }
  );

  return Response.json({ ok: true });
}
