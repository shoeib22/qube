// lib/storageService.ts — Xerovolt Custom Icon Upload & BW Processing

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getFirebaseStorage, ICONS_STORAGE_PATH, XEROVOLT_APP_ID } from "./firebase";

/**
 * Apply strict black-and-white threshold to an image canvas.
 */
export function applyBWThreshold(
  canvas: HTMLCanvasElement,
  threshold = 128
): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const lum =
      0.2126 * data[i] +
      0.7152 * data[i + 1] +
      0.0722 * data[i + 2];

    const bw = lum >= threshold ? 255 : 0;

    data[i] = bw;
    data[i + 1] = bw;
    data[i + 2] = bw;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Convert uploaded file → strict B/W image (data URL)
 */
export function processUploadedFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // ✅ SVG handling (safer)
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          let svg = e.target?.result as string;

          if (!svg) throw new Error("Invalid SVG");

          // ✅ safer replacement (don’t break gradients/masks)
          svg = svg
            .replace(/fill="(?!none)[^"]*"/gi, 'fill="black"')
            .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="black"');

          const blob = new Blob([svg], { type: "image/svg+xml" });
          const objectUrl = URL.createObjectURL(blob);

          resolve(objectUrl);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsText(file);
      return;
    }

    // ✅ Raster images (PNG/JPG)
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context failed");

        ctx.drawImage(img, 0, 0);

        applyBWThreshold(canvas);

        URL.revokeObjectURL(url);

        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };

    img.src = url;
  });
}

/**
 * Upload processed icon to Firebase Storage
 */
export async function uploadCustomIcon(
  userId: string,
  iconId: string,
  file: File,
  processedDataUrl: string
): Promise<string> {
  try {
    const storage = getFirebaseStorage();

    const path = `${ICONS_STORAGE_PATH(XEROVOLT_APP_ID)}/${userId}/${iconId}`;
    const storageRef = ref(storage, path);

    // ✅ Convert data URL → blob safely
    const response = await fetch(processedDataUrl);
    if (!response.ok) {
      throw new Error("Failed to convert data URL to blob");
    }

    const blob = await response.blob();

    await uploadBytes(storageRef, blob, {
      contentType:
        file.type === "image/svg+xml" ? "image/svg+xml" : "image/png",
    });

    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

/**
 * Delete icon from Firebase Storage
 */
export async function deleteCustomIcon(
  userId: string,
  iconId: string
): Promise<void> {
  try {
    const storage = getFirebaseStorage();

    const path = `${ICONS_STORAGE_PATH(XEROVOLT_APP_ID)}/${userId}/${iconId}`;
    const storageRef = ref(storage, path);

    await deleteObject(storageRef);
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
}