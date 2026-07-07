import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

  const { data, error } = await supabaseAdmin
    .from("panel_configs")
    .insert({
      user_id: userId,
      panel: "edge",
      name: name || `Edge Panel — ${size}`,
      material,
      size,
      accessory,
      slots: slots ?? [],
      material_color: materialColor ?? null,
      frame_color: frameColor ?? null,
      technology,
      qty: qty ?? 1,
      order_note: orderNote ?? "",
    })
    .select("id")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ configId: data.id }, { status: 201 });
}
