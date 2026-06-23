import { NativeModule, requireNativeModule } from 'expo';

export type PdfProgressEvent = {
  current: number;
  total: number;
  progress: number; // 0..1
};

declare class NativeEngineModule extends NativeModule<{
  onPdfProgress: (event: PdfProgressEvent) => void;
}> {
  generatePdf(imageUris: string[], pageSize: string, orientation: string, quality: string, compressionMode: string): Promise<string>;
  pickImages(): Promise<string[]>;
  takePhoto(): Promise<string[]>;
  sharePdf(pdfUri: string): Promise<void>;
}

export default requireNativeModule<NativeEngineModule>('NativeEngine');
