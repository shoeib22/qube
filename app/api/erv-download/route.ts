import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error } = await supabaseAdmin.from("erv_download_leads").insert({
      name: body.name,
      email: body.email,
      contact: body.contact,
      product: "ERV",
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERV API ERROR:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
