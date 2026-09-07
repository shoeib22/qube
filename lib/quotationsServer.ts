import { supabaseAdmin } from "@/lib/supabaseAdmin";

// DB rows store plan_image_path (storage path); API responses expose the
// resolved public plan_image_url instead — same split as products.ts.
export function withPlanUrl<T extends { plan_image_path?: string | null }>(
  row: T
): Omit<T, "plan_image_path"> & { plan_image_url: string | null } {
  const { plan_image_path, ...rest } = row;
  const plan_image_url = plan_image_path
    ? supabaseAdmin.storage.from("quotation-plans").getPublicUrl(plan_image_path).data.publicUrl
    : null;
  return { ...rest, plan_image_url };
}
