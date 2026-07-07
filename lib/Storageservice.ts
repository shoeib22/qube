// lib/storageService.ts — Xerovolt Custom Icon Upload & BW Processing

import { supabase } from "./supabase";

const ICONS_BUCKET = "user-icons";

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
 * Upload processed icon to Supabase Storage (user-icons bucket, owner-only per RLS)
 */
export async function uploadCustomIcon(
  userId: string,
  iconId: string,
  file: File,
  processedDataUrl: string
): Promise<string> {
  try {
    const path = `${userId}/${iconId}`;
    const contentType =
      file.type === "image/svg+xml" ? "image/svg+xml" : "image/png";

    // ✅ Convert data URL → blob safely
    const response = await fetch(processedDataUrl);
    if (!response.ok) {
      throw new Error("Failed to convert data URL to blob");
    }

    const blob = await response.blob();

    const { error } = await supabase.storage
      .from(ICONS_BUCKET)
      .upload(path, blob, { contentType, upsert: true });
    if (error) throw error;

    const { data, error: signedError } = await supabase.storage
      .from(ICONS_BUCKET)
      .createSignedUrl(path, 60 * 60);
    if (signedError) throw signedError;

    return data.signedUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

/**
 * Delete icon from Supabase Storage
 */
export async function deleteCustomIcon(
  userId: string,
  iconId: string
): Promise<void> {
  try {
    const path = `${userId}/${iconId}`;
    const { error } = await supabase.storage.from(ICONS_BUCKET).remove([path]);
    if (error) throw error;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
}