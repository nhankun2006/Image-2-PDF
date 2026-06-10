/**
 * File System Helpers
 *
 * Wrapper around NativeEngine for sharing generated PDFs via pure Android intents.
 */

import { Alert } from 'react-native';
import NativeEngineModule from '../../modules/native-engine';

// ---------------------------------------------------------------------------
// Sharing
// ---------------------------------------------------------------------------

/**
 * Opens the native share sheet for a local PDF file.
 */
export async function sharePdf(pdfPath: string): Promise<void> {
  try {
    await NativeEngineModule.sharePdf(pdfPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    Alert.alert('Sharing Failed', `Could not share PDF: ${message}`);
  }
}
