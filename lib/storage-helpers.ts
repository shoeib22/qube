import { getPublicUrl } from '@/lib/supabase/storage';

/**
 * Get the public URL for an image in the `products` Supabase Storage bucket.
 * @param imagePath - The path to the image in Storage (e.g., "products/image.png")
 * @returns The full public URL
 */
export function getImageUrl(imagePath: string): string {
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const relativePath = cleanPath.startsWith('products/') ? cleanPath.slice('products/'.length) : cleanPath;
  return getPublicUrl(relativePath);
}

/**
 * Convert old local image path to a Storage-relative path
 * @param oldPath - Old path like "/images/product.png"
 * @returns Storage path like "product.png" (relative to the `products` bucket)
 */
export function convertToStoragePath(oldPath: string): string {
  // Remove /images/ prefix and any leading slashes
  return oldPath.replace(/^\/?(images\/)?(products\/)?/, '');
}
