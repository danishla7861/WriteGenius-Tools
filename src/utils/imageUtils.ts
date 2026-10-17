/**
 * Browser-side HTML5 Canvas Image manipulation utilities.
 * 100% client-side: no server uploads, complete privacy.
 */

export interface ImageMetadata {
  width: number;
  height: number;
  sizeBytes: number;
  format: string;
  aspectRatio: string;
}

export function calculateAspectRatio(w: number, h: number): string {
  if (w === 0 || h === 0) return '1:1';
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(w, h);
  return `${w / divisor}:${h / divisor}`;
}

export function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to decode image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

export async function getImageMetadata(file: File): Promise<ImageMetadata> {
  const img = await loadImageElement(file);
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
    sizeBytes: file.size,
    format: file.type.replace('image/', '').toUpperCase() || 'UNKNOWN',
    aspectRatio: calculateAspectRatio(img.naturalWidth, img.naturalHeight),
  };
}

export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  format: string = 'image/jpeg',
  quality: number = 0.9
): Promise<{ blob: Blob; url: string; width: number; height: number; size: number }> {
  const img = await loadImageElement(file);
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Fill white background for JPEGs to prevent black transparency
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to create image blob'));
        const url = URL.createObjectURL(blob);
        resolve({
          blob,
          url,
          width: targetWidth,
          height: targetHeight,
          size: blob.size,
        });
      },
      format,
      quality
    );
  });
}

export async function compressImage(
  file: File,
  quality: number = 0.75,
  format: string = 'image/jpeg'
): Promise<{ blob: Blob; url: string; originalSize: number; newSize: number; savedPercent: number }> {
  const img = await loadImageElement(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to compress image'));
        const url = URL.createObjectURL(blob);
        const savedPercent = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));
        resolve({
          blob,
          url,
          originalSize: file.size,
          newSize: blob.size,
          savedPercent,
        });
      },
      format,
      quality
    );
  });
}

export async function convertImageFormat(
  file: File,
  targetMimeType: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number = 0.92
): Promise<{ blob: Blob; url: string; size: number }> {
  const img = await loadImageElement(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  if (targetMimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to convert image format'));
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, size: blob.size });
      },
      targetMimeType,
      quality
    );
  });
}

export async function cropImage(
  file: File,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  format: string = 'image/jpeg'
): Promise<{ blob: Blob; url: string; size: number }> {
  const img = await loadImageElement(file);
  const canvas = document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, cropWidth, cropHeight);
  }
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to crop image'));
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, size: blob.size });
      },
      format,
      0.95
    );
  });
}

export interface PassportPreset {
  id: string;
  country: string;
  label: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
}

export const PASSPORT_PRESETS: PassportPreset[] = [
  { id: 'us-visa', country: 'United States', label: 'US Passport / Visa (2×2 in)', widthMm: 51, heightMm: 51, widthPx: 600, heightPx: 600 },
  { id: 'uk-passport', country: 'United Kingdom', label: 'UK Passport (35×45 mm)', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: 'eu-schengen', country: 'Schengen / EU', label: 'EU / Schengen Visa (35×45 mm)', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: 'canada-passport', country: 'Canada', label: 'Canada Passport (50×70 mm)', widthMm: 50, heightMm: 70, widthPx: 590, heightPx: 826 },
  { id: 'australia-passport', country: 'Australia', label: 'Australia Passport (35×45 mm)', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: 'pakistan-passport', country: 'Pakistan', label: 'Pakistan Passport (35×45 mm)', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: 'india-passport', country: 'India', label: 'India Passport / OCI (35×45 mm)', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531 },
  { id: 'china-visa', country: 'China', label: 'China Visa (33×48 mm)', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567 },
];
