/**
 * Image Selection Helpers
 *
 * Wrappers around NativeEngine for gallery multi-select and camera capture.
 * All processing stays on-device using pure native Android intents.
 */

import { Alert } from 'react-native';
import NativeEngineModule from '../../modules/native-engine';

// ---------------------------------------------------------------------------
// Gallery Selection
// ---------------------------------------------------------------------------

/**
 * Opens the device gallery for multi-image selection.
 * Returns an array of local image URIs, or an empty array if cancelled.
 */
export async function pickImagesFromGallery(
  quality: number = 0.8,
): Promise<string[]> {
  try {
    const uris = await NativeEngineModule.pickImages();
    return uris;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    Alert.alert('Gallery Error', `Failed to open gallery: ${message}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Camera Capture
// ---------------------------------------------------------------------------

/**
 * Opens the device camera to take a single photo.
 * Returns an array with one URI, or an empty array if cancelled.
 */
export async function takePhoto(quality: number = 0.8): Promise<string[]> {
  try {
    const uris = await NativeEngineModule.takePhoto();
    return uris;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    Alert.alert('Camera Error', `Failed to open camera: ${message}`);
    return [];
  }
}
