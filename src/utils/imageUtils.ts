// TEMPORARY PROTOTYPE STORAGE
// Replace with Firebase Storage in production.
// Production should use Firebase Storage or another object storage provider.

export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB max upload
export const MAX_RESIZE_WIDTH = 1200; // 1200px max dimension

export interface ProcessedImageResult {
  dataUrl: string;
  originalSize: number;
  width: number;
  height: number;
}

/**
 * Validate image file size and MIME type
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const isImageMime = file.type ? file.type.toLowerCase().startsWith('image/') : false;
  const validExtensions = /\.(jpe?g|png|webp|gif|svg|avif|bmp|ico)$/i;
  const isImageExt = validExtensions.test(file.name);

  if (!isImageMime && !isImageExt) {
    return {
      valid: false,
      error: 'Unsupported file format. Please select an image file (JPG, PNG, WebP, GIF, SVG, AVIF).',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size exceeds ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB limit. Please select a smaller file.`,
    };
  }

  return { valid: true };
}

/**
 * Read File using FileReader and return Data URL (Base64 string)
 * Automatically optimizes/resizes images exceeding MAX_RESIZE_WIDTH using HTML5 Canvas API
 */
export function processImageFile(file: File): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return reject(new Error(validation.error || 'Invalid image file.'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read the selected image file.'));
    };

    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        return reject(new Error('Failed to extract image Data URL.'));
      }

      // If GIF or SVG, do not run through canvas to preserve animation/vector fidelity
      if (file.type === 'image/gif' || file.type === 'image/svg+xml' || file.name.endsWith('.svg') || file.name.endsWith('.gif')) {
        return resolve({
          dataUrl: rawDataUrl,
          originalSize: file.size,
          width: 0,
          height: 0,
        });
      }

      // Optimize & Square through Canvas
      const img = new Image();
      
      img.onerror = () => {
        // Fallback to raw data url if canvas loading fails
        resolve({
          dataUrl: rawDataUrl,
          originalSize: file.size,
          width: 0,
          height: 0,
        });
      };

      img.onload = () => {
        try {
          const origWidth = img.naturalWidth || img.width;
          const origHeight = img.naturalHeight || img.height;

          if (!origWidth || !origHeight) {
            return resolve({
              dataUrl: rawDataUrl,
              originalSize: file.size,
              width: 0,
              height: 0,
            });
          }

          // Target square size (max 900px to keep storage usage low and quality high)
          const maxDimension = Math.max(origWidth, origHeight);
          const targetSize = Math.min(maxDimension, 900);

          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve({
              dataUrl: rawDataUrl,
              originalSize: file.size,
              width: origWidth,
              height: origHeight,
            });
          }

          // High-quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Center without distortion inside square canvas
          const scale = Math.min(targetSize / origWidth, targetSize / origHeight);
          const drawWidth = Math.round(origWidth * scale);
          const drawHeight = Math.round(origHeight * scale);
          const drawX = Math.round((targetSize - drawWidth) / 2);
          const drawY = Math.round((targetSize - drawHeight) / 2);

          // Clear transparent background
          ctx.clearRect(0, 0, targetSize, targetSize);
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

          // Determine optimal format: PNG for PNG to preserve alpha, otherwise JPEG
          const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
          const outputFormat = isPng ? 'image/png' : 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(outputFormat, isPng ? 0.9 : 0.85);

          resolve({
            dataUrl: compressedDataUrl,
            originalSize: file.size,
            width: targetSize,
            height: targetSize,
          });
        } catch {
          // Fallback if canvas export throws
          resolve({
            dataUrl: rawDataUrl,
            originalSize: file.size,
            width: 0,
            height: 0,
          });
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
