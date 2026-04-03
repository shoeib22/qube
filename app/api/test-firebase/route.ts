import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; 

export async function GET() {
  try {
    // If db is null (because env vars failed), handle it gracefully
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not initialized" }, { status: 500 });
    }

    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("Firestore Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}