import sharp from 'sharp';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

export async function optimizeImage(
  buffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<Buffer> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 80,
    format = 'webp',
  } = options;

  let pipeline = sharp(buffer);

  // Get image metadata
  const metadata = await pipeline.metadata();

  // Resize if image is larger than max dimensions
  if (
    metadata.width &&
    metadata.height &&
    (metadata.width > maxWidth || metadata.height > maxHeight)
  ) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert to specified format with compression
  switch (format) {
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
      break;
  }

  return pipeline.toBuffer();
}

export function getOptimizedFileName(
  originalName: string,
  format: string
): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const sanitizedName = nameWithoutExt.replace(/\s+/g, '_');
  return `${Date.now()}-${sanitizedName}.${format}`;
}

export function getContentType(format: string): string {
  const contentTypes: Record<string, string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
  };
  return contentTypes[format] || 'image/webp';
}
