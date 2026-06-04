/**
 * usePdfHistory Hook
 *
 * Persists a list of generated PDF records in AsyncStorage.
 * Each record stores the file name, creation date, file size, and local path.
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { deletePdf, getPdfFileSize } from '@/utils/fileHelpers';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PdfRecord {
  id: string;
  name: string;
  createdAt: string; // ISO 8601
  fileSize: number; // bytes
  filePath: string;
}

// ---------------------------------------------------------------------------
// Storage Key
// ---------------------------------------------------------------------------

const STORAGE_KEY = '@imagetopdf/pdf_history';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePdfHistory() {
  const [records, setRecords] = useState<PdfRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load records from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setRecords(JSON.parse(raw) as PdfRecord[]);
        }
      } catch (e) {
        console.warn('Failed to load PDF history:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Persist whenever records change
  const persist = useCallback(async (updated: PdfRecord[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist PDF history:', e);
    }
  }, []);

  /**
   * Add a new PDF record after generation.
   */
  const addRecord = useCallback(
    async (filePath: string, fileName: string) => {
      const fileSize = getPdfFileSize(filePath);
      const record: PdfRecord = {
        id: Date.now().toString(),
        name: fileName,
        createdAt: new Date().toISOString(),
        fileSize,
        filePath,
      };
      const updated = [record, ...records];
      setRecords(updated);
      await persist(updated);
      return record;
    },
    [records, persist],
  );

  /**
   * Delete a PDF record and its file from the device.
   */
  const removeRecord = useCallback(
    async (id: string) => {
      const record = records.find((r) => r.id === id);
      if (record) {
        deletePdf(record.filePath);
      }
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      await persist(updated);
    },
    [records, persist],
  );

  /**
   * Clear all history and delete all PDF files.
   */
  const clearHistory = useCallback(async () => {
    for (const record of records) {
      deletePdf(record.filePath);
    }
    setRecords([]);
    await persist([]);
  }, [records, persist]);

  return {
    records,
    isLoading,
    addRecord,
    removeRecord,
    clearHistory,
  };
}
