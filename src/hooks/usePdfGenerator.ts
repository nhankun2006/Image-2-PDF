/**
 * usePdfGenerator Hook
 *
 * Orchestrates PDF generation:
 *   1. Validates inputs
 *   2. Manages loading / progress state
 *   3. Calls the pdf.ts generation engine
 *   4. Saves to history via usePdfHistory
 *   5. Optionally triggers native share sheet
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { ImageItem } from '@/hooks/useImageList';
import { usePdfHistory } from '@/hooks/usePdfHistory';
import { generatePdfFromImages, PdfConfig } from '@/utils/pdf';
import { sharePdf } from '@/utils/fileHelpers';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePdfGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { records, isLoading: isHistoryLoading, addRecord, removeRecord, clearHistory } =
    usePdfHistory();

  const generate = useCallback(
    async (images: ImageItem[], config: PdfConfig) => {
      if (images.length === 0) {
        Alert.alert('No Images', 'Please add at least one image to generate a PDF.');
        return;
      }

      setIsGenerating(true);
      setProgress(0);

      try {
        const uris = images.map((img) => img.uri);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
        const fileName = `ImageToPDF_${timestamp}.pdf`;

        const pdfPath = await generatePdfFromImages({
          imageUris: uris,
          config,
          pdfFileName: fileName,
          onProgress: setProgress,
        });

        // Save to history
        await addRecord(pdfPath, fileName);

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
    [addRecord],
  );

  return {
    generate,
    isGenerating,
    progress,
    // History pass-through
    records,
    isHistoryLoading,
    removeRecord,
    clearHistory,
  };
}
