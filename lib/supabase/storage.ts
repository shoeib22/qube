import { supabaseUrl } from "./env";

export const PRODUCTS_BUCKET = "products";

/**
 * Public URL for an object in a public Supabase Storage bucket. Building this directly
 * from the project URL (Supabase's own public-URL format) rather than through a Supabase
 * client, since generating it requires no auth/session. Firebase Storage used short-lived
 * signed URLs for product images even though the `products/` prefix was never actually
 * access-restricted (firestore.rules/storage.rules were wide open) — simplified here to a
 * plain public bucket, since that's what the images already effectively were.
 */
export function getPublicUrl(path: string, bucket: string = PRODUCTS_BUCKET): string {
  return `${supabaseUrl()}/storage/v1/object/public/${bucket}/${path}`;
}
