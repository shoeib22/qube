import { NextRequest } from "next/server";
import { analyzePlan } from "@/lib/planMapper";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("plan");

  if (!(file instanceof File)) {
    return Response.json({ error: "plan file is required" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "file must be an image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "file too large (max 15MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await analyzePlan(buffer);
    return Response.json(result);
  } catch (err) {
    console.error("plan-mapper analyze failed:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
