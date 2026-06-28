import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const userId = authResult.uid;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, material, size, accessory, slots, materialColor, frameColor, technology, qty, orderNote } = body;

  if (!material || !size || !accessory || !technology) {
    return Response.json({ error: "Missing required fields: material, size, accessory, technology" }, { status: 400 });
  }

  if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });

  const docRef = db.collection("panelConfigs").doc();

  await docRef.set({
    id: docRef.id,
    userId,
    panel: "edge",
    name: name || `Edge Panel — ${size}`,
    material,
    size,
    accessory,
    slots: slots ?? [],
    materialColor: materialColor ?? null,
    frameColor: frameColor ?? null,
    technology,
    qty: qty ?? 1,
    orderNote: orderNote ?? "",
    deviceId: null,
    orderId: null,
    savedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return Response.json({ configId: docRef.id }, { status: 201 });
}
