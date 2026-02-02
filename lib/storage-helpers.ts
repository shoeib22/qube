import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Get the download URL for an image from Firebase Storage
 * @param imagePath - The path to the image in Storage (e.g., "products/image.png")
 * @returns The full download URL
 */
export async function getImageUrl(imagePath: string): Promise<string> {
  try {
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // If path doesn't start with "products/", add it
    const fullPath = cleanPath.startsWith('products/') ? cleanPath : `products/${cleanPath}`;
    
    const imageRef = ref(storage, fullPath);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error getting image URL:', error);
    // Return a placeholder image or empty string
    return '/placeholder.png';
  }
}

/**
 * Convert old local image path to Firebase Storage path
 * @param oldPath - Old path like "/images/product.png"
 * @returns Storage path like "products/product.png"
 */
export function convertToStoragePath(oldPath: string): string {
  // Remove /images/ prefix and any leading slashes
  const filename = oldPath.replace(/^\/?(images\/)?/, '');
  return `products/${filename}`;
}