export type PageSize = 'A4' | 'Letter' | 'FitImage';
export type Orientation = 'Portrait' | 'Landscape';
export type CompressionQuality = 'Low' | 'Medium' | 'High';
export type CompressionMode = 'Direct' | 'Native';

export interface PdfConfig {
  pageSize: PageSize;
  orientation: Orientation;
  quality: CompressionQuality;
  compressionMode: CompressionMode;
}
