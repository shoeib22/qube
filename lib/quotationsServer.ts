import { supabaseAdmin } from "@/lib/supabaseAdmin";

type FloorPlanRow = { id: string; label: string; image_path: string };

// DB rows store floor_plans as [{id, label, image_path}]; API responses
// expose each with a resolved public image_url too (image_path stays so
// the client can round-trip it back on PATCH without us re-deriving it).
export function withFloorPlanUrls<T extends { floor_plans?: FloorPlanRow[] | null }>(row: T) {
  const floor_plans = (row.floor_plans ?? []).map((f) => ({
    id: f.id,
    label: f.label,
    image_path: f.image_path,
    image_url: supabaseAdmin.storage.from("quotation-plans").getPublicUrl(f.image_path).data.publicUrl,
  }));
  return { ...row, floor_plans };
}
