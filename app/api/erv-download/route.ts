import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "cube-8c773",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.collection("erv_download_leads").add({
      name: body.name,
      email: body.email,
      contact: body.contact,
      product: "ERV",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERV API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    );
  }
}
