export type PageSize = 'A4' | 'Letter' | 'FitImage';
export type Orientation = 'Portrait' | 'Landscape';
export type CompressionMode = 'Origin' | 'Decompress';
export type CompressionQuality = 'Low' | 'Medium' | 'High';

export interface PdfConfig {
  pageSize: PageSize;
  orientation: Orientation;
  compressionMode: CompressionMode;
  quality: CompressionQuality;
}
