/**
 * usePdfGenerator Hook
 *
 * Orchestrates PDF generation:
 *   1. Validates inputs
 *   2. Manages loading / progress state
 *   3. Calls the NativeEngine for pure Java PDF generation
 *   4. Triggers native share sheet
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { ImageItem } from '@/hooks/useImageList';
import { PdfConfig } from '@/types/pdf';
import { sharePdf } from '@/utils/fileHelpers';
import NativeEngineModule from '../../modules/native-engine';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePdfGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generate = useCallback(
    async (images: ImageItem[], config: PdfConfig) => {
      if (images.length === 0) {
        Alert.alert('No Images', 'Please add at least one image to generate a PDF.');
        return;
      }

      setIsGenerating(true);
      setProgress(0); // Native module doesn't stream progress yet, so we just show indeterminate loader

      try {
        const uris = images.map((img) => img.uri);
        
        // The native module handles everything asynchronously in a background thread
        const pdfPath = await NativeEngineModule.generatePdf(
          uris,
          config.pageSize,
          config.orientation,
          config.quality
        );

        setProgress(1);

        // Trigger native share sheet
        try {
          await sharePdf(pdfPath);
        } catch {
          // User may dismiss share sheet — that's OK
        }

        return pdfPath;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An unknown error occurred.';
        Alert.alert('Generation Failed', message);
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [],
  );

  return {
    generate,
    isGenerating,
    progress,
  };
}
