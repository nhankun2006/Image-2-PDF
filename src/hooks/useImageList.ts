/**
 * useImageList Hook
 *
 * Manages the ordered list of selected images with add, remove, reorder,
 * rotate, and clear operations. Rotation tracking uses a simple map of
 * URI → degrees for lightweight state.
 */

import { useCallback, useState } from 'react';

export interface ImageItem {
  uri: string;
  rotation: number; // 0, 90, 180, 270
}

export function useImageList() {
  const [images, setImages] = useState<ImageItem[]>([]);

  const addImages = useCallback((uris: string[]) => {
    const newItems: ImageItem[] = uris.map((uri) => ({ uri, rotation: 0 }));
    setImages((prev) => [...prev, ...newItems]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setImages((prev) => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setImages((prev) => {
      if (index >= prev.length - 1) return prev;
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated;
    });
  }, []);

  const rotateImage = useCallback((index: number) => {
    setImages((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, rotation: (item.rotation + 90) % 360 } : item,
      ),
    );
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    addImages,
    removeImage,
    moveUp,
    moveDown,
    rotateImage,
    clearImages,
    count: images.length,
  };
}
