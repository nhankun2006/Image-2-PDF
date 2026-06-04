/**
 * File System Helpers
 *
 * Wrappers around expo-file-system (SDK 56) and expo-sharing for sharing,
 * deleting, and inspecting PDF files stored on-device.
 *
 * Uses the new File/Paths API instead of the deprecated legacy functions.
 */

import { File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// ---------------------------------------------------------------------------
// Sharing
// ---------------------------------------------------------------------------

/**
 * Opens the native share sheet for a local PDF file.
 */
export async function sharePdf(pdfPath: string): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(pdfPath, {
    mimeType: 'application/pdf',
    dialogTitle: 'Share PDF Document',
    UTI: 'com.adobe.pdf',
  });
}

// ---------------------------------------------------------------------------
// Deletion
// ---------------------------------------------------------------------------

/**
 * Deletes a PDF file from the device document directory.
 */
export function deletePdf(pdfPath: string): void {
  const file = new File(pdfPath);
  if (file.exists) {
    file.delete();
  }
}

// ---------------------------------------------------------------------------
// File Info
// ---------------------------------------------------------------------------

/**
 * Returns the file size in bytes, or 0 if the file doesn't exist.
 */
export function getPdfFileSize(pdfPath: string): number {
  const file = new File(pdfPath);
  if (file.exists) {
    return file.size;
  }
  return 0;
}

/**
 * Formats a byte count into a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
