import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

  const { data, error } = await supabaseAdmin
    .from("support_tickets")
    .insert({
      name,
      email,
      product: product ?? "general",
      subject,
      message,
      status: "open",
    })
    .select("id")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ticketId: data.id }, { status: 201 });
}
