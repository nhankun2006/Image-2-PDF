/**
 * File System Helpers
 *
 * Wrapper around expo-sharing for sharing generated PDFs.
 */

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
