import { NextRequest } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, product, subject, message } = body;
  if (!name || !email || !subject || !message) {
    return Response.json({ error: "name, email, subject, message are required" }, { status: 400 });
  }

  if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });

  const ref = db.collection("supportTickets").doc();
  await ref.set({
    id: ref.id,
    name,
    email,
    product: product ?? "general",
    subject,
    message,
    status: "open",
    createdAt: FieldValue.serverTimestamp(),
  });

  return Response.json({ ticketId: ref.id }, { status: 201 });
}
