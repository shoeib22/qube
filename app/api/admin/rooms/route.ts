import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { data, error } = await supabaseAdmin.from("rooms").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ rooms: data ?? [] });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  const { name } = await request.json();
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("rooms")
    .insert({ name: name.trim() })
    .select()
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    const message = error.code === "23505" ? "A room with that name already exists" : error.message;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ room: data }, { status: 201 });
}
