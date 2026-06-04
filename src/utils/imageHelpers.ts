/**
 * Image Selection Helpers
 *
 * Wrappers around expo-image-picker for gallery multi-select and camera capture.
 * All processing stays on-device — no uploads or telemetry.
 */

import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

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
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Please grant access to your photo library to select images.',
    );
    return [];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    quality,
    orderedSelection: true,
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.map((asset) => asset.uri);
}

// ---------------------------------------------------------------------------
// Camera Capture
// ---------------------------------------------------------------------------

/**
 * Opens the device camera to take a single photo.
 * Returns an array with one URI, or an empty array if cancelled.
 */
export async function takePhoto(quality: number = 0.8): Promise<string[]> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Please grant camera access to take photos.',
    );
    return [];
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality,
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.map((asset) => asset.uri);
}
