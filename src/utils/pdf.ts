/**
 * PDF Generation Engine
 *
 * Uses pdf-lib (pure JS) to compile an array of local image URIs into a single
 * PDF file. All processing is 100% on-device — no network calls.
 *
 * Supports configurable page sizes (A4, Letter, Fit Image), orientation
 * (Portrait, Landscape), and image compression quality levels.
 *
 * Uses the new expo-file-system SDK 56 API (File, Paths classes).
 */

import { PDFDocument } from 'pdf-lib';
import { File, Paths } from 'expo-file-system';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PageSize = 'A4' | 'Letter' | 'FitImage';
export type Orientation = 'Portrait' | 'Landscape';
export type CompressionQuality = 'Low' | 'Medium' | 'High';

export interface PdfConfig {
  pageSize: PageSize;
  orientation: Orientation;
  quality: CompressionQuality;
}

export interface GeneratePdfOptions {
  imageUris: string[];
  config: PdfConfig;
  pdfFileName?: string;
  onProgress?: (progress: number) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Standard page dimensions in PDF points (1 point = 1/72 inch). */
const PAGE_DIMENSIONS: Record<PageSize, { width: number; height: number }> = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
  FitImage: { width: 0, height: 0 }, // determined per image
};

/** Maps compression quality labels to expo-image-picker quality values. */
export const QUALITY_VALUES: Record<CompressionQuality, number> = {
  Low: 0.3,
  Medium: 0.6,
  High: 0.9,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns { pageWidth, pageHeight } respecting orientation.
 * For `FitImage`, the dimensions match the embedded image.
 */
function resolvePageDimensions(
  config: PdfConfig,
  imageWidth: number,
  imageHeight: number,
): { pageWidth: number; pageHeight: number } {
  if (config.pageSize === 'FitImage') {
    return { pageWidth: imageWidth, pageHeight: imageHeight };
  }

  const base = PAGE_DIMENSIONS[config.pageSize];
  const isLandscape = config.orientation === 'Landscape';

  return {
    pageWidth: isLandscape ? base.height : base.width,
    pageHeight: isLandscape ? base.width : base.height,
  };
}

/**
 * Computes draw coordinates so the image is centered on the page while
 * maintaining its aspect ratio (contain-fit).
 */
function computeDrawRect(
  pageW: number,
  pageH: number,
  imgW: number,
  imgH: number,
): { x: number; y: number; width: number; height: number } {
  const scale = Math.min(pageW / imgW, pageH / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  return {
    x: (pageW - drawW) / 2,
    y: (pageH - drawH) / 2,
    width: drawW,
    height: drawH,
  };
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

/**
 * Compiles a list of local image URIs into a single PDF file.
 * Returns the local file URI of the generated PDF.
 */
export async function generatePdfFromImages({
  imageUris,
  config,
  pdfFileName,
  onProgress,
}: GeneratePdfOptions): Promise<string> {
  if (imageUris.length === 0) {
    throw new Error('No images selected for PDF generation.');
  }

  const timestamp = Date.now();
  const fileName = pdfFileName ?? `ImageToPDF_${timestamp}.pdf`;
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < imageUris.length; i++) {
    const uri = imageUris[i];

    // Read the image file as base64 using the new File API
    const imageFile = new File(uri);
    const base64Data = await imageFile.base64();

    // Embed PNG or JPEG
    const isPng = uri.toLowerCase().endsWith('.png');
    const embeddedImage = isPng
      ? await pdfDoc.embedPng(base64Data)
      : await pdfDoc.embedJpg(base64Data);

    const { width: imgW, height: imgH } = embeddedImage.scale(1);

    // Determine page dimensions
    const { pageWidth, pageHeight } = resolvePageDimensions(config, imgW, imgH);

    // Add page and draw image centered
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    if (config.pageSize === 'FitImage') {
      // Image fills the entire page — no letterboxing
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });
    } else {
      const rect = computeDrawRect(pageWidth, pageHeight, imgW, imgH);
      page.drawImage(embeddedImage, rect);
    }

    onProgress?.((i + 1) / imageUris.length);
  }

  // Serialize to base64 and write to document directory
  const pdfBase64 = await pdfDoc.saveAsBase64();
  const outputFile = new File(Paths.document, fileName);

  // Write base64-decoded bytes using Uint8Array
  const binaryString = atob(pdfBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  outputFile.write(bytes);

  return outputFile.uri;
}
