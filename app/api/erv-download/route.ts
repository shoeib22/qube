import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const body = await req.json();
    await db.collection("erv_download_leads").add({
      name: body.name,
      email: body.email,
      contact: body.contact,
      product: "ERV",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERV API ERROR:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}