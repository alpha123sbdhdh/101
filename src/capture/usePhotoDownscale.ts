const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Downscales a captured photo before it's ever uploaded or stored. Raw phone
 * photos can be 10-15MB+ — shrinking here keeps storage usage, upload time,
 * and later texture/GPU memory small. `imageOrientation: "from-image"` makes
 * createImageBitmap respect EXIF rotation so portrait shots don't end up sideways.
 */
export async function downscalePhoto(file: File | Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("Failed to encode photo");
  return blob;
}
